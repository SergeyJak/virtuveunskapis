import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { projects } from '@/data/site'
import { copy, normalizeLocale, withLocale, type Locale } from '@/data/i18n'

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
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()
  const lang = normalizeLocale(rawLang)
  const t = copy[lang]
  const localized = translations[lang][slug]
  const title = localized?.title ?? project.title
  const category = localized?.category ?? project.category
  const description = localized?.description ?? project.description

  return <>
    <div className="dark-header"><Header lang={lang} /></div>
    <main id="main-content" className="project-page">
      <section className="project-hero">
        <Image className="project-hero-bg" src={project.cover} alt={title} fill priority sizes="100vw" />
        <div className="project-hero-shade" />
        <div className="container project-hero-content">
          <Link className="back-link" href={withLocale('/portfolio', lang)}>{t.project.back}</Link>
          <p className="small-label">{category}</p>
          <h1>{title}</h1>
          <div className="project-hero-meta"><span>{category}</span><span>{t.project.custom}</span></div>
          <p className="lead">{description}</p>
          <Link className="button button-primary project-hero-cta" href={withLocale('/contacts', lang)}>{t.project.discuss}</Link>
        </div>
      </section>
      <div className="container project-content">
        <section className="project-details">
          <div className="project-details-panel"><p className="small-label">{t.project.fitEyebrow}</p><h2>{t.project.fitTitle}</h2><p>{t.project.fitText}</p></div>
          <div className="project-details-panel"><p className="small-label">{t.project.executionEyebrow}</p><h2>{t.project.executionTitle}</h2><p>{t.project.executionText}</p></div>
        </section>
        <section className="project-gallery" aria-label="Project gallery">
          <div className="project-gallery-main"><Image src={project.cover} alt={title} fill sizes="(max-width: 980px) 100vw, 58vw" /></div>
          <div className="project-gallery-side"><div><Image src={project.cover} alt={`${title} detail`} fill sizes="(max-width: 980px) 100vw, 28vw" /></div><div><Image src={project.cover} alt={`${title} overview`} fill sizes="(max-width: 980px) 100vw, 28vw" /></div></div>
        </section>
        <section className="project-cta"><p className="small-label">{t.project.next}</p><h2>{t.project.similar}</h2><p>{t.project.similarText}</p><Link className="button button-primary" href={withLocale('/contacts', lang)}>{t.project.discuss}</Link></section>
      </div>
    </main>
    <Footer lang={lang}/>
  </>
}
