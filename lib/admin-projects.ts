import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { projects as originals, categories, type Project } from '../data/site'
import { AdminError, dataDir, mutateDocument, readDocument } from './admin-store'

export type ManagedProject = Project & { published: boolean; order: number; managed?: boolean }
const baseline: ManagedProject[] = originals.map((p, index) => ({ ...p, published: true, order: index }))
function validSlug(value: unknown): value is string { return typeof value === 'string' && /^[a-z0-9āčēģīķļņšūž-]{1,150}$/i.test(value) }
function validImage(value: unknown): value is string {
  return typeof value === 'string' && (originals.some(p => p.images.includes(value)) || /^\/media\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(value))
}
function validateRows(rows: ManagedProject[]): void {
  if (!Array.isArray(rows) || rows.some(p => !p || !validSlug(p.slug) || typeof p.title !== 'string' || !p.title.trim() || typeof p.description !== 'string' || typeof p.sourceName !== 'string' || !categories.some(c => c.slug === p.categorySlug) || typeof p.category !== 'string' || !Array.isArray(p.images) || !p.images.length || !p.images.every(validImage) || p.cover !== p.images[0] || typeof p.published !== 'boolean' || !Number.isSafeInteger(p.order)) || new Set(rows.map(p => p.slug)).size !== rows.length) {
    throw new AdminError('Повреждён каталог проектов.', 500)
  }
}
export async function listAdminProjects(): Promise<ManagedProject[]> {
  const saved = await readDocument<ManagedProject[]>('projects.json', [])
  validateRows(saved)
  const merged = new Map(baseline.map(p => [p.slug, p]))
  for (const p of saved) merged.set(p.slug, p)
  return [...merged.values()].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
}
export async function getProjects(): Promise<Project[]> { return (await listAdminProjects()).filter(p => p.published) }
export async function saveProject(input: Record<string, unknown>): Promise<ManagedProject> {
  const category = categories.find(c => c.slug === input.categorySlug)
  if (!category || typeof input.title !== 'string' || !input.title.trim() || input.title.length > 160) throw new AdminError('Укажите название (до 160 символов) и категорию.')
  if (input.slug !== undefined && !validSlug(input.slug)) throw new AdminError('Некорректный адрес проекта.')
  if (!Array.isArray(input.images) || input.images.length < 1 || input.images.length > 40 || !input.images.every(validImage)) throw new AdminError('Добавьте от 1 до 40 фотографий допустимого формата.')
  if (new Set(input.images).size !== input.images.length) throw new AdminError('Фотографии не должны повторяться.')
  if (input.description !== undefined && (typeof input.description !== 'string' || input.description.length > 4000)) throw new AdminError('Описание: максимум 4000 символов.')
  if (input.published !== undefined && typeof input.published !== 'boolean') throw new AdminError('Некорректный статус публикации.')
  if (input.order !== undefined && (!Number.isSafeInteger(input.order) || Math.abs(Number(input.order)) > 100000)) throw new AdminError('Некорректный порядок проекта.')
  const slug = (input.slug as string | undefined) || `${category.slug}-${randomUUID()}`
  const known = (await listAdminProjects()).find(p => p.slug === slug)
  if (input.slug && !known) throw new AdminError('Проект не найден.', 404)
  for (const image of input.images as string[]) if (image.startsWith('/media/')) await readMedia(image.slice(7))
  const project: ManagedProject = {
    slug, sourceName: known?.sourceName || slug, title: input.title.trim(), description: (input.description as string || '').trim(),
    category: category.title, categorySlug: category.slug as Project['categorySlug'],
    images: input.images as string[], cover: input.images[0] as string,
    published: input.published === true, order: typeof input.order === 'number' ? input.order : -1,
    managed: true,
  }
  await mutateDocument<ManagedProject[]>('projects.json', [], rows => {
    validateRows(rows)
    if (rows.length >= 5000 && !rows.some(p => p.slug === slug)) throw new AdminError('Достигнут лимит проектов.')
    return [...rows.filter(p => p.slug !== slug), project]
  })
  return project
}
const mediaPattern = /^[a-f0-9-]{36}\.(jpg|png|webp)$/
function imageType(data: Buffer) {
  if (data.length < 12) throw new AdminError('Повреждённое изображение.')
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'jpg'
  if (data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png'
  if (data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  throw new AdminError('Разрешены только JPEG, PNG и WebP. SVG не поддерживается.')
}
export async function uploadImages(files: File[]) {
  if (!files.length || files.length > 10) throw new AdminError('Загрузите от 1 до 10 фотографий за раз.')
  const prepared = await Promise.all(files.map(async file => {
    if (file.size > 8 * 1024 * 1024 || !file.size) throw new AdminError('Размер фотографии: от 1 байта до 8 МБ.')
    const data = Buffer.from(await file.arrayBuffer())
    return { data, name: `${randomUUID()}.${imageType(data)}` }
  }))
  const dir = path.join(/* turbopackIgnore: true */ dataDir(true), 'uploads')
  await mkdir(dir, { recursive: true, mode: 0o700 })
  for (const file of prepared) await writeFile(path.join(dir, file.name), file.data, { flag: 'wx', mode: 0o600 })
  return prepared.map(file => `/media/${file.name}`)
}
export async function readMedia(name: string) {
  if (!mediaPattern.test(name)) throw new AdminError('Файл не найден.', 404)
  try {
    const data = await readFile(path.join(/* turbopackIgnore: true */ dataDir(), 'uploads', name))
    return { data, contentType: name.endsWith('.jpg') ? 'image/jpeg' : name.endsWith('.png') ? 'image/png' : 'image/webp' }
  } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') throw new AdminError('Файл не найден.', 404); throw e }
}
