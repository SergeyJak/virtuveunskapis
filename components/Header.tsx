'use client'

import Link from 'next/link'
import { Mail, Menu, Phone, X } from 'lucide-react'
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
  const contactLabels = lang === 'ru'
    ? { phone: 'Позвонить', email: 'Написать на email', whatsapp: 'Написать в WhatsApp' }
    : lang === 'en'
      ? { phone: 'Call', email: 'Send email', whatsapp: 'Message on WhatsApp' }
      : { phone: 'Zvanīt', email: 'Rakstīt e-pastu', whatsapp: 'Rakstīt WhatsApp' }

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
    {open && <div className={styles.overlay}><div className={styles.mobilePanel}><nav id="mobile-navigation" className={styles.mobileNav} aria-label="Mobile navigation">{headerNavigation.map((item) => <Link onClick={(event) => handlePortfolioNavigation(event, item.href)} key={item.href + item.label} href={localize(item.href)} className={`${styles.mobileLink} ${isActive(item.href) ? styles.mobileLinkActive : ''}`} aria-current={isActive(item.href) ? 'page' : undefined}>{labels[item.label] ?? item.label}</Link>)}</nav><div className={styles.mobileBottom}><div className={styles.quickContacts} aria-label="Contact"><a href="tel:+37122323266" className={styles.quickContact} aria-label={contactLabels.phone} title={contactLabels.phone}><Phone aria-hidden="true" /></a><a href="mailto:andrej.petjko@gmail.com" className={styles.quickContact} aria-label={contactLabels.email} title={contactLabels.email}><Mail aria-hidden="true" /></a><a href="https://wa.me/37122323266" target="_blank" rel="noreferrer" className={styles.quickContact} aria-label={contactLabels.whatsapp} title={contactLabels.whatsapp}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7a11.8 11.8 0 0 0 5.4 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Zm-8.3 18.2h-.1c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.5 4.7Zm5.4-7.3c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.7-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.2-.2-.4-.3-.7-.4Z" /></svg></a></div><div className={styles.mobileLanguages} aria-label="Language">{languages}</div><Link onClick={() => setOpen(false)} className={styles.mobileCta} href={withLocale('/contacts', lang)}>{t.nav.contactCta}</Link></div></div></div>}
  </header>
}
