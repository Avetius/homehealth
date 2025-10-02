#!/usr/bin/env python3
"""
Generate PDF417 barcodes from multiple input strings.

Requirements:
    pip install pdf417gen Pillow

Usage examples:
    # single inputs
    python tools/generate_pdf417.py "Alice|DOB:1990-01-01|ID:1234" "Bob|ID:5678"

    # read inputs from a file (one value per line)
    python tools/generate_pdf417.py --input-file ids.txt --out-dir out

    # combine all generated barcodes into a single PDF
    python tools/generate_pdf417.py --input-file ids.txt --out-dir out --pdf combined.pdf

The script writes one PNG per input by default and can optionally produce a single PDF containing all barcodes.
"""

import argparse
import os
from pathlib import Path
from typing import List

try:
    import pdf417gen as pdf417
except Exception:
    pdf417 = None

try:
    from PIL import Image
except Exception:
    Image = None


def safe_filename(s: str) -> str:
    # create a short safe filename from the content
    keep = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
    slug = []
    for ch in s:
        if ch in keep:
            slug.append(ch)
        else:
            slug.append('_')
    out = ''.join(slug)
    out = out.strip('_')
    if len(out) == 0:
        out = 'barcode'
    # keep filename reasonably short
    return out[:64]


def generate_barcodes(values: List[str], out_dir: Path, columns: int, security_level: int, scale: int, fmt: str) -> List[Path]:
    if pdf417 is None:
        raise RuntimeError("pdf417gen package not found. Install with: pip install pdf417gen")
    if fmt == 'png' and Image is None:
        raise RuntimeError("Pillow not found. Install with: pip install Pillow")

    out_dir.mkdir(parents=True, exist_ok=True)
    saved_paths: List[Path] = []

    for i, v in enumerate(values, start=1):
        v_str = v.strip()
        if not v_str:
            continue
        codes = pdf417.encode(v_str, columns=columns, security_level=security_level)

        base = safe_filename(v_str)
        if fmt == 'svg':
            # pdf417gen may provide render_svg; if not, fall back to embedding a PNG
            svg_data = None
            if hasattr(pdf417, 'render_svg'):
                svg_data = pdf417.render_svg(codes, scale=scale)
                # render_svg may return an XML string or an Element; ensure string
                if not isinstance(svg_data, str):
                    svg_data = str(svg_data)
            if svg_data is None:
                # fallback: render PNG and embed as base64 inside an SVG wrapper
                if Image is None:
                    raise RuntimeError("Pillow required for SVG fallback. Install with: pip install Pillow")
                img = pdf417.render_image(codes, scale=scale)
                import io, base64
                buf = io.BytesIO()
                img.save(buf, format='PNG')
                b64 = base64.b64encode(buf.getvalue()).decode('ascii')
                width, height = img.size
                svg_data = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">\n'
                svg_data += f'<image href="data:image/png;base64,{b64}" width="{width}" height="{height}" />\n'
                svg_data += '</svg>'

            filename = f"{i:03d}_{base}.svg"
            path = out_dir / filename
            path.write_text(svg_data, encoding='utf-8')
            saved_paths.append(path)
            print(f"Saved: {path}")
        else:
            # png
            img = pdf417.render_image(codes, scale=scale)
            filename = f"{i:03d}_{base}.png"
            path = out_dir / filename
            img.save(path)
            saved_paths.append(path)
            print(f"Saved: {path}")

    return saved_paths


def combine_into_pdf(image_paths: List[Path], out_pdf: Path):
    if not Image:
        raise RuntimeError("Pillow not found. Install with: pip install Pillow")
    if not image_paths:
        raise RuntimeError("No images to combine")

    imgs = [Image.open(p).convert('RGB') for p in image_paths]
    first, rest = imgs[0], imgs[1:]
    first.save(out_pdf, save_all=True, append_images=rest)
    print(f"Combined PDF saved: {out_pdf}")


def read_input_file(path: Path) -> List[str]:
    with path.open('r', encoding='utf-8') as f:
        lines = [line.rstrip('\n') for line in f]
    # filter out blank lines
    return [l for l in lines if l.strip()]


def main():
    parser = argparse.ArgumentParser(description='Generate PDF417 barcodes for multiple inputs')
    parser.add_argument('values', nargs='*', help='Input values (if not using --input-file)')
    parser.add_argument('--input-file', '-i', type=Path, help='Text file with one value per line')
    parser.add_argument('--out-dir', '-o', type=Path, default=Path('pdf417_out'), help='Output directory')
    parser.add_argument('--columns', '-c', type=int, default=6, help='PDF417 columns (recommended 3-10)')
    parser.add_argument('--security-level', '-s', type=int, default=2, help='PDF417 security level (0-8)')
    parser.add_argument('--scale', type=int, default=3, help='Rendering scale (integer, higher => larger image)')
    parser.add_argument('--format', '-f', choices=['png', 'svg'], default='png', help='Output format: png (default) or svg')
    parser.add_argument('--pdf', type=Path, help='Optional combined PDF output filename (only when output format is png)')

    args = parser.parse_args()

    values: List[str] = []
    if args.input_file:
        if not args.input_file.exists():
            parser.error(f"Input file not found: {args.input_file}")
        values = read_input_file(args.input_file)
    else:
        values = args.values

    if not values:
        parser.error('No input values provided (either positional values or --input-file required)')

    out_dir = args.out_dir
    fmt = args.format

    if fmt == 'svg' and args.pdf:
        parser.error('PDF combination is only supported when generating PNGs. Use --format png to produce a combined PDF.')

    saved = generate_barcodes(values, out_dir, columns=args.columns, security_level=args.security_level, scale=args.scale, fmt=fmt)

    if args.pdf:
        combine_into_pdf(saved, args.pdf)


if __name__ == '__main__':
    main()
