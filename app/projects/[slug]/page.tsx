import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { projects } from '@/data/site'

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)

  if (!project) return {}

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | Virtuve un Skapis`,
      description: project.description,
      type: 'article',
      images: [{ url: project.cover, alt: project.title }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()

  return <>
    <div className="dark-header"><Header /></div>
    <main className="project-page">
      <section className="project-hero">
        <Image className="project-hero-bg" src={project.cover} alt={project.title} fill priority sizes="100vw" />
        <div className="project-hero-shade" />
        <div className="container project-hero-content">
          <Link className="back-link" href="/portfolio">← Atpakaļ uz projektiem</Link>
          <p className="small-label">{project.category}</p>
          <h1>{project.title}</h1>
          <div className="project-hero-meta">
            <span>{project.location}</span>
            <span>{project.category}</span>
          </div>
          <p className="lead">{project.description}</p>
          <Link className="button button-primary project-hero-cta" href="/contacts">Apspriest projektu</Link>
        </div>
      </section>

      <div className="container project-content">
        <section className="project-details">
          <div className="project-details-panel">
            <p className="small-label">Materiāli</p>
            <h2>Materiāli un furnitūra</h2>
            <ul>{project.materials.map(m => <li key={m}>{m}</li>)}</ul>
          </div>
          <div className="project-details-panel">
            <p className="small-label">Pieeja</p>
            <h2>Par projektu</h2>
            <p>Katrs risinājums tiek pielāgots konkrētai telpai, ikdienas paradumiem un izvēlētajiem materiāliem.</p>
          </div>
        </section>

        <section className="project-gallery" aria-label="Projekta galerija">
          <div className="project-gallery-main">
            <Image src={project.cover} alt={project.title} fill sizes="(max-width: 980px) 100vw, 58vw" />
          </div>
          <div className="project-gallery-side">
            <div><Image src={project.cover} alt={`${project.title} — detaļa`} fill sizes="(max-width: 980px) 100vw, 28vw" /></div>
            <div><Image src={project.cover} alt={`${project.title} — kopskats`} fill sizes="(max-width: 980px) 100vw, 28vw" /></div>
          </div>
        </section>

        <section className="project-cta">
          <p className="small-label">Nākamais solis</p>
          <h2>Vai vēlaties līdzīgu risinājumu?</h2>
          <p>Pastāstiet par telpu, materiāliem un sajūtu, ko vēlaties panākt. Mēs palīdzēsim pārvērst to skaidrā projektā.</p>
          <Link className="button button-primary" href="/contacts">Apspriest projektu</Link>
        </section>
      </div>
    </main>
    <Footer/>
  </>
}
