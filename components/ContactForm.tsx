'use client'

import { FormEvent, useState } from 'react'

export function ContactForm() {
  const [sent, setSent] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }
  if (sent) return <div className="form-success"><h2>Paldies!</h2><p>Mēs sazināsimies ar jums tuvākajā laikā.</p></div>
  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Vārds<input required name="name" autoComplete="name" /></label>
      <label>Tālrunis<input required name="phone" type="tel" autoComplete="tel" /></label>
      <label>Ko vēlaties izgatavot?<select name="type"><option>Virtuvi</option><option>Skapi</option><option>Garderobi</option><option>Vannas istabas mēbeles</option><option>Citu</option></select></label>
      <label>Īss apraksts<textarea name="message" rows={5} /></label>
      <button className="button button-primary" type="submit">Nosūtīt pieteikumu</button>
    </form>
  )
}
