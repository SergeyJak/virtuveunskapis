import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { projects } from '@/data/site'

export const metadata = { title: 'Projekti', description: 'Apskatiet mūsu īstenotos virtuves un mēbeļu projektus.' }

export default function PortfolioPage() {
  return <>
    <div className="dark-header"><Header /></div>
    <main className="page portfolio-page">
      <div className="container portfolio-shell">
        <div className="page-intro portfolio-intro">
          <p className="small-label">Portfolio</p>
          <h1>Mūsu projekti</h1>
          <p>Reāli risinājumi dažādām telpām, materiāliem un dzīvesveidam.</p>
        </div>
        <div className="filter-row portfolio-filters">
          <button className="active">Visi</button>
          <button>Virtuves</button>
          <button>Skapji</button>
          <button>Garderobes</button>
          <button>Vannas istabas</button>
        </div>
        <div className="project-grid portfolio-grid">
          {projects.map(p => <ProjectCard key={p.slug} project={p}/>)}
        </div>
      </div>
    </main>
    <Footer />
  </>
}
