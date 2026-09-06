import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { projects } from '@/data/site'
import styles from './portfolio.module.css'

export const metadata = { title: 'Projekti', description: 'Apskatiet Virtuve un Skapis mēbeļu risinājumu piemērus.' }

const filters = [
  { label: 'Visi', slug: '' },
  { label: 'Virtuves', slug: 'kitchens' },
  { label: 'Vannas istabas', slug: 'bathrooms' },
]

const categoryBySlug: Record<string, string> = {
  kitchens: 'Virtuves',
  bathrooms: 'Vannas istabas',
}

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = '' } = await searchParams
  const selectedCategory = categoryBySlug[category]
  const visibleProjects = selectedCategory ? projects.filter((project) => project.category === selectedCategory) : projects

  return <>
    <div className="dark-header"><Header /></div>
    <main id="main-content" className="page portfolio-page">
      <div className="container portfolio-shell">
        <div className="page-intro portfolio-intro">
          <p className="small-label">Portfolio</p>
          <h1>Mūsu projekti</h1>
          <p>Mēbeļu risinājumu piemēri dažādiem plānojumiem un individuāliem pasūtījumiem.</p>
        </div>
        <nav className={`filter-row portfolio-filters ${styles.filters}`} aria-label="Projektu kategorijas">
          {filters.map((filter) => {
            const active = category === filter.slug || (!category && !filter.slug)
            const href = filter.slug ? `/portfolio?category=${filter.slug}` : '/portfolio'
            return <Link key={filter.label} href={href} className={active ? styles.active : undefined}>{filter.label}</Link>
          })}
        </nav>
        <div className="project-grid portfolio-grid">
          {visibleProjects.map(p => <ProjectCard key={p.slug} project={p}/>)}
        </div>
      </div>
    </main>
    <Footer />
  </>
}
