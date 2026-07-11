import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { projects } from '@/data/site'

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })) }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()
  return <>
    <div className="dark-header"><Header /></div>
    <main className="project-page">
      <div className="container">
        <Link className="back-link" href="/portfolio">← Atpakaļ uz projektiem</Link>
        <div className="project-hero-grid">
          <div><p className="small-label">{project.category}</p><h1>{project.title}</h1><p className="lead">{project.description}</p><p>{project.location}</p></div>
          <div className="project-hero-image"><Image src={project.cover} alt={project.title} fill priority /></div>
        </div>
        <section className="project-details">
          <div><h2>Materiāli un furnitūra</h2><ul>{project.materials.map(m => <li key={m}>{m}</li>)}</ul></div>
          <div><h2>Par projektu</h2><p>Katrs risinājums tiek pielāgots konkrētai telpai, ikdienas paradumiem un izvēlētajiem materiāliem.</p></div>
        </section>
        <section className="project-cta"><h2>Vai vēlaties līdzīgu risinājumu?</h2><Link className="button button-primary" href="/contacts">Apspriest projektu</Link></section>
      </div>
    </main>
    <Footer/>
  </>
}
