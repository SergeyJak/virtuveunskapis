import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects } from '@/data/site'
import { copy, normalizeLocale, withLocale, type Locale } from '@/data/i18n'
import styles from './project-photo.module.css'

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

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const [{ slug }, { lang: rawLang }] = await Promise.all([params, searchParams])
  const project = projects.find((item) => item.slug === slug)
  if (!project) return {}
  const lang = normalizeLocale(rawLang)
  const localized = translations[lang][slug]
  const title = localized?.title ?? project.title
  const description = localized?.description ?? project.description
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${title} | Virtuve un Skapis`, description, type: 'article', images: [{ url: project.cover, alt: title }] },
  }
}

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const [{ slug }, { lang: rawLang }] = await Promise.all([params, searchParams])
  const project = projects.find((item) => item.slug === slug)
  if (!project) notFound()

  const lang = normalizeLocale(rawLang)
  const t = copy[lang]
  const localized = translations[lang][slug]
  const title = localized?.title ?? project.title

  return <main id="main-content" className={styles.page}>
    <div className={styles.topbar}>
      <Link className={styles.back} href={withLocale(`/portfolio?category=${project.categorySlug}`, lang)}>{t.project.back}</Link>
    </div>
    <section className={styles.gallery} aria-label="Project gallery">
      {project.images.map((image, index) => <div className={styles.photo} key={image}>
        <Image src={image} alt={`${title} ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1180px) 100vw, 1180px" />
      </div>)}
    </section>
  </main>
}
