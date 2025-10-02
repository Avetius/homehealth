// Advanced barcode decoding helper
// Supports: image buffers and PDF rasterization (first page)
// Uses: pdfjs-dist to rasterize PDFs, Jimp for preprocessing, and ZXing (@zxing/library) to decode

import { Buffer } from 'buffer'
// @ts-ignore
import Jimp from 'jimp'
// @ts-ignore - import the CJS bundle and destructure its exports to work with ESM loader
// Dynamically load the ZXing CJS bundle at runtime to avoid ESM/CJS named-export issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _zxingPkg: any = null
async function loadZXing() {
  if (_zxingPkg) return _zxingPkg
  // dynamic import returns a namespace object; for CJS bundles the exports are on the `default` property
  const mod: any = await import('@zxing/library/cjs/browser.js')
  _zxingPkg = (mod && mod.default) ? mod.default : mod
  return _zxingPkg
}
// pdf rendering
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
// canvas for node
// @ts-ignore
import { createCanvas } from 'canvas'

async function rasterizePdfFirstPage(buffer: Buffer): Promise<Buffer> {
  const loadingTask = pdfjsLib.getDocument({ data: buffer })
  const pdf = await loadingTask.promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 2 })
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
  const ctx = canvas.getContext('2d')
  const renderContext = {
    canvasContext: ctx,
    viewport
  }
  await page.render(renderContext).promise
  return canvas.toBuffer('image/png')
}

function imageToLuminanceArray(image: any) {
  const { data, width, height } = image.bitmap
  const luminances = new Uint8ClampedArray(width * height)
  for (let i = 0; i < width * height; i++) {
    luminances[i] = data[i * 4]
  }
  return { luminances, width, height }
}

async function tryDecodeWithJimp(jimpImg: any): Promise<string | null> {
  const { luminances, width, height } = imageToLuminanceArray(jimpImg)

  // load ZXing at runtime and get the classes we need
  const zx = await loadZXing()
  const { RGBLuminanceSource, BinaryBitmap, HybridBinarizer, BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } = zx

  const source = new RGBLuminanceSource(luminances, width, height)
  const binary = new BinaryBitmap(new HybridBinarizer(source))

  const reader: any = new BrowserMultiFormatReader()
  const hints = new Map()
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.PDF_417])
  try {
    const result = reader.decode(binary, hints)
    return result.getText()
  } catch (e) {
    try {
      const r2 = reader.decode(binary)
      return r2.getText()
    } catch (e2) {
      return null
    }
  }
}

export async function decodeBarcodeFromBuffer(buffer: Buffer): Promise<string | null> {
  // If PDF, rasterize first page
  const isPdf = buffer.slice(0, 4).toString('utf8') === '%PDF'
  const imageBuf = isPdf ? await rasterizePdfFirstPage(buffer) : buffer

  const rotations = [0, 90, 180, 270]
  const scales = [1, 1.5, 2]

  for (const rot of rotations) {
    for (const scale of scales) {
      const jimpImg = await Jimp.read(imageBuf)
      if (scale !== 1) jimpImg.resize(Math.ceil(jimpImg.bitmap.width * scale), Math.ceil(jimpImg.bitmap.height * scale))
      if (rot !== 0) jimpImg.rotate(rot)
      jimpImg.greyscale().contrast(0.25).normalize()
      const decoded = await tryDecodeWithJimp(jimpImg)
      if (decoded) return decoded
    }
  }

  return null
}
