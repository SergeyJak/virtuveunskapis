'use client'

import { FormEvent, useState } from 'react'
import type { Locale } from '@/data/i18n'

const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/andrej.petjko@gmail.com'

const formCopy: Record<Locale, { name:string; phone:string; type:string; options:string[]; message:string; send:string; sending:string; successTitle:string; successText:string; error:string }> = {
  lv: { name:'Vārds', phone:'Tālrunis', type:'Ko vēlaties izgatavot?', options:['Virtuvi','Skapi','Garderobi','Vannas istabas mēbeles','Citu'], message:'Īss apraksts', send:'Nosūtīt pieteikumu', sending:'Nosūtām…', successTitle:'Paldies!', successText:'Pieteikums ir nosūtīts. Mēs sazināsimies ar jums tuvākajā laikā.', error:'Pieteikumu neizdevās nosūtīt. Lūdzu, mēģiniet vēlreiz vai sazinieties ar mums pa tālruni.' },
  ru: { name:'Имя', phone:'Телефон', type:'Что вы хотите изготовить?', options:['Кухню','Шкаф','Гардеробную','Мебель для ванной','Другое'], message:'Краткое описание', send:'Отправить заявку', sending:'Отправляем…', successTitle:'Спасибо!', successText:'Заявка отправлена. Мы свяжемся с вами в ближайшее время.', error:'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.' },
  en: { name:'Name', phone:'Phone', type:'What would you like us to make?', options:['Kitchen','Wardrobe','Walk-in closet','Bathroom furniture','Other'], message:'Short description', send:'Send request', sending:'Sending…', successTitle:'Thank you!', successText:'Your request has been sent. We will contact you shortly.', error:'We could not send your request. Please try again or contact us by phone.' },
}

export function ContactForm({ lang = 'lv' }: { lang?: Locale }) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const t = formCopy[lang]

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
      const response = await fetch(CONTACT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error('Request failed')
      const result = await response.json().catch(() => null)
      if (result && result.success === false) throw new Error('Submission failed')
      form.reset()
      setSent(true)
    } catch {
      setError(t.error)
    } finally {
      setSending(false)
    }
  }

  if (sent) return <div className="form-success" role="status"><h2>{t.successTitle}</h2><p>{t.successText}</p></div>

  return <>
    <form className="contact-form" onSubmit={submit}>
      <label>{t.name}<input required name="name" autoComplete="name" /></label>
      <label>{t.phone}<input required name="phone" type="tel" autoComplete="tel" inputMode="tel" /></label>
      <label>{t.type}<select name="type">{t.options.map(option => <option key={option}>{option}</option>)}</select></label>
      <label>{t.message}<textarea name="message" rows={5} /></label>
      <input className="form-honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" type="submit" disabled={sending} aria-busy={sending}>{sending ? t.sending : t.send}</button>
    </form>
    <style jsx>{`
      .form-honeypot { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
      .form-error { margin:0; padding:12px 14px; border:1px solid rgba(138,54,38,.22); background:rgba(138,54,38,.07); color:#7b3528; font-size:14px; line-height:1.5; }
      button:disabled { cursor:wait; opacity:.68; }
    `}</style>
  </>
}
