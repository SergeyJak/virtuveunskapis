import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PortfolioGallery } from '@/components/PortfolioGallery'
import { projects } from '@/data/site'
import { copy, normalizeLocale } from '@/data/i18n'

export const metadata = { title: 'Projekti', description: 'Apskatiet Virtuve un Skapis mēbeļu risinājumu piemērus.' }

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ category?: string; lang?: string }> }) {
  const { category = '', lang: rawLang } = await searchParams
  const lang = normalizeLocale(rawLang)
  const t = copy[lang]

  return <>
    <div className="dark-header"><Header lang={lang} /></div>
    <main id="main-content" className="page portfolio-page">
      <div className="container portfolio-shell">
        <div className="page-intro portfolio-intro">
          <p className="small-label">{t.portfolio.eyebrow}</p>
          <h1>{t.portfolio.title}</h1>
          <p>{t.portfolio.text}</p>
        </div>
        <PortfolioGallery projects={projects} lang={lang} initialCategory={category} />
      </div>
    </main>
    <Footer lang={lang} />
  </>
}
