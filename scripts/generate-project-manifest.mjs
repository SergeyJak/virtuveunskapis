import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.join(process.cwd(), 'public/images/original-projects/sorted')
const out = path.join(process.cwd(), 'data/generated-projects.json')
const imageExt = /\.(jpe?g|png|webp|avif)$/i

const categoryMap = {
  'кухни': 'kitchens',
  'Шкафы': 'wardrobes',
  'Ванны': 'bathrooms',
}

const projects = []

async function imagesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries.filter((entry) => entry.isFile() && imageExt.test(entry.name)).map((entry) => entry.name).sort()
}

async function walk(dir, parts = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = entries.filter((entry) => entry.isFile() && imageExt.test(entry.name))
  if (files.length) {
    const categoryFolder = parts[0]
    const category = categoryMap[categoryFolder]
    if (category) {
      const relative = ['original-projects', 'sorted', ...parts]
      const images = (await imagesIn(dir)).map((name) => `/images/${[...relative, name].join('/')}`)
      const rawName = parts.slice(1).join('-') || categoryFolder
      const slug = `${category}-${rawName}`.toLowerCase().replace(/[^a-z0-9āčēģīķļņšūž-]+/gi, '-').replace(/^-|-$/g, '')
      projects.push({ slug, category, sourceName: rawName, images })
    }

    // A folder containing project photos is the project boundary. Nested folders
    // such as "New folder" are duplicate/export copies and must not become
    // separate customer-facing projects.
    return
  }

  for (const entry of entries) {
    if (entry.isDirectory()) await walk(path.join(dir, entry.name), [...parts, entry.name])
  }
}

await walk(root)
projects.sort((a, b) => a.category.localeCompare(b.category) || a.sourceName.localeCompare(b.sourceName, undefined, { numeric: true }))
await writeFile(out, `${JSON.stringify(projects, null, 2)}\n`)
console.log(`Generated ${projects.length} projects in ${out}`)
