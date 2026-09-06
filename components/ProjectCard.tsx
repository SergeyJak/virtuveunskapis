import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/data/site'
import { type Locale, withLocale } from '@/data/i18n'

const translations: Record<Locale, Record<string, { title: string; category: string; description: string }>> = {
  lv: {},
  ru: {
    '467-serijas-virtuve': { title: 'Кухня для 467 серии', category: 'Кухни', description: 'Кухонное решение для типовой планировки 467 серии с изготовлением по индивидуальным размерам.' },
    '602-serijas-virtuve': { title: 'Кухня для 602 серии', category: 'Кухни', description: 'Кухонное решение для планировки 602 серии, адаптированное под конкретное помещение.' },
    'individuals-virtuves-projekts': { title: 'Индивидуальный проект кухни', category: 'Кухни', description: 'Кухня, изготовленная по индивидуальным размерам и пожеланиям заказчика.' },
    'vannas-istabas-mebeles': { title: 'Мебель для ванной', category: 'Ванные комнаты', description: 'Индивидуальное мебельное решение для ванной комнаты.' },
  },
  en: {
    '467-serijas-virtuve': { title: 'Kitchen for a 467-series apartment', category: 'Kitchens', description: 'A kitchen solution for the standard 467-series layout, made to individual dimensions.' },
    '602-serijas-virtuve': { title: 'Kitchen for a 602-series apartment', category: 'Kitchens', description: 'A kitchen solution for the 602-series layout, adapted to the specific room.' },
    'individuals-virtuves-projekts': { title: 'Custom kitchen project', category: 'Kitchens', description: 'A kitchen made to individual dimensions and customer preferences.' },
    'vannas-istabas-mebeles': { title: 'Bathroom furniture', category: 'Bathrooms', description: 'A custom-made furniture solution for a bathroom.' },
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
