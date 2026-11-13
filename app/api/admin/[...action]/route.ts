import { NextRequest, NextResponse } from 'next/server'
import { authConfigured, checkPassword, COOKIE, createSession, requestSession, SESSION_SECONDS } from '@/lib/admin-auth'
import { apiError, assertOrigin, clientIp, json, rateLimit, readBody, readJson } from '@/lib/admin-http'
import { AdminError } from '@/lib/admin-store'
import { listAdminProjects, saveProject, uploadImages } from '@/lib/admin-projects'
import { listVisitors, visitorDetail } from '@/lib/admin-analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
async function handle(request: NextRequest, context: { params: Promise<{ action: string[] }> }) {
  try {
    const { action } = await context.params
    const key = action.join('/')
    if (request.method !== 'GET') assertOrigin(request)
    if (key === 'session' && request.method === 'GET') return json({ authenticated: requestSession(request), configured: authConfigured() })
    if (key === 'login' && request.method === 'POST') {
      rateLimit('login:global', 100, 15 * 60000)
      rateLimit(`login:${clientIp(request.headers) || 'shared'}`, 10, 15 * 60000)
      if (!authConfigured()) throw new AdminError('Настройте ADMIN_PASSWORD_HASH и ADMIN_SESSION_SECRET на сервере.', 503)
      const body = await readJson(request, 2048)
      if (typeof body.password !== 'string' || !checkPassword(body.password)) throw new AdminError('Неверный пароль.', 401)
      const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
      response.cookies.set(COOKIE, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: SESSION_SECONDS, path: '/' })
      return response
    }
    if (!requestSession(request)) throw new AdminError('Войдите в админку.', 401)
    if (key === 'logout' && request.method === 'POST') {
      const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
      response.cookies.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0, path: '/' })
      return response
    }
    if (key === 'projects' && request.method === 'GET') return json({ items: await listAdminProjects() })
    if (key === 'projects' && request.method === 'POST') return json({ project: await saveProject(await readJson(request)) })
    if (key === 'uploads' && request.method === 'POST') {
      rateLimit('uploads', 30)
      const body = await readBody(request, 32 * 1024 * 1024)
      const form = await new Request(request.url, { method: 'POST', headers: { 'Content-Type': request.headers.get('content-type') || '' }, body: new Uint8Array(body) }).formData()
      const files = form.getAll('files')
      if (files.some(file => typeof file === 'string')) throw new AdminError('Ожидались файлы.')
      return json({ images: await uploadImages(files as File[]) })
    }
    if (key === 'visitors' && request.method === 'GET') return json(await listVisitors(request.nextUrl.searchParams))
    if (action[0] === 'visitors' && action.length === 2 && request.method === 'GET') return json(await visitorDetail(action[1], request.nextUrl.searchParams))
    throw new AdminError('Маршрут не найден.', 404)
  } catch (error) { return apiError(error) }
}
export { handle as GET, handle as POST }
