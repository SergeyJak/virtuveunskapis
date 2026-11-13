'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function VisitorTracker() {
  const pathname = usePathname()
  const search = useSearchParams()
  const query = search.toString()
  const previousPath = useRef<string | null>(null)
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    function send(eventType: string, target = '') {
      try {
        const now = Date.now()
        let visitor = JSON.parse(localStorage.getItem('portfolio:visitor:v1') || 'null')
        if (!visitor || typeof visitor.id !== 'string' || now - visitor.created > 90 * 86400000) {
          visitor = { id: crypto.randomUUID(), created: now }
          localStorage.setItem('portfolio:visitor:v1', JSON.stringify(visitor))
        }
        let session = JSON.parse(localStorage.getItem('portfolio:session:v1') || 'null')
        if (!session || typeof session.id !== 'string' || now - session.last > 30 * 60000) session = { id: crypto.randomUUID() }
        session.last = now
        localStorage.setItem('portfolio:session:v1', JSON.stringify(session))
        const body = JSON.stringify({ visitorId: visitor.id, sessionId: session.id, eventType, target, page: `${location.pathname}${location.search}`, referrer: document.referrer && new URL(document.referrer).origin !== location.origin ? document.referrer : '', locale: new URLSearchParams(location.search).get('lang') || 'lv' })
        void fetch('/api/public/analytics/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
      } catch { /* Storage-disabled browsers retain full access to the site. */ }
    }
    send('page_view')
    if (pathname.startsWith('/projects/')) send('project_view')
    const category = new URLSearchParams(query).get('category')
    if (pathname === '/portfolio' && previousPath.current !== pathname && category) send('category_select', category)
    previousPath.current = pathname
    function categoryChange(event: Event) {
      const category = (event as CustomEvent<{ category?: string }>).detail?.category || 'all'
      send('category_select', category)
    }
    function click(event: MouseEvent) {
      if (!(event.target instanceof Element)) return
      const link = event.target.closest('a')
      const href = link?.getAttribute('href') || ''
      const target = href.startsWith('tel:') ? 'tel' : href.startsWith('mailto:') ? 'email' : /wa.me|whatsapp.com/.test(href) ? 'whatsapp' : /t.me\//.test(href) ? 'telegram' : ''
      if (target) send('contact_click', target)
      const button = event.target.closest('button[data-analytics-category]')
      if (button) send('category_select', button.getAttribute('data-analytics-category') || '')
    }
    document.addEventListener('click', click)
    window.addEventListener('portfolio-category-change', categoryChange)
    return () => { document.removeEventListener('click', click); window.removeEventListener('portfolio-category-change', categoryChange) }
  }, [pathname, query])
  return null
}
