import { generatePdf417Buffer } from '../utils/generatePdf417'

export default async (event: any) => {
  const url = new URL(event.node.req.url, `http://${event.node.req.headers.host}`)
  const text = url.searchParams.get('text') || 'PDF417'
  try {
    const png = await generatePdf417Buffer(text)
    event.node.res.setHeader('Content-Type', 'image/png')
    return png
  } catch (e) {
    return { statusCode: 500, body: String(e) }
  }
}
