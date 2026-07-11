import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://virtuveunskapis.lv'),
  title: { default: 'Virtuve un Skapis — mēbeles pēc individuāla pasūtījuma', template: '%s | Virtuve un Skapis' },
  description: 'Projektējam, izgatavojam un uzstādām virtuves un iebūvējamās mēbeles Rīgā un visā Latvijā.',
  openGraph: {
    title: 'Virtuve un Skapis',
    description: 'Mēbeles pēc individuāla pasūtījuma.',
    type: 'website',
    locale: 'lv_LV',
    images: ['/images/hero.jpg'],
  },
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="lv"><body>{children}</body></html>
}
