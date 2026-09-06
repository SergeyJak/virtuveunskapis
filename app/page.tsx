import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, DraftingCompass, ShieldCheck, Sparkles, Timer } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { projects } from '@/data/site'
import styles from './materials.module.css'

const homeCategories = [
  { title: 'Virtuves', href: '/portfolio?category=kitchens', image: '/images/categories/kitchens.jpg' },
  { title: 'Skapji', href: '/portfolio?category=wardrobes', image: '/images/categories/wardrobes.jpg' },
  { title: 'Vannas istabas', href: '/portfolio?category=bathrooms', image: '/images/categories/bathrooms.jpg' },
  { title: 'Citas mēbeles', href: '/portfolio?category=tv-units', image: '/images/categories/tv-units.jpg' },
]

const benefits = [
  {
    icon: DraftingCompass,
    title: 'Individuāls dizains',
    description: 'Risinājumi tiek pielāgoti telpai, ikdienai un jūsu vizuālajai iecerei.',
  },
  {
    icon: Sparkles,
    title: 'Kvalitatīvi materiāli',
    description: 'Izvēlamies uzticamus materiālus un furnitūru, kas paredzēta ilgstošai lietošanai.',
  },
  {
    icon: ShieldCheck,
    title: 'Uzticama garantija',
    description: 'Uzņemamies atbildību par rezultātu no pirmās skices līdz gatavai montāžai.',
  },
  {
    icon: Timer,
    title: 'Precīzi termiņi',
    description: 'Saskaņojam darbu etapus iepriekš un skaidri informējam par projekta virzību.',
  },
]

export default function HomePage() {
  return (
    <>
      <div className="hero-shell hero-shell-home">
        <Header />
        <main>
          <section className="hero">
            <Image className="hero-image" src="/images/hero.jpg" alt="Individuāli projektēta tumša virtuve" fill priority sizes="100vw" unoptimized />
            <div className="hero-shade hero-shade-home" />
            <div className="container hero-content">
              <h1>Mēbeles,<br />ko vēlaties katru<br />dienu redzēt mājās</h1>
              <p>Projektējam, izgatavojam un uzstādām mēbeles pēc individuāliem izmēriem Rīgā un visā Latvijā.</p>
              <div className="hero-buttons">
                <Link className="button button-primary" href="/portfolio">Apskatīt projektus <ArrowRight size={18} /></Link>
                <Link className="button button-ghost" href="/contacts">Sazināties ar mums</Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-heading"><h2>Atrodiet mēbeles savam mājoklim</h2><Link href="/portfolio">Visi projekti →</Link></div>
          <div className="category-grid">
            {homeCategories.map((category) => (
              <Link key={category.title} className="category-card" href={category.href}>
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 760px) 100vw, 25vw" />
                <div className="category-overlay"><h3>{category.title}</h3><span>→</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-projects">
        <div className="container">
          <div className="section-heading"><h2>Jaunākie projekti</h2><Link href="/portfolio">Skatīt visus →</Link></div>
          <div className="project-grid">{projects.slice(0,3).map(p => <ProjectCard key={p.slug} project={p}/>)}</div>
        </div>
      </section>

      <section className="section process">
        <div className="container">
          <h2>Kā notiek sadarbība</h2>
          <div className="process-grid">
            {[
              ['01','Pieteikums','Atstājiet pieteikumu vai piezvaniet mums.'],
              ['02','Izmērs','Veicam mērīšanu objektā.'],
              ['03','Dizains','Izstrādājam projektu un saskaņojam.'],
              ['04','Ražošana','Izgatavojam mēbeles mūsu ražotnē.'],
              ['05','Montāža','Piegādājam un uzstādām.'],
            ].map(([n,t,d]) => <div key={n} className="process-step"><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section id="materials" className={styles.section}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Kvalitāte detaļās</p>
            <h2>Materiāli un izpildījums, kam var uzticēties</h2>
            <p>Labs rezultāts nav tikai skaists skats. Tas ir pārdomāts dizains, kvalitatīvi materiāli un precīzs darbs katrā projekta posmā.</p>
            <Link className="button button-primary" href="/contacts">Pārrunāt savu projektu <ArrowRight size={18} /></Link>
          </div>
          <div className={styles.grid}>
            {benefits.map(({ icon: Icon, title, description }) => (
              <article key={title} className={styles.card}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
