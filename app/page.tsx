import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, DraftingCompass, ShieldCheck, Sparkles, Timer } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProjectCard } from '@/components/ProjectCard'
import { categories, projects } from '@/data/site'

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
            {categories.map((category) => (
              <Link key={category.slug} className="category-card" href={`/portfolio?category=${category.slug}`}>
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 760px) 100vw, 20vw" />
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

      <section id="materials" className="trust-band">
        <div className="container trust-grid">
          <div>
            <h2>Īstenosim jūsu idejas kopā</h2>
            <p>Katrs projekts sākas ar sarunu. Pastāstiet par savu ieceri, un mēs palīdzēsim atrast piemērotu risinājumu.</p>
            <Link className="button button-primary" href="/contacts">Sazināties ar mums</Link>
          </div>
          <div className="benefits">
            <div><DraftingCompass/><span>Individuāls dizains</span></div>
            <div><Sparkles/><span>Kvalitatīvi materiāli</span></div>
            <div><ShieldCheck/><span>Uzticama garantija</span></div>
            <div><Timer/><span>Precīzi termiņi</span></div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
