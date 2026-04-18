import Link from 'next/link'

const navLinks = [
  { label: 'Tentang Kami', href: '#tentang' },
  { label: 'Menu', href: '#menu' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Pesan Online', href: '#pesan' },
  { label: 'Lokasi', href: '#lokasi' },
  { label: 'Ulasan', href: '#ulasan' },
]

const outlets = ['Ponorogo', 'Jakarta', 'Tangerang', 'Bali', 'Bogor']

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/kottakopi',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@kottakopigroup',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
]

export default function Footer() {
  return (
    <footer className="bg-kotta-red text-kotta-cream">

      {/* ── Top border accent ─────────────────────────────────────────── */}
      <div className="h-px w-full bg-kotta-red/40" />

      {/* ── Main columns ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">

              <span className="font-display text-lg tracking-[0.25em]">KOTTA kopi</span>
            </Link>
            <p className="text-kotta-cream/40 text-sm leading-relaxed mb-6 max-w-[200px]">
              Kopinya Anak Kota — Specialty coffee dari Jakarta untuk Indonesia.
            </p>
            {/* Socials */}
            <div className="flex gap-4">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 border border-kotta-cream/15 flex items-center justify-center text-kotta-cream/40 hover:border-kotta-red transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="section-label text-kotta-cream/30 tracking-[0.35em] mb-6">Navigasi</p>
            <nav className="flex flex-col gap-3">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-body text-sm text-kotta-cream/50 transition-colors duration-200 tracking-wide"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/menu"
                className="font-body text-sm text-kotta-cream/50 transition-colors duration-200 tracking-wide"
              >
                Menu Lengkap
              </Link>
            </nav>
          </div>


          {/* All Outlets */}
          <div>
            <p className="section-label text-kotta-cream/30 tracking-[0.35em] mb-6">Semua Cabang</p>
            <div className="space-y-2">
              {outlets.map(city => (
                <div key={city} className="flex items-center gap-3">
                  <span className={`block w-1.5 h-1.5 rounded-full bg-kotta-cream/40`} />
                  <span className={`font-body text-sm text-kotta-cream/40`}>
                    {city}
                  </span>
                </div>
              ))}
            </div>

          </div>
          
          {/* Order badges */}
          <div className="space-y-2">
            <p className="section-label text-kotta-cream/25 tracking-[0.3em] mb-6">Pesan via</p>
            <a href="https://gofood.co.id" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-kotta-cream/40 text-xs transition-colors">
              <span className="w-4 h-4 bg-[#EF3529] rounded-full flex items-center justify-center text-white text-[8px] font-bold">G</span>
              GoFood
            </a>
            <a href="https://food.grab.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-kotta-cream/40 text-xs transition-colors">
              <span className="w-4 h-4 bg-[#00B14F] rounded-full flex items-center justify-center text-white text-[8px] font-bold">Gr</span>
              GrabFood
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="font-body text-kotta-cream/25 text-xs tracking-wide">
            © 2026 Kotta Kopi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
