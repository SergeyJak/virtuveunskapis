import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><Image src="/logo/logo.svg" alt="Virtuve un skapis" width={210} height={58} /><p>Mēbeles pēc individuāliem izmēriem Rīgā un visā Latvijā.</p></div>
        <div><h3>Navigācija</h3><Link href="/portfolio">Projekti</Link><Link href="/#materials">Materiāli</Link><Link href="/contacts">Kontakti</Link></div>
        <div><h3>Kontakti</h3><a href="tel:+37125123456">+371 25 123 456</a><a href="mailto:info@virtuveunskapis.lv">info@virtuveunskapis.lv</a><span>Rīga, Latvija</span></div>
      </div>
      <div className="container footer-bottom">© 2026 Virtuve un Skapis</div>
    </footer>
  )
}
