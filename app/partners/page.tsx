import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { normalizeLocale, type Locale } from '@/data/i18n'
import styles from './partners.module.css'

const pageCopy: Record<Locale, {
  eyebrow: string
  title: string
  lead: string
  noerTitle: string
  noerText: string
  heySmartTitle: string
  heySmartText: string
  visit: string
}> = {
  lv: {
    eyebrow: 'Sadarbība',
    title: 'Partneri',
    lead: 'Mēs novērtējam ilgtermiņa sadarbību un strādājam kopā ar partneriem, kas papildina mūsu darbu un klientu pieredzi.',
    noerTitle: 'NOER',
    noerText: 'Mūsu partneris.',
    heySmartTitle: 'HeySmart',
    heySmartText: 'Mūsu interneta veikals.',
    visit: 'Apmeklēt heysmart.lv',
  },
  ru: {
    eyebrow: 'Сотрудничество',
    title: 'Партнёры',
    lead: 'Мы ценим долгосрочное сотрудничество и работаем с партнёрами, которые дополняют нашу работу и клиентский опыт.',
    noerTitle: 'NOER',
    noerText: 'Наш партнёр.',
    heySmartTitle: 'HeySmart',
    heySmartText: 'Наш интернет-магазин.',
    visit: 'Перейти на heysmart.lv',
  },
  en: {
    eyebrow: 'Collaboration',
    title: 'Partners',
    lead: 'We value long-term collaboration and work with partners who complement our work and customer experience.',
    noerTitle: 'NOER',
    noerText: 'Our partner.',
    heySmartTitle: 'HeySmart',
    heySmartText: 'Our online store.',
    visit: 'Visit heysmart.lv',
  },
}

function NoerLogo() {
  return (
    <svg className={styles.noerLogo} viewBox="0 0 560 170" role="img" aria-label="NOER">
      <g fill="#5a6870">
        <path d="M0 20h68l71 98V20h70v130h-68L70 52v98H0z" />
        <path d="M292 20h104v38h-56v11h51v35h-51v10h59v36H292z" />
        <path d="M410 20h89c41 0 61 19 61 53 0 23-11 40-31 48l35 29h-66l-24-23h-13v23h-51zm51 39v31h28c14 0 21-5 21-15 0-11-7-16-21-16z" />
      </g>
      <circle cx="250" cy="85" r="74" fill="#f12822" />
      <path d="M190 103c31 25 96 18 133-37-9 43-40 72-84 80-28 5-50-3-62-17 2-8 7-17 13-26z" fill="#0d0c0a" />
    </svg>
  )
}

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang: rawLang } = await searchParams
  const lang = normalizeLocale(rawLang)
  const t = pageCopy[lang]

  return (
    <div className={styles.page}>
      <Header lang={lang} />
      <main id="main-content">
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <p className={styles.eyebrow}>{t.eyebrow}</p>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.lead}>{t.lead}</p>
          </div>
        </section>

        <section className={styles.partners}>
          <div className={`container ${styles.grid}`}>
            <article className={styles.card}>
              <span className={styles.cardAccent} aria-hidden="true" />
              <div className={styles.logoStage}>
                <NoerLogo />
              </div>
              <div className={styles.meta}>
                <h2>{t.noerTitle}</h2>
                <p>{t.noerText}</p>
              </div>
            </article>

            <article className={styles.card}>
              <span className={styles.cardAccent} aria-hidden="true" />
              <div className={styles.logoStage}>
                <img className={styles.heySmartLogo} src="https://heysmart.lv/icons/icon-512.png" alt="HeySmart" />
              </div>
              <div className={styles.meta}>
                <h2>{t.heySmartTitle}</h2>
                <p>{t.heySmartText}</p>
                <Link className={styles.external} href="https://heysmart.lv" target="_blank" rel="noreferrer">{t.visit} <ArrowUpRight size={17} /></Link>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </div>
  )
}
