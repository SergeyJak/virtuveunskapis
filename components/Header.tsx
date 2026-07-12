'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navigation } from '@/data/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const headerNavigation = navigation.filter((item) => item.href !== '/contacts')

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Virtuve un skapis">
          <img src="/logo/logo-original.png" alt="Virtuve un skapis" width={433} height={160} />
        </Link>
        <nav className="desktop-nav" aria-label="Galvenā navigācija">
          {headerNavigation.map((item) => <Link key={item.href + item.label} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <div className="language-switcher" aria-label="Valodas izvēle">
            <Link href="/" aria-current="page">LV</Link>
            <Link href="/" aria-disabled="true">RU</Link>
            <Link href="/" aria-disabled="true">EN</Link>
          </div>
          <Link className="button button-primary desktop-cta" href="/contacts">Sazināties</Link>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Atvērt izvēlni" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobilā navigācija">
          {headerNavigation.map((item) => <Link onClick={() => setOpen(false)} key={item.href + item.label} href={item.href}>{item.label}</Link>)}
          <div className="mobile-language-switcher" aria-label="Valodas izvēle">
            <Link href="/" aria-current="page">LV</Link>
            <Link href="/" aria-disabled="true">RU</Link>
            <Link href="/" aria-disabled="true">EN</Link>
          </div>
          <Link onClick={() => setOpen(false)} className="button button-primary" href="/contacts">Sazināties</Link>
        </nav>
      )}
    </header>
  )
}
