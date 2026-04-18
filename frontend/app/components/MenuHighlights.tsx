'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const items = [
  { name: 'Kopi Anak Kotta',    badge: 'Signature', price: 'Rp 28.000', image: '/images/menu/menu.png', image_change: '/images/menu/menu_change.png' },
  { name: 'Es Kopi Kotta',      badge: 'Favorit',   price: 'Rp 25.000', image: '/images/menu/menu.png', image_change: '/images/menu/menu_change.png' },
  { name: 'Coconut Coffee',     badge: 'Unik',       price: 'Rp 30.000', image: '/images/menu/menu.png', image_change: '/images/menu/menu_change.png' },
  { name: 'Rosemary Americano', badge: 'Baru',       price: 'Rp 27.000', image: '/images/menu/menu.png', image_change: '/images/menu/menu_change.png' },
  { name: 'Matcha Latte',       badge: 'Non-Kopi',   price: 'Rp 26.000', image: '/images/menu/menu.png', image_change: '/images/menu/menu_change.png' },
  { name: 'Croissant',          badge: 'Makanan',    price: 'Rp 22.000', image: '/images/menu/croissant.png', image_change: '/images/menu/croissant_change.png' },
]

/* Cubic ease-out — used for grid/button progress */
const ease  = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3)
/* Power4 ease-out — matches OrderBand word reveal */
const ease4 = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4)

export default function MenuHighlights() {
  const headerRef  = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLDivElement>(null)
  const [headerP,    setHeaderP]    = useState(0)
  const [btnRectTop, setBtnRectTop] = useState(9999)

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        /* Uncapped so staggered offsets past 1.0 still fully resolve */
        setHeaderP(Math.max((vh - rect.top) / (vh * 0.65), 0))
      }
      if (btnRef.current) {
        setBtnRectTop(btnRef.current.getBoundingClientRect().top)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vh = typeof window !== 'undefined' ? window.innerHeight : 900

  /* ── Header text animations ────────────────────────────────────────────── */
  const visible = headerP > 0.1

  /* Fade + slide-up for label, ornament, description */
  const fadeUp = (delayMs: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'none' : 'translateY(20px)',
    transition: `opacity 0.65s ease-out ${delayMs}ms, transform 0.65s ease-out ${delayMs}ms`,
  })

  /* Clip-reveal for h2 words — scroll-driven rawP offset, matches OrderBand */
  const clipWord = (offset: number): React.CSSProperties => ({
    display:    'inline-block',
    transform:  `translateY(${(1 - ease4(headerP - offset)) * 105}%)`,
    transition: 'transform 1s ease-out',
  })

  /* Grid: fades in once header is fully visible (headerP → 1),
     fades back out if user scrolls back up — fully reversible.       */
  const gridE = ease((headerP - 0.85) / 0.15)

  /* CTA button: driven by its own viewport entry position,
     slides up from 40 px below — fully reversible.                   */
  const btnE = ease((vh - btnRectTop) / (vh * 0.5))

  return (
    <section id="menu" className="bg-kotta-cream py-28 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section Header ─────────────────────────────────────────── */}
        <div ref={headerRef} className="text-center mb-16">
          <p className="section-label text-kotta-red tracking-[0.45em] mb-4" style={fadeUp(0)}>
            Menu Pilihan
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-kotta-black leading-tight mb-6">
            {['Rasa', 'yang', 'Tak'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(i * 0.035)}>{word}</span>
              </span>
            ))}
            <br />
            <span className="inline-block overflow-hidden align-bottom">
              <span className="not-italic text-kotta-red inline-block" style={clipWord(0.105)}>Terlupakan</span>
            </span>
          </h2>
          <div className="ornament text-kotta-black/20 max-w-xs mx-auto mb-6" style={fadeUp(400)}>
            <span className="text-xs text-kotta-black/30 px-4">✦</span>
          </div>
          <p className="text-kotta-gray text-base max-w-md mx-auto leading-relaxed" style={fadeUp(480)}>
            Mulai dari Rp 14.000 &nbsp;·&nbsp; Tersedia di GoFood & GrabFood
          </p>
        </div>

        {/* ── Menu Grid ──────────────────────────────────────────────── */}
        <div className="grid items-start justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative hover:z-10"
              style={{
                opacity:    gridE,
                transition: `opacity 0.3s ease ${i * 0.06}s`,
              }}
            >
              {/* Default image — responsive aspect ratio */}
              <div className="relative w-full aspect-[2/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover
                             transition-opacity duration-300 ease-out
                             md:group-hover:opacity-0"
                />
              </div>

              {/* Hover image — md+ only to avoid overflow on mobile */}
              <img
                src={item.image_change}
                alt={item.name}
                className="hidden md:block absolute bottom-[60px] left-1/2 -translate-x-1/2
                           w-[130%] max-w-none pointer-events-none
                           opacity-0 scale-[1]
                           transition-[opacity,transform] duration-500 ease-out
                           group-hover:opacity-100 group-hover:scale-[1.15]"
              />

              {/* Name + price — always visible on mobile, slide up on hover md+ */}
              <div className="pt-3 overflow-hidden">
                <div className="opacity-100 translate-y-0
                               md:opacity-0 md:translate-y-3
                               md:group-hover:opacity-100 md:group-hover:translate-y-0
                               transition-all duration-300 ease-out">
                  <p className="font-display text-kotta-black text-sm md:text-base leading-snug">{item.name}</p>
                  <p className="font-body text-kotta-red text-xs md:text-sm mt-0.5 tracking-wide">{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────────────── */}
        <div
          ref={btnRef}
          className="text-center mt-20 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity:    btnE,
            transform:  `translateY(${(1 - btnE) * 40}px)`,
            willChange: 'transform, opacity',
          }}
        >
          <Link href="/menu" className="btn-primary">
            Lihat Menu Lengkap →
          </Link>
          <p className="text-kotta-gray text-xs tracking-[0.2em] uppercase">25+ Pilihan Tersedia</p>
        </div>

      </div>
    </section>
  )
}
