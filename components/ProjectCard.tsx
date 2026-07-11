import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/data/site'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="project-card">
      <div className="project-image"><Image src={project.cover} alt={project.title} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
      <div className="project-meta"><div><h3>{project.title}</h3><p>{project.location}</p></div><span aria-hidden>→</span></div>
    </Link>
  )
}
