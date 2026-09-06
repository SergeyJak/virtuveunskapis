'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { navigation } from '@/data/site'
import { copy, type Locale, withLocale } from '@/data/i18n'
import styles from './Header.module.css'

export function Header({ lang = 'lv' }: { lang?: Locale }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const t = copy[lang]
  const partnerLabel = lang === 'ru' ? 'Партнёры' : lang === 'en' ? 'Partners' : 'Partneri'
  const labels: Record<string, string> = { Projekti:t.nav.projects, Virtuves:t.nav.kitchens, Skapji:t.nav.wardrobes, Materiāli:t.nav.materials, 'Par mums':t.nav.about, Partneri:partnerLabel }
  const headerNavigation = navigation.filter((item) => item.href !== '/contacts')
  const localize = (href: string) => {
    const [base, hash] = href.split('#')
    const localized = withLocale(base || '/', lang)
    return hash ? `${localized}#${hash}` : localized
  }

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [open])
  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) => (href === '/portfolio' && (pathname === '/portfolio' || pathname.startsWith('/projects/'))) || (href === '/partners' && pathname === '/partners')
  const localeHref = (locale: Locale) => locale === 'lv' ? pathname : `${pathname}?lang=${locale}`
  const languages = <>{(['lv','ru','en'] as Locale[]).map((locale) => <Link key={locale} href={localeHref(locale)} className={lang === locale ? styles.languageActive : styles.language} aria-current={lang === locale ? 'page' : undefined}>{locale.toUpperCase()}</Link>)}</>

  function handlePortfolioNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (pathname !== '/portfolio') return
    if (href !== '/portfolio' && !href.startsWith('/portfolio?category=')) return

    event.preventDefault()
    const target = new URL(href, window.location.origin)
    const category = target.searchParams.get('category') ?? ''
    const current = new URL(window.location.href)
    if (category) current.searchParams.set('category', category)
    else current.searchParams.delete('category')
    window.history.replaceState(window.history.state, '', `${current.pathname}${current.search}`)
    window.dispatchEvent(new CustomEvent('portfolio-category-change', { detail: { category } }))
    setOpen(false)
  }

  return <header className={styles.header}>
    <div className={`container ${styles.inner}`}>
      <Link href={withLocale('/', lang)} className={styles.brand} aria-label="Virtuve un Skapis"><img src="/logo/logo-original.png" alt="Virtuve un Skapis" width={433} height={160} /></Link>
      <nav className={styles.desktopNav} aria-label="Navigation">{headerNavigation.map((item) => <Link onClick={(event) => handlePortfolioNavigation(event, item.href)} key={item.href + item.label} href={localize(item.href)} className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`} aria-current={isActive(item.href) ? 'page' : undefined}>{labels[item.label] ?? item.label}</Link>)}</nav>
      <div className={styles.actions}><div className={styles.languages} aria-label="Language">{languages}</div><Link className={styles.cta} href={withLocale('/contacts', lang)}>{t.nav.contactCta}</Link><button className={styles.menuButton} type="button" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div>
    </div>
    {open && <div className={styles.overlay}><div className={styles.mobilePanel}><nav id="mobile-navigation" className={styles.mobileNav} aria-label="Mobile navigation">{headerNavigation.map((item) => <Link onClick={(event) => handlePortfolioNavigation(event, item.href)} key={item.href + item.label} href={localize(item.href)} className={`${styles.mobileLink} ${isActive(item.href) ? styles.mobileLinkActive : ''}`} aria-current={isActive(item.href) ? 'page' : undefined}>{labels[item.label] ?? item.label}</Link>)}</nav><div className={styles.mobileBottom}><div className={styles.mobileLanguages} aria-label="Language">{languages}</div><Link onClick={() => setOpen(false)} className={styles.mobileCta} href={withLocale('/contacts', lang)}>{t.nav.contactCta}</Link></div></div></div>}
  </header>
}
