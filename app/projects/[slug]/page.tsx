import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects } from '@/data/site'
import { localizeProject } from '@/data/project-i18n'
import { copy, normalizeLocale, withLocale } from '@/data/i18n'
import styles from './project-photo.module.css'

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const [{ slug }, { lang: rawLang }] = await Promise.all([params, searchParams])
  const project = projects.find((item) => item.slug === slug)
  if (!project) return {}
  const lang = normalizeLocale(rawLang)
  const localized = localizeProject(project, lang)
  return {
    title: localized.title,
    description: localized.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${localized.title} | Virtuve un Skapis`, description: localized.description, type: 'article', images: [{ url: project.cover, alt: localized.title }] },
  }
}

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const [{ slug }, { lang: rawLang }] = await Promise.all([params, searchParams])
  const project = projects.find((item) => item.slug === slug)
  if (!project) notFound()

  const lang = normalizeLocale(rawLang)
  const t = copy[lang]
  const localized = localizeProject(project, lang)
  const portfolioHref = `${withLocale(`/portfolio?category=${project.categorySlug}`, lang)}#project-${project.slug}`

  return <main id="main-content" className={styles.page}>
    <div className={styles.topbar}>
      <Link className={styles.back} href={portfolioHref}>{t.project.back}</Link>
    </div>
    <section className={styles.gallery} aria-label="Project gallery">
      {project.images.map((image, index) => <div className={styles.photo} key={image}>
        <Image src={image} alt={`${localized.title} ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1180px) 100vw, 1180px" />
      </div>)}
    </section>
  </main>
}
