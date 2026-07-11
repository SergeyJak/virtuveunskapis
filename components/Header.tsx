'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navigation } from '@/data/site'

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Virtuve un skapis">
          <Image src="/logo/logo.svg" alt="Virtuve un skapis" width={210} height={58} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Galvenā navigācija">
          {navigation.map((item) => <Link key={item.href+item.label} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="button button-primary desktop-cta" href="/contacts">Sazināties</Link>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Atvērt izvēlni" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobilā navigācija">
          {navigation.map((item) => <Link onClick={() => setOpen(false)} key={item.href+item.label} href={item.href}>{item.label}</Link>)}
          <Link onClick={() => setOpen(false)} className="button button-primary" href="/contacts">Sazināties</Link>
        </nav>
      )}
    </header>
  )
}
