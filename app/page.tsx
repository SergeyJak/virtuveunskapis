import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, DraftingCompass, ShieldCheck, Sparkles, Timer } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { projects } from '@/data/site'
import { copy, normalizeLocale, withLocale, type Locale } from '@/data/i18n'
import materialStyles from './materials.module.css'
import aboutStyles from './about.module.css'
import processStyles from './process.module.css'

const categoryNames: Record<Locale, string[]> = {
  lv: ['Virtuves','Skapji','Vannas istabas','Citas mēbeles'],
  ru: ['Кухни','Шкафы','Ванные комнаты','Другая мебель'],
  en: ['Kitchens','Wardrobes','Bathrooms','Other furniture'],
}
const categoryData = [
  ['/portfolio?category=kitchens','/images/categories/kitchens.jpg'],
  ['/portfolio?category=wardrobes','/images/categories/wardrobes.jpg'],
  ['/portfolio?category=bathrooms','/images/categories/bathrooms.jpg'],
  ['/portfolio','/images/categories/tv-units.jpg'],
]
const benefitCopy: Record<Locale, [string,string][]> = {
  lv: [['Individuāls dizains','Risinājumi tiek pielāgoti telpai, ikdienai un jūsu vizuālajai iecerei.'],['Kvalitatīvi materiāli','Izvēlamies uzticamus materiālus un furnitūru, kas paredzēta ilgstošai lietošanai.'],['Uzticama garantija','Uzņemamies atbildību par rezultātu no pirmās skices līdz gatavai montāžai.'],['Precīzi termiņi','Saskaņojam darbu etapus iepriekš un skaidri informējam par projekta virzību.']],
  ru: [['Индивидуальный дизайн','Решения адаптируются к помещению, повседневным задачам и вашей визуальной идее.'],['Качественные материалы','Выбираем надёжные материалы и фурнитуру, рассчитанные на длительное использование.'],['Гарантия качества','Отвечаем за результат от первого эскиза до готового монтажа.'],['Согласованные сроки','Заранее согласовываем этапы работ и понятно информируем о ходе проекта.']],
  en: [['Custom design','Solutions are adapted to your space, daily needs and visual idea.'],['Quality materials','We select reliable materials and fittings designed for long-term use.'],['Quality assurance','We take responsibility for the result from the first sketch to final installation.'],['Clear schedule','We agree the work stages in advance and keep you informed about progress.']],
}
const icons = [DraftingCompass, Sparkles, ShieldCheck, Timer]

export default async function HomePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang: rawLang } = await searchParams
  const lang = normalizeLocale(rawLang)
  const t = copy[lang]
  const categories = categoryData.map(([href,image], index) => ({ href, image, title: categoryNames[lang][index] }))

  return (
    <>
      <div className="hero-shell hero-shell-home">
        <Header lang={lang} />
        <main id="main-content">
          <section className="hero">
            <Image className="hero-image" src="/images/hero.jpg" alt={t.home.heroTitle.join(' ')} fill priority sizes="100vw" />
            <div className="hero-shade hero-shade-home" />
            <div className="container hero-content">
              <h1>{t.home.heroTitle.map((line) => <span key={line}>{line}<br /></span>)}</h1>
              <p>{t.home.heroText}</p>
              <div className="hero-buttons">
                <Link className="button button-primary" href={withLocale('/portfolio', lang)}>{t.home.projectsCta} <ArrowRight size={18} /></Link>
                <Link className="button button-ghost" href={withLocale('/contacts', lang)}>{t.home.contactCta}</Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      <section id="about" className={aboutStyles.section}>
        <div className={`container ${aboutStyles.inner}`}>
          <div><p className={aboutStyles.eyebrow}>{t.home.aboutEyebrow}</p><h2 className={aboutStyles.title}>{t.home.aboutTitle}</h2></div>
          <div className={aboutStyles.content}>
            <p className={aboutStyles.lead}>{t.home.aboutLead}</p>
            <p className={aboutStyles.text}>{t.home.aboutText}</p>
            <div className={aboutStyles.stats}>{t.home.stats.map(([value,label]) => <div key={value} className={aboutStyles.stat}><strong>{value}</strong><span>{label}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section className="section"><div className="container">
        <div className="section-heading"><h2>{t.home.categoriesTitle}</h2><Link href={withLocale('/portfolio', lang)}>{t.home.allProjects} →</Link></div>
        <div className="category-grid">{categories.map((category) => <Link key={category.title} className="category-card" href={withLocale(category.href, lang)}><Image src={category.image} alt={category.title} fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 25vw" /><div className="category-overlay"><h3>{category.title}</h3><span>→</span></div></Link>)}</div>
      </div></section>

      <section className="section section-projects"><div className="container">
        <div className="section-heading"><h2>{t.home.latest}</h2><Link href={withLocale('/portfolio', lang)}>{t.home.viewAll} →</Link></div>
        <div className="project-grid">{projects.slice(0,3).map(p => <ProjectCard key={p.slug} project={p} lang={lang}/>)}</div>
      </div></section>

      <section className={processStyles.section}>
        <div className={`container ${processStyles.inner}`}>
          <p className={processStyles.eyebrow}>Process</p>
          <h2 className={processStyles.title}>{t.home.processTitle}</h2>
          <div className={processStyles.timeline}>
            {t.home.process.map(([n,title,description]) => (
              <article key={n} className={processStyles.step}>
                <div className={processStyles.index}>{n}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="materials" className={materialStyles.section}><div className={`container ${materialStyles.inner}`}>
        <div className={materialStyles.copy}><p className={materialStyles.eyebrow}>{t.home.materialsEyebrow}</p><h2>{t.home.materialsTitle}</h2><p>{t.home.materialsText}</p><Link className="button button-primary" href={withLocale('/contacts', lang)}>{t.home.materialsCta} <ArrowRight size={18} /></Link></div>
        <div className={materialStyles.grid}>{benefitCopy[lang].map(([title,description], index) => { const Icon = icons[index]; return <article key={title} className={materialStyles.card}><Icon aria-hidden="true"/><h3>{title}</h3><p>{description}</p></article> })}</div>
      </div></section>

      <Footer lang={lang} />
    </>
  )
}
