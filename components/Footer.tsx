import Image from 'next/image'
import Link from 'next/link'
import { businessContacts } from '@/data/site'
import { copy, type Locale, withLocale } from '@/data/i18n'
import styles from './Footer.module.css'

export function Footer({ lang = 'lv' }: { lang?: Locale }) {
  const t = copy[lang]
  const localize = (href: string) => {
    const [base, hash] = href.split('#')
    const localized = withLocale(base || '/', lang)
    return hash ? `${localized}#${hash}` : localized
  }
  return <footer className={styles.footer}>
    <div className={`container ${styles.grid}`}>
      <div className={styles.brandBlock}><Image className={styles.logo} src="/logo/logo.svg" alt="Virtuve un Skapis" width={230} height={64} /><p className={styles.brandText}>{t.footer.text}</p></div>
      <nav className={styles.column} aria-label="Footer navigation"><h3 className={styles.heading}>{t.footer.nav}</h3><Link className={styles.link} href={withLocale('/portfolio', lang)}>{t.nav.projects}</Link><Link className={styles.link} href={localize('/#about')}>{t.nav.about}</Link><Link className={styles.link} href={localize('/#materials')}>{t.nav.materials}</Link><Link className={styles.link} href={withLocale('/contacts', lang)}>{t.nav.contacts}</Link></nav>
      <div className={styles.column}><h3 className={styles.heading}>{t.footer.contacts}</h3><a className={`${styles.link} ${styles.contactLink}`} href={businessContacts.phoneHref}>{businessContacts.phoneDisplay}</a><a className={`${styles.link} ${styles.contactLink}`} href={businessContacts.emailHref}>{businessContacts.email}</a><span className={styles.text}>{businessContacts.address}</span></div>
    </div>
    <div className={`container ${styles.bottom}`}><span>© 2026 Virtuve un Skapis</span><span className={styles.bottomAccent}>{t.footer.accent}</span></div>
  </footer>
}
