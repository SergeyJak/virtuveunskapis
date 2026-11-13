import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

export class AdminError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}
export function dataDir(write = false) {
  if (write && process.env.NODE_ENV === 'production' && !process.env.ADMIN_DATA_DIR) {
    throw new AdminError('Настройте ADMIN_DATA_DIR на постоянном диске.', 503)
  }
  return process.env.ADMIN_DATA_DIR ? path.resolve(/* turbopackIgnore: true */ process.env.ADMIN_DATA_DIR) : path.join(process.cwd(), '.runtime')
}
export async function readDocument<T>(name: string, fallback: T): Promise<T> {
  try { return JSON.parse(await readFile(path.join(/* turbopackIgnore: true */ dataDir(), name), 'utf8')) as T }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fallback
    throw new AdminError('Ошибка чтения хранилища. Проверьте данные и резервную копию.', 500)
  }
}
const queues = new Map<string, Promise<unknown>>()
export async function mutateDocument<T>(name: string, fallback: T, change: (value: T) => T | Promise<T>): Promise<T> {
  const dir = dataDir(true)
  const key = path.join(/* turbopackIgnore: true */ dir, name)
  const previous = queues.get(key) || Promise.resolve()
  const operation = previous.catch(() => {}).then(async () => {
    await mkdir(dir, { recursive: true, mode: 0o700 })
    const next = await change(await readDocument(name, fallback))
    const temporary = `${key}.${randomUUID()}.tmp`
    await writeFile(temporary, JSON.stringify(next), { mode: 0o600 })
    await rename(temporary, key)
    return next
  })
  queues.set(key, operation)
  try { return await operation }
  finally { if (queues.get(key) === operation) queues.delete(key) }
}
