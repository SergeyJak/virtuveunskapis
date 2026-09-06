import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/data/site'
import { type Locale, withLocale } from '@/data/i18n'

const translations: Record<Locale, Record<string, { title: string; category: string; description: string }>> = {
  lv: {},
  ru: {
    'virtuve-467-serija': { title: 'Кухня для 467 серии', category: 'Кухни', description: 'Индивидуально адаптированное кухонное решение для планировки 467 серии.' },
    'virtuve-602-serija': { title: 'Кухня для 602 серии', category: 'Кухни', description: 'Кухонное решение для дома 602 серии, адаптированное под размеры конкретного помещения.' },
    'virtuve-individuals-projekts': { title: 'Кухня по индивидуальному проекту', category: 'Кухни', description: 'Кухня по индивидуальным размерам и идее заказчика, от проекта до установки.' },
    'vannas-istabas-mebeles': { title: 'Мебель для ванной', category: 'Ванные комнаты', description: 'Мебель, изготовленная по индивидуальным размерам и потребностям конкретного помещения.' },
  },
  en: {
    'virtuve-467-serija': { title: 'Kitchen for a 467-series apartment', category: 'Kitchens', description: 'A custom kitchen solution adapted to a 467-series layout.' },
    'virtuve-602-serija': { title: 'Kitchen for a 602-series apartment', category: 'Kitchens', description: 'A kitchen solution for a 602-series home, adapted to the dimensions of the room.' },
    'virtuve-individuals-projekts': { title: 'Custom kitchen project', category: 'Kitchens', description: 'A kitchen made to individual dimensions and customer ideas, from design to installation.' },
    'vannas-istabas-mebeles': { title: 'Bathroom furniture', category: 'Bathrooms', description: 'Furniture made to individual dimensions and the needs of the specific room.' },
  },
}

export function ProjectCard({ project, lang = 'lv' }: { project: Project; lang?: Locale }) {
  const localized = translations[lang][project.slug]
  const title = localized?.title ?? project.title
  const category = localized?.category ?? project.category
  const description = localized?.description ?? project.description
  return (
    <Link href={withLocale(`/projects/${project.slug}`, lang)} className="project-card">
      <div className="project-image"><Image src={project.cover} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" /></div>
      <div className="project-meta"><div><p className="project-card-category">{category}</p><h3>{title}</h3><p className="project-card-description">{description}</p></div><span aria-hidden>→</span></div>
    </Link>
  )
}
