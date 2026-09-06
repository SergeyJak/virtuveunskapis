'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { navigation } from '@/data/site'
import styles from './Header.module.css'

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const headerNavigation = navigation.filter(
    (item) => item.href !== '/contacts' && item.href !== '/#about'
  )

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/portfolio') return pathname === '/portfolio' || pathname.startsWith('/projects/')
    return false
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Virtuve un Skapis sākumlapa">
          <img src="/logo/logo-original.png" alt="Virtuve un Skapis" width={433} height={160} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Galvenā navigācija">
          {headerNavigation.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.languages} aria-label="Valodas izvēle">
            <span className={styles.languageActive}>LV</span>
            <span className={styles.language} aria-disabled="true">RU</span>
            <span className={styles.language} aria-disabled="true">EN</span>
          </div>
          <Link className={styles.cta} href="/contacts">Sazināties</Link>
          <button
            className={styles.menuButton}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Aizvērt izvēlni' : 'Atvērt izvēlni'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.mobilePanel}>
            <nav id="mobile-navigation" className={styles.mobileNav} aria-label="Mobilā navigācija">
              {headerNavigation.map((item) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={item.href + item.label}
                  href={item.href}
                  className={`${styles.mobileLink} ${isActive(item.href) ? styles.mobileLinkActive : ''}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={styles.mobileBottom}>
              <div className={styles.mobileLanguages} aria-label="Valodas izvēle">
                <span className={styles.languageActive}>LV</span>
                <span className={styles.language} aria-disabled="true">RU</span>
                <span className={styles.language} aria-disabled="true">EN</span>
              </div>
              <Link onClick={() => setOpen(false)} className={styles.mobileCta} href="/contacts">
                Sazināties
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
