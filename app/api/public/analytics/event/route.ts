import { recordEvent } from '@/lib/admin-analytics'
import { apiError, assertOrigin, clientIp, rateLimit, readJson } from '@/lib/admin-http'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  try {
    assertOrigin(request)
    if (process.env.ANALYTICS_ENABLED === 'false') return new Response(null, { status: 204 })
    rateLimit('events:global', 600)
    rateLimit(`events:${clientIp(request.headers) || 'shared'}`, 120)
    await recordEvent(await readJson(request, 4096), request.headers)
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return apiError(error) }
}
