// @ts-ignore
import { readMultipartFormData } from 'h3'
// @ts-ignore
import { decodeBarcodeFromBuffer } from '../utils/decodeBarcode'

import { Buffer } from 'buffer'

export default async (event: any) => {
  const partsRaw = await readMultipartFormData(event)
  const parts: any[] = Array.isArray(partsRaw) ? partsRaw : []
  if (!parts || parts.length === 0) {
    return { ok: false, error: 'No file uploaded' }
  }

  // find first file part
  const filePart: any = parts.find((p: any) => p.type === 'file')
  if (!filePart) return { ok: false, error: 'No file part' }

  // Convert to Buffer, supporting different runtime shapes
  let buf: Buffer | null = null
  if (filePart.toBuffer) {
    buf = Buffer.from(await filePart.toBuffer())
  } else if (filePart.data) {
    buf = Buffer.from(filePart.data)
  }
  if (!buf) return { ok: false, error: 'Could not read uploaded file' }

  const decoded = await decodeBarcodeFromBuffer(buf)

  if (!decoded) return { ok: false, error: 'No barcode found or could not decode' }
  return { ok: true, decoded }
}
