import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { projects } from '@/data/site'
import { copy, normalizeLocale, withLocale } from '@/data/i18n'
import styles from './portfolio.module.css'

export const metadata = { title: 'Projekti', description: 'Apskatiet Virtuve un Skapis mēbeļu risinājumu piemērus.' }

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string; lang?: string }> }) {
  const { category = '', lang: rawLang } = await searchParams
  const lang = normalizeLocale(rawLang)
  const t = copy[lang]
  const visibleProjects = category ? projects.filter((project) => project.categorySlug === category) : projects
  const labels = {
    lv: { wardrobes: 'Skapji' }, ru: { wardrobes: 'Шкафы' }, en: { wardrobes: 'Wardrobes' },
  }
  const filters = [
    { label: t.portfolio.all, slug: '' },
    { label: t.portfolio.kitchens, slug: 'kitchens' },
    { label: labels[lang].wardrobes, slug: 'wardrobes' },
    { label: t.portfolio.bathrooms, slug: 'bathrooms' },
  ]

  return <>
    <div className="dark-header"><Header lang={lang} /></div>
    <main id="main-content" className="page portfolio-page">
      <div className="container portfolio-shell">
        <div className="page-intro portfolio-intro">
          <p className="small-label">{t.portfolio.eyebrow}</p>
          <h1>{t.portfolio.title}</h1>
          <p>{t.portfolio.text}</p>
        </div>
        <nav className={`filter-row portfolio-filters ${styles.filters}`} aria-label="Project categories">
          {filters.map((filter) => {
            const active = category === filter.slug || (!category && !filter.slug)
            const href = filter.slug ? `/portfolio?category=${filter.slug}` : '/portfolio'
            return <Link key={filter.label} href={withLocale(href, lang)} className={active ? styles.active : undefined}>{filter.label}</Link>
          })}
        </nav>
        <div className="project-grid portfolio-grid">{visibleProjects.map(p => <ProjectCard key={p.slug} project={p} lang={lang}/>)}</div>
      </div>
    </main>
    <Footer lang={lang} />
  </>
}
