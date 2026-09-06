import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { normalizeLocale, withLocale, type Locale } from '@/data/i18n'
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
              <div className={styles.logoNoer} aria-label="NOER">NOER</div>
              <div className={styles.meta}>
                <h2>{t.noerTitle}</h2>
                <p>{t.noerText}</p>
              </div>
            </article>

            <article className={styles.card}>
              <span className={styles.cardAccent} aria-hidden="true" />
              <div className={styles.logoHeySmart} aria-label="HeySmart">Hey<span>Smart</span></div>
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
