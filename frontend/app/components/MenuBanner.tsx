'use client'

import { useCallback, useRef, useState } from 'react'

/* ── Slide data ──────────────────────────────────────────────────────────── */
const slides = [
  {
    eyebrow: 'Non-Kopi',
    heading: ['Matcha dengan rasa', 'lebih bold, lebih rich,', 'dan penuh karakter'],
    accent:  [false, true, false],
    price:   'Rp 26.000',
    badge:   'Favorit',
    image:   '/images/menu/menu_change.png',
    imgWidth: 'clamp(200px, 34%, 420px)',
  },
  {
    eyebrow: 'Makanan',
    heading: ['Croissant renyah di luar,', 'lembut di dalam —', 'dibuat segar setiap hari'],
    accent:  [false, true, false],
    price:   'Rp 22.000',
    badge:   'Segar',
    image:   '/images/menu/croissant.png',
    imgWidth: 'clamp(180px, 30%, 380px)',
  },
  {
    eyebrow: 'Menu Lengkap',
    heading: ['Dari espresso hingga matcha', '— semua ada,', 'semua untuk kamu'],
    accent:  [false, true, false],
    price:   'Mulai Rp 18.000',
    badge:   '25+ Pilihan',
    image:   '/images/content_banner.png',
    imgWidth: 'clamp(240px, 40%, 480px)',
  },
]

const TOTAL = slides.length

/* ── Cubic ease-out (matches About section) ──────────────────────────────── */
const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3)

export default function MenuBanner() {
  const [current,  setCurrent]  = useState(0)
  /* 'idle'  → content at rest
     'out'   → content animating away (left → left, right → right)
     After 'out' settles: swap current, jump new content to start position,
     then on next paint transition back to 'idle' (= animate in).           */
  const [phase,    setPhase]    = useState<'idle' | 'out'>('idle')
  const [locked,   setLocked]   = useState(false)
  const touchStart = useRef(0)

  const goTo = useCallback((next: number) => {
    if (locked) return
    setLocked(true)
    setPhase('out')                            /* 1. animate old content out */

    setTimeout(() => {
      setCurrent(((next % TOTAL) + TOTAL) % TOTAL) /* 2. swap slide (still 'out') */
      /* New content renders at the 'out' position (off-screen) with no
         visible transition since the CSS values haven't changed.
         Two rAF calls ensure the browser has painted at least one frame
         before we trigger the 'idle' transition (= animate new content in). */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('idle')                     /* 3. animate new content in  */
          setTimeout(() => setLocked(false), 500)
        })
      })
    }, 340)
  }, [locked])

  const slide = slides[current]

  /* ── Directional translate amounts ─────────────────────────────────────── */
  const OUT_LEFT  = '-80px'   /* left panel exits/enters from the left  */
  const OUT_RIGHT = '80px'    /* right panel exits/enters from the right */
  const DURATION  = '0.4s'

  /* Left text block — slides left on exit, slides in from left on enter */
  const leftStyle: React.CSSProperties = {
    opacity:    phase === 'idle' ? 1 : 0,
    transform:  phase === 'idle' ? 'translateX(0)' : `translateX(${OUT_LEFT})`,
    transition: `opacity ${DURATION} ease, transform ${DURATION} ease`,
    willChange: 'transform, opacity',
  }

  /* Right image — slides right on exit, slides in from right on enter.
     translateY(-50%) is merged here (not a Tailwind class) so it isn't
     overwritten by the inline transform on the same element.             */
  const rightStyle: React.CSSProperties = {
    opacity:    phase === 'idle' ? 1 : 0,
    transform:  phase === 'idle'
      ? 'translateX(0) translateY(-50%)'
      : `translateX(${OUT_RIGHT}) translateY(-50%)`,
    transition: `opacity ${DURATION} ease 0.04s, transform ${DURATION} ease 0.04s`,
    willChange: 'transform, opacity',
  }

  return (
    <section
      className="relative w-full overflow-hidden
                 min-h-[280px] md:min-h-[480px] lg:min-h-[520px]"
      style={{
        backgroundImage:    'url(/images/background_banner.png)',
        backgroundSize:     'cover',
        backgroundPosition: 'center',
      }}
      onTouchStart={e => { touchStart.current = e.changedTouches[0].clientX }}
      onTouchEnd={e => {
        const diff = touchStart.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1)
      }}
    >
      {/* ── Inner layout ───────────────────────────────────────────────── */}
      <div
        className="relative max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center
                   min-h-[280px] md:min-h-[480px] lg:min-h-[520px]"
      >

        {/* ── Text block — z-10 so it always sits above the image ───────── */}
        <div className="relative z-10 w-full md:w-1/2 py-10 md:py-14 lg:py-20" style={leftStyle}>

          {/* Eyebrow + badge */}
          <div className="flex items-center gap-3 mb-5">
            <p className="section-label text-kotta-red tracking-[0.45em]">
              {slide.eyebrow}
            </p>
            <span
              className="section-label tracking-[0.3em] px-2.5 py-1"
              style={{ background: 'rgba(143,49,51,0.08)', color: 'var(--kotta-red)' }}
            >
              {slide.badge}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="font-display text-[1.65rem] md:text-4xl lg:text-5xl
                       text-kotta-black leading-[1.15] md:leading-normal lg:leading-snug mb-5"
          >
            {slide.heading.map((line, li) => (
              <span
                key={li}
                className={`block ${slide.accent[li] ? 'text-kotta-red' : ''}`}
              >
                {line}
              </span>
            ))}
          </h2>

          {/* Price + category meta */}
          <div className="flex items-center gap-4">
            <span className="section-label text-kotta-black/40 tracking-[0.3em]">
              {slide.price}
            </span>
            <div className="h-px w-8 bg-kotta-black/20" />
            <span className="section-label text-kotta-red tracking-[0.3em]">
              {slide.eyebrow}
            </span>
          </div>
        </div>

        {/* ── Product image — absolute on all screens, behind text ─────────
            max-w-[45%] caps mobile size so it doesn't overwhelm the text;
            md:max-w-none restores the per-slide clamp on larger screens.   */}
        <div
          className="absolute top-1/2 right-0 md:right-4 lg:right-10
                     max-w-[45%] md:max-w-none
                     pointer-events-none select-none"
          style={{ ...rightStyle, width: slide.imgWidth }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.heading[0]}
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </div>

      </div>

      {/* ── Slide position indicators ─────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-[2px] rounded-full transition-all duration-300"
            style={{
              width:      i === current ? '24px' : '6px',
              background: i === current
                ? 'var(--kotta-red)'
                : 'rgba(13,13,13,0.22)',
            }}
          />
        ))}
      </div>

    </section>
  )
}
