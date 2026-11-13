import { randomUUID } from 'node:crypto'
import { AdminError, mutateDocument, readDocument } from './admin-store'
import { clientIp } from './admin-http'

export type AnalyticsEvent = {
  id: string; timestamp: string; visitorId: string; sessionId: string; eventType: string; page: string;
  referrer: string; locale: string; target: string; device: string; browser: string; bot: boolean; ip: string; source: string;
}
const idPattern = /^[a-zA-Z0-9_-]{8,100}$/
const types = new Set(['page_view', 'project_view', 'category_select', 'contact_click'])
function safeUrl(value: unknown, external = false) {
  if (typeof value !== 'string') return ''
  try {
    const url = new URL(value.slice(0, 2048), 'https://local.invalid')
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    if (external) return url.origin === 'https://local.invalid' ? '' : url.origin
    const query = new URLSearchParams()
    for (const key of ['category', 'lang', 'utm_source', 'utm_medium', 'utm_campaign']) {
      const val = url.searchParams.get(key)
      if (val) query.set(key, val.slice(0, 120))
    }
    return `${url.pathname.slice(0, 300)}${query.size ? `?${query}` : ''}`
  } catch { return '' }
}
function validateEvents(events: AnalyticsEvent[]): void {
  if (!Array.isArray(events) || events.some(e => !e || !idPattern.test(e.visitorId) || !idPattern.test(e.sessionId) || !types.has(e.eventType) || typeof e.id !== 'string' || !Number.isFinite(Date.parse(e.timestamp)) || ['visitorId','sessionId','timestamp','page','referrer','locale','target','device','browser','ip','source'].some(key => typeof e[key as keyof AnalyticsEvent] !== 'string') || typeof e.bot !== 'boolean')) {
    throw new AdminError('Повреждено хранилище аналитики.', 500)
  }
}
function retentionDays() { return Math.min(365, Math.max(1, Number(process.env.ANALYTICS_RETENTION_DAYS) || 90)) }
export async function recordEvent(input: Record<string, unknown>, headers: Headers) {
  if (!idPattern.test(String(input.visitorId || '')) || !idPattern.test(String(input.sessionId || '')) || !types.has(String(input.eventType))) throw new AdminError('Некорректное событие.')
  const page = safeUrl(input.page)
  if (!page.startsWith('/') || page.split('?')[0].startsWith('/admin')) throw new AdminError('Некорректная страница.')
  const ua = (headers.get('user-agent') || '').slice(0, 512)
  const referrer = safeUrl(input.referrer, true)
  const query = new URL(page, 'https://local.invalid').searchParams
  const event: AnalyticsEvent = {
    id: randomUUID(), timestamp: new Date().toISOString(), visitorId: String(input.visitorId), sessionId: String(input.sessionId), eventType: String(input.eventType), page,
    referrer, locale: ['lv', 'ru', 'en'].includes(String(input.locale)) ? String(input.locale) : '',
    target: ['tel', 'email', 'whatsapp', 'telegram', 'kitchens', 'wardrobes', 'bathrooms', 'all'].includes(String(input.target)) ? String(input.target) : '',
    device: /ipad|tablet/i.test(ua) ? 'Планшет' : /mobile|android|iphone/i.test(ua) ? 'Телефон' : 'Компьютер',
    browser: /edg\//i.test(ua) ? 'Edge' : /firefox/i.test(ua) ? 'Firefox' : /chrome/i.test(ua) ? 'Chrome' : /safari/i.test(ua) ? 'Safari' : 'Другой',
    bot: /bot|spider|crawler|headless/i.test(ua), ip: clientIp(headers),
    source: query.get('utm_source') || (referrer ? new URL(referrer).hostname : 'direct'),
  }
  await mutateDocument<AnalyticsEvent[]>('analytics.json', [], events => {
    validateEvents(events)
    const cutoff = Date.now() - retentionDays() * 86400000
    return [...events.filter(e => Date.parse(e.timestamp) >= cutoff).slice(-49999), event]
  })
}
export type VisitorRow = {
  visitorId: string; firstSeen: string; lastSeen: string; sessions: number; pageViews: number; contactClicks: number;
  device: string; browser: string; locale: string; source: string; landingPage: string; lastPage: string; ip: string; eventCount: number;
}
function range(query: URLSearchParams) {
  const days = Math.min(365, Math.max(1, Number(query.get('days')) || 30))
  const from = query.get('from') ? Date.parse(`${query.get('from')}T00:00:00.000Z`) : Date.now() - days * 86400000
  const to = query.get('to') ? Date.parse(`${query.get('to')}T23:59:59.999Z`) : Date.now()
  if (!Number.isFinite(from) || !Number.isFinite(to) || from > to) throw new AdminError('Проверьте диапазон дат.')
  return { from, to }
}
async function filteredEvents(query: URLSearchParams) {
  const { from, to } = range(query)
  const events = await readDocument<AnalyticsEvent[]>('analytics.json', [])
  validateEvents(events)
  const cutoff = Date.now() - retentionDays() * 86400000
  return events.filter(e => Date.parse(e.timestamp) >= Math.max(from, cutoff) && Date.parse(e.timestamp) <= to && (query.get('includeBots') === 'true' || !e.bot))
}
function aggregate(events: AnalyticsEvent[]): VisitorRow[] {
  const groups = new Map<string, AnalyticsEvent[]>()
  for (const e of events) { const group = groups.get(e.visitorId) || []; group.push(e); groups.set(e.visitorId, group) }
  return [...groups].map(([visitorId, values]) => {
    values.sort((a,b) => a.timestamp.localeCompare(b.timestamp))
    const first = values[0], last = values[values.length - 1]
    return { visitorId, firstSeen: first.timestamp, lastSeen: last.timestamp, sessions: new Set(values.map(e => e.sessionId)).size,
      pageViews: values.filter(e => e.eventType === 'page_view').length, contactClicks: values.filter(e => e.eventType === 'contact_click').length,
      device: last.device, browser: last.browser, locale: last.locale, source: first.source, landingPage: first.page, lastPage: last.page, ip: last.ip, eventCount: values.length }
  })
}
export async function listVisitors(query: URLSearchParams) {
  const events = await filteredEvents(query)
  const all = aggregate(events)
  const search = (query.get('search') || '').slice(0, 120).toLowerCase()
  const rows = all.filter(row => !search || [row.visitorId, row.ip, row.source, row.locale, row.device, row.lastPage].some(v => v.toLowerCase().includes(search)))
  const sort = query.get('sort') === 'pageViews' ? 'pageViews' : 'lastSeen'
  rows.sort((a,b) => sort === 'pageViews' ? b.pageViews - a.pageViews : b.lastSeen.localeCompare(a.lastSeen))
  const page = Math.max(1, Math.min(100000, Math.floor(Number(query.get('page')) || 1)))
  const limit = 25
  const days = new Map<string, number>()
  for (const e of events) if (e.eventType === 'page_view') { const day = e.timestamp.slice(0,10); days.set(day, (days.get(day) || 0) + 1) }
  return { items: rows.slice((page-1)*limit,page*limit), total: rows.length, page, limit,
    summary: { uniqueVisitors: all.length, sessions: new Set(events.map(e => `${e.visitorId}:${e.sessionId}`)).size, pageViews: events.filter(e => e.eventType === 'page_view').length,
      returningVisitors: all.filter(e => e.sessions > 1).length, contactClicks: events.filter(e => e.eventType === 'contact_click').length },
    trend: [...days].sort(([a],[b]) => a.localeCompare(b)).map(([date, views]) => ({ date, views })), retentionDays: retentionDays(),
  }
}
export async function visitorDetail(id: string, query: URLSearchParams) {
  if (!idPattern.test(id)) throw new AdminError('Некорректный посетитель.')
  const events = (await filteredEvents(query)).filter(e => e.visitorId === id)
  const visitor = aggregate(events)[0]
  if (!visitor) throw new AdminError('Посетитель не найден в выбранном периоде.', 404)
  return { visitor, events: events.sort((a,b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 1000) }
}
