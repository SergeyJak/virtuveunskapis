import { readMedia } from '@/lib/admin-projects'
import { apiError } from '@/lib/admin-http'

export const runtime = 'nodejs'
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { data, contentType } = await readMedia((await params).name)
    return new Response(new Uint8Array(data), { headers: { 'Content-Type': contentType, 'Content-Length': String(data.length), 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox" } })
  } catch (error) { return apiError(error) }
}
