import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/data/site'
import { localizeProject } from '@/data/project-i18n'
import { type Locale, withLocale } from '@/data/i18n'

export function ProjectCard({ project, lang = 'lv' }: { project: Project; lang?: Locale }) {
  const localized = localizeProject(project, lang)
  return (
    <Link
      id={`project-${project.slug}`}
      style={{ scrollMarginTop: '120px' }}
      href={withLocale(`/projects/${project.slug}`, lang)}
      className="project-card"
      aria-label={localized.title}
    >
      <div className="project-image">
        <Image src={project.cover} alt={localized.title} fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" />
      </div>
    </Link>
  )
}
