'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import type { Project } from '@/data/site'
import { copy, type Locale } from '@/data/i18n'
import styles from '@/app/portfolio/portfolio.module.css'

export function PortfolioGallery({ projects, lang, initialCategory = '' }: { projects: Project[]; lang: Locale; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory)
  const t = copy[lang]
  const labels = { lv: 'Skapji', ru: 'Шкафы', en: 'Wardrobes' } as const
  const filters = [
    { label: t.portfolio.all, slug: '' },
    { label: t.portfolio.kitchens, slug: 'kitchens' },
    { label: labels[lang], slug: 'wardrobes' },
    { label: t.portfolio.bathrooms, slug: 'bathrooms' },
  ]
  const visibleProjects = useMemo(() => category ? projects.filter((project) => project.categorySlug === category) : projects, [category, projects])

  function selectCategory(slug: string) {
    setCategory(slug)
    const url = new URL(window.location.href)
    if (slug) url.searchParams.set('category', slug)
    else url.searchParams.delete('category')
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`)
  }

  return <>
    <nav className={`filter-row portfolio-filters ${styles.filters}`} aria-label="Project categories">
      {filters.map((filter) => {
        const active = category === filter.slug
        return <button key={filter.label} type="button" onClick={() => selectCategory(filter.slug)} className={active ? styles.active : undefined} aria-pressed={active}>{filter.label}</button>
      })}
    </nav>
    <div className="project-grid portfolio-grid">{visibleProjects.map((project) => <ProjectCard key={project.slug} project={project} lang={lang}/>)}</div>
  </>
}
