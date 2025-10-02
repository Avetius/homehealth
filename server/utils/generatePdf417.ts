// Helper to generate PDF417 barcode PNG buffers using bwip-js
// Note: requires bwip-js in project dependencies
// @ts-ignore
import bwipjs from 'bwip-js'

export async function generatePdf417Buffer(text: string, opts: any = {}): Promise<Buffer> {
  const png = await bwipjs.toBuffer({
    bcid: 'pdf417',
    text,
    scale: opts.scale || 3,
    height: opts.height || 10,
    includetext: false,
    ...opts
  })
  return png
}
