import Image from 'next/image'
import Link from 'next/link'
import { businessContacts } from '@/data/site'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandBlock}>
          <Image className={styles.logo} src="/logo/logo.svg" alt="Virtuve un Skapis" width={230} height={64} />
          <p className={styles.brandText}>Mēbeles pēc individuāliem izmēriem Rīgā un visā Latvijā. No pirmās ieceres līdz gatavai montāžai.</p>
        </div>

        <nav className={styles.column} aria-label="Kājenes navigācija">
          <h3 className={styles.heading}>Navigācija</h3>
          <Link className={styles.link} href="/portfolio">Projekti</Link>
          <Link className={styles.link} href="/#about">Par mums</Link>
          <Link className={styles.link} href="/#materials">Materiāli</Link>
          <Link className={styles.link} href="/contacts">Kontakti</Link>
        </nav>

        <div className={styles.column}>
          <h3 className={styles.heading}>Kontakti</h3>
          <a className={`${styles.link} ${styles.contactLink}`} href={businessContacts.phoneHref}>{businessContacts.phoneDisplay}</a>
          <a className={`${styles.link} ${styles.contactLink}`} href={businessContacts.emailHref}>{businessContacts.email}</a>
          <span className={styles.text}>{businessContacts.address}</span>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© 2026 Virtuve un Skapis</span>
        <span className={styles.bottomAccent}>Mēbeles pēc individuāla pasūtījuma</span>
      </div>
    </footer>
  )
}
