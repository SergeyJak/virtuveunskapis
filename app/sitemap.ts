import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/admin-projects'

export const dynamic = 'force-dynamic'

const baseUrl = 'https://virtuveunskapis.lv'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/contacts`, changeFrequency: 'yearly', priority: 0.7 },
  ]

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...projectPages]
}
