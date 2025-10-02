import { promises as fs } from 'fs'
import { join } from 'path'

export default async (event: any) => {
  const body = await readMultipartFormData(event)
  // body is an array of parts when using readMultipartFormData
  if (!body) return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid multipart request' }))

  const uploadsDir = join(process.cwd(), 'storage', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  for (const part of body) {
    if (part.type === 'file' && part.filename) {
      const filename = `${Date.now()}_${part.filename}`
      const buf = Buffer.from(await part.toBuffer())
      await fs.writeFile(join(uploadsDir, filename), buf)
    }
  }

  return { ok: true }
}
