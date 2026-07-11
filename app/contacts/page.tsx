import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'

export const metadata = { title: 'Kontakti', description: 'Sazinieties ar Virtuve un Skapis par individuālu mēbeļu projektu.' }

export default function ContactsPage() {
  return <>
    <div className="dark-header"><Header /></div>
    <main className="contact-page">
      <div className="container contact-grid">
        <div><p className="small-label">Kontakti</p><h1>Pastāstiet par savu ieceri</h1><p className="lead">Norādiet, kādas mēbeles vēlaties izgatavot. Mēs sazināsimies un precizēsim projekta detaļas.</p>
          <div className="contact-list"><a href="tel:+37125123456">+371 25 123 456</a><a href="mailto:info@virtuveunskapis.lv">info@virtuveunskapis.lv</a><span>Rīga, Latvija</span></div>
        </div>
        <ContactForm/>
      </div>
    </main>
    <Footer/>
  </>
}
