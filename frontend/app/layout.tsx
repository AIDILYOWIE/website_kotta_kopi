import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

/* ── Fonts ───────────────────────────────────────────────────────────── */
// Cormorant Garamond = visual stand-in while Ondo font files are added to /public/fonts/
const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-display',
  display:  'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display:  'swap',
})

/* ── Metadata ────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title:       'Kotta Kopi Ponorogo — Kopinya Anak Kota',
  description: 'Kopi specialty dari Jakarta kini hadir di Ponorogo. Ruang aesthetic, WiFi kencang, dan kopi yang tak terlupakan.',
  keywords:    ['kopi ponorogo', 'cafe ponorogo', 'kotta kopi', 'kopi specialty ponorogo'],
  authors:     [{ name: 'Kotta Kopi' }],
  openGraph: {
    title:       'Kotta Kopi Ponorogo — Kopinya Anak Kota',
    description: 'Kopi specialty dari Jakarta kini hadir di Ponorogo.',
    type:        'website',
    locale:      'id_ID',
  },
  other: {
    'geo.region':    'ID-JI',
    'geo.placename': 'Ponorogo, Jawa Timur',
  },
}

/* ── Root Layout ─────────────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
