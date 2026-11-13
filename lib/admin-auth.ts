import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { AdminError } from './admin-store'

export const COOKIE = 'portfolio_admin'
export const SESSION_SECONDS = 8 * 3600
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}
export function authConfigured() {
  return Boolean(process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32 && /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.ADMIN_PASSWORD_HASH || ''))
}
export function checkPassword(password: string) {
  if (!authConfigured() || typeof password !== 'string' || password.length > 256) return false
  const [, salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split(':')
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, 'hex'))
}
export function checkCredentials(username: unknown, password: unknown) {
  return username === 'admin' && typeof password === 'string' && checkPassword(password)
}
function signature(payload: string) { return createHmac('sha256', process.env.ADMIN_SESSION_SECRET!).update(payload).update(process.env.ADMIN_PASSWORD_HASH!).digest('base64url') }
export function createSession(now = Date.now()) {
  if (!authConfigured()) throw new AdminError('Настройте пароль и секрет сессии на сервере.', 503)
  const payload = `${now + SESSION_SECONDS * 1000}.${randomBytes(24).toString('hex')}`
  return `${payload}.${signature(payload)}`
}
export function verifySession(token = '', now = Date.now()) {
  if (!authConfigured() || token.length > 256) return false
  const parts = token.split('.')
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{48}$/.test(parts[1])) return false
  const expiration = Number(parts[0])
  if (expiration <= now || expiration > now + SESSION_SECONDS * 1000) return false
  const expected = Buffer.from(signature(`${parts[0]}.${parts[1]}`))
  const actual = Buffer.from(parts[2])
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
export function requestSession(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  return verifySession(cookie.split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1))
}
