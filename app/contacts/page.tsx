import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'
import { businessContacts } from '@/data/site'

export const metadata = { title: 'Kontakti', description: 'Sazinieties ar Virtuve un Skapis par individuālu mēbeļu projektu.' }

export default function ContactsPage() {
  return <>
    <div className="dark-header"><Header /></div>
    <main id="main-content" className="contact-page contact-page-premium">
      <div className="container contact-premium-shell">
        <section className="contact-premium-intro">
          <div className="contact-premium-copy">
            <p className="small-label">Kontakti</p>
            <h1>Pastāstiet par savu ieceri</h1>
            <p className="lead">Norādiet, kādas mēbeles vēlaties izgatavot. Mēs sazināsimies un precizēsim projekta detaļas.</p>
          </div>

          <div className="contact-premium-details">
            <a className="contact-detail" href={businessContacts.phoneHref}>
              <span className="contact-detail-label">Tālrunis</span>
              <strong>{businessContacts.phoneDisplay}</strong>
            </a>
            <a className="contact-detail" href={businessContacts.emailHref}>
              <span className="contact-detail-label">E-pasts</span>
              <strong>{businessContacts.email}</strong>
            </a>
            <div className="contact-detail">
              <span className="contact-detail-label">Atrašanās vieta</span>
              <strong>{businessContacts.address}</strong>
            </div>
          </div>
        </section>

        <section className="contact-premium-form-wrap">
          <div className="contact-form-heading">
            <p className="small-label">Pieteikums</p>
            <h2>Sāksim ar jūsu ideju</h2>
            <p>Atstājiet pamatinformāciju, un mēs sazināsimies, lai izrunātu detaļas.</p>
          </div>
          <ContactForm/>
        </section>
      </div>
    </main>
    <Footer/>

    <style>{`
      .contact-page-premium {
        position: relative;
        overflow: hidden;
        padding: 0;
        background:
          radial-gradient(circle at 88% 8%, rgba(182,141,84,.17), transparent 28%),
          linear-gradient(180deg, #f7f4ee 0%, #fff 55%, #f3ede3 100%);
      }
      .contact-page-premium::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(90deg, rgba(20,19,16,.035) 1px, transparent 1px);
        background-size: 96px 96px;
        opacity: .5;
      }
      .contact-premium-shell {
        position: relative;
        z-index: 1;
        width: min(calc(100% - 40px), 1280px);
        padding: 112px 0 124px;
      }
      .contact-premium-intro {
        display: grid;
        grid-template-columns: 1.15fr .85fr;
        gap: 88px;
        align-items: end;
        padding-bottom: 72px;
      }
      .contact-premium-copy h1 {
        max-width: 780px;
        margin: 12px 0 26px;
        font-size: clamp(58px, 7.2vw, 108px);
        line-height: .95;
        letter-spacing: -.055em;
        overflow-wrap: anywhere;
      }
      .contact-premium-copy .lead {
        max-width: 650px;
        margin: 0;
        font-size: 21px;
        line-height: 1.65;
      }
      .contact-premium-details {
        display: grid;
        border-top: 1px solid rgba(31,28,24,.14);
      }
      .contact-detail {
        display: grid;
        gap: 7px;
        padding: 22px 0;
        border-bottom: 1px solid rgba(31,28,24,.14);
      }
      a.contact-detail:hover strong { color: #9f7640; }
      .contact-detail-label {
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .16em;
        text-transform: uppercase;
      }
      .contact-detail strong {
        font-size: clamp(20px, 2vw, 28px);
        line-height: 1.15;
        font-weight: 600;
        letter-spacing: -.02em;
        transition: color .2s ease;
      }
      .contact-premium-form-wrap {
        display: grid;
        grid-template-columns: .78fr 1.22fr;
        gap: 72px;
        align-items: start;
        padding: 64px;
        border: 1px solid rgba(31,28,24,.1);
        background: rgba(255,255,255,.8);
        box-shadow: 0 34px 100px rgba(31,28,24,.1);
        backdrop-filter: blur(12px);
      }
      .contact-form-heading {
        position: sticky;
        top: 32px;
        padding-top: 8px;
      }
      .contact-form-heading h2 {
        max-width: 430px;
        margin: 12px 0 18px;
        font-size: clamp(38px, 4vw, 60px);
        line-height: 1;
        letter-spacing: -.045em;
        overflow-wrap: anywhere;
      }
      .contact-form-heading p:not(.small-label) {
        max-width: 420px;
        margin: 0;
        color: var(--muted);
        font-size: 17px;
        line-height: 1.65;
      }
      .contact-page-premium .contact-form {
        min-width: 0;
        padding: 0;
        gap: 22px;
        border: 0;
        background: transparent;
      }
      .contact-page-premium .contact-form label {
        min-width: 0;
        gap: 9px;
        color: #2a2824;
        font-size: 14px;
      }
      .contact-page-premium .contact-form input,
      .contact-page-premium .contact-form textarea,
      .contact-page-premium .contact-form select {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        min-height: 54px;
        padding: 15px 16px;
        border: 1px solid rgba(31,28,24,.16);
        border-radius: 0;
        outline: none;
        background: rgba(250,248,244,.95);
        transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
      }
      .contact-page-premium .contact-form textarea { min-height: 150px; resize: vertical; }
      .contact-page-premium .contact-form input:focus,
      .contact-page-premium .contact-form textarea:focus,
      .contact-page-premium .contact-form select:focus {
        border-color: rgba(182,141,84,.72);
        background: #fff;
        box-shadow: 0 0 0 3px rgba(182,141,84,.1);
      }
      .contact-page-premium .contact-form .button {
        min-height: 56px;
        margin-top: 4px;
      }
      .contact-page-premium .form-success {
        padding: 44px;
        border: 1px solid rgba(31,28,24,.1);
        background: #fff;
        box-shadow: 0 24px 70px rgba(31,28,24,.08);
      }
      .contact-page-premium .form-success h2 {
        margin: 0 0 10px;
        font-size: 38px;
        letter-spacing: -.035em;
      }
      .contact-page-premium .form-success p { margin: 0; color: var(--muted); }

      @media (max-width: 980px) {
        .contact-premium-shell { padding: 84px 0 96px; }
        .contact-premium-intro { grid-template-columns: 1fr; gap: 46px; padding-bottom: 56px; }
        .contact-premium-details { max-width: 720px; }
        .contact-premium-form-wrap { grid-template-columns: 1fr; gap: 42px; padding: 44px; }
        .contact-form-heading { position: static; }
      }

      @media (max-width: 640px) {
        .contact-premium-shell {
          width: min(calc(100% - 28px), 1280px);
          padding: 70px 0 78px;
        }
        .contact-premium-intro { gap: 38px; padding-bottom: 42px; }
        .contact-premium-copy h1 { margin-top: 10px; font-size: clamp(42px, 13vw, 52px); }
        .contact-premium-copy .lead { font-size: 18px; line-height: 1.6; }
        .contact-detail { padding: 18px 0; }
        .contact-detail strong { font-size: 20px; overflow-wrap: anywhere; }
        .contact-premium-form-wrap { gap: 32px; padding: 28px 20px; }
        .contact-form-heading h2 { font-size: clamp(36px, 11vw, 40px); }
        .contact-form-heading p:not(.small-label) { font-size: 16px; }
        .contact-page-premium .contact-form { padding: 0; }
        .contact-page-premium .contact-form .button { width: 100%; }
        .contact-page-premium .form-success { padding: 30px 22px; }
      }
    `}</style>
  </>
}
