'use client'

import { FormEvent, useState } from 'react'

const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/andrej.petjko@gmail.com'

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    setSending(true)
    setError('')

    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      type: String(data.get('type') || '').trim(),
      message: String(data.get('message') || '').trim(),
      _subject: 'Jauns pieteikums no virtuveunskapis.lv',
      _template: 'table',
      _honey: String(data.get('_honey') || ''),
    }

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Request failed')

      const result = await response.json().catch(() => null)
      if (result && result.success === false) throw new Error('Submission failed')

      form.reset()
      setSent(true)
    } catch {
      setError('Pieteikumu neizdevās nosūtīt. Lūdzu, mēģiniet vēlreiz vai sazinieties ar mums pa tālruni.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <h2>Paldies!</h2>
        <p>Pieteikums ir nosūtīts. Mēs sazināsimies ar jums tuvākajā laikā.</p>
      </div>
    )
  }

  return (
    <>
      <form className="contact-form" onSubmit={submit}>
        <label>Vārds<input required name="name" autoComplete="name" /></label>
        <label>Tālrunis<input required name="phone" type="tel" autoComplete="tel" inputMode="tel" /></label>
        <label>Ko vēlaties izgatavot?<select name="type"><option>Virtuvi</option><option>Skapi</option><option>Garderobi</option><option>Vannas istabas mēbeles</option><option>Citu</option></select></label>
        <label>Īss apraksts<textarea name="message" rows={5} /></label>
        <input className="form-honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary" type="submit" disabled={sending} aria-busy={sending}>
          {sending ? 'Nosūtām…' : 'Nosūtīt pieteikumu'}
        </button>
      </form>
      <style jsx>{`
        .form-honeypot {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .form-error {
          margin: 0;
          padding: 12px 14px;
          border: 1px solid rgba(138, 54, 38, .22);
          background: rgba(138, 54, 38, .07);
          color: #7b3528;
          font-size: 14px;
          line-height: 1.5;
        }
        button:disabled {
          cursor: wait;
          opacity: .68;
        }
      `}</style>
    </>
  )
}
