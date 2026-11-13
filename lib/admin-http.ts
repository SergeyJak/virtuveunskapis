import { AdminError } from './admin-store'

export function assertOrigin(request: Request) {
  const expected = process.env.SITE_ORIGIN || new URL(request.url).origin
  const allowed = new Set([expected])
  for (const candidate of (process.env.ADDITIONAL_SITE_ORIGINS || '').split(',')) {
    const origin = candidate.trim()
    if (!origin) continue
    try {
      const parsed = new URL(origin)
      if (parsed.protocol === 'https:' && parsed.origin === origin) allowed.add(origin)
    } catch { /* Invalid configured origins fail closed. */ }
  }
  // Railway supplies this hostname; never trust client Host or forwarded headers.
  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN
  if (railwayDomain && /^[a-z0-9-]+\.up\.railway\.app$/i.test(railwayDomain)) allowed.add(`https://${railwayDomain.toLowerCase()}`)
  if (!allowed.has(request.headers.get('origin') || '')) throw new AdminError('Недопустимый источник запроса.', 403)
}
export async function readBody(request: Request, max: number) {
  const declared = Number(request.headers.get('content-length'))
  if (declared > max) throw new AdminError('Превышен размер запроса.', 413)
  const reader = request.body?.getReader()
  if (!reader) return Buffer.alloc(0)
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.length
      if (length > max) { await reader.cancel(); throw new AdminError('Превышен размер запроса.', 413) }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return Buffer.concat(chunks)
}
export async function readJson(request: Request, max = 32 * 1024): Promise<Record<string, unknown>> {
  try {
    const value: unknown = JSON.parse((await readBody(request, max)).toString('utf8'))
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('object required')
    return value as Record<string, unknown>
  } catch (e) { if (e instanceof AdminError) throw e; throw new AdminError('Некорректный JSON.') }
}
const buckets = new Map<string, { count: number; reset: number }>()
export function rateLimit(key: string, limit: number, windowMs = 60000) {
  const now = Date.now()
  if (buckets.size > 10000) for (const [id, value] of buckets) if (value.reset < now) buckets.delete(id)
  const bucket = buckets.get(key)
  if (bucket && bucket.reset > now) {
    if (bucket.count >= limit) throw new AdminError('Слишком много запросов. Попробуйте позже.', 429)
    bucket.count++
  } else {
    if (buckets.size >= 20000) throw new AdminError('Попробуйте позже.', 429)
    buckets.set(key, { count: 1, reset: now + windowMs })
  }
}
export function clientIp(headers: Headers) {
  if (process.env.TRUST_PROXY_HEADERS !== 'true') return ''
  // Enable only when the proxy overwrites these headers and direct server access is blocked.
  return (headers.get('x-real-ip') || headers.get('x-forwarded-for')?.split(',')[0] || '').trim().slice(0, 64)
}
export function json(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
}
export function apiError(error: unknown) {
  if (error instanceof AdminError) return json({ error: error.message }, error.status)
  console.error('Admin API failure:', error instanceof Error ? error.message : 'unknown')
  return json({ error: 'Ошибка сервера. Проверьте конфигурацию и хранилище.' }, 500)
}
