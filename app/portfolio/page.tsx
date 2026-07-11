import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { projects } from '@/data/site'

export const metadata = { title: 'Projekti', description: 'Apskatiet mūsu īstenotos virtuves un mēbeļu projektus.' }

export default function PortfolioPage() {
  return <>
    <div className="dark-header"><Header /></div>
    <main className="page">
      <div className="container">
        <div className="page-intro"><h1>Mūsu projekti</h1><p>Reāli risinājumi dažādām telpām, materiāliem un dzīvesveidam.</p></div>
        <div className="filter-row"><button className="active">Visi</button><button>Virtuves</button><button>Skapji</button><button>Garderobes</button><button>Vannas istabas</button></div>
        <div className="project-grid">{projects.map(p => <ProjectCard key={p.slug} project={p}/>)}</div>
      </div>
    </main>
    <Footer />
  </>
}
