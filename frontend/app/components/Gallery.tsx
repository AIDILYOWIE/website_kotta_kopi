'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


/* Power4 ease-out — matches OrderBand word reveal */
const ease4 = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4)

/* ─── Three stacked photos — 2 transitions, 300 vh runway ───────────────── */
const STACK = [
  { label: 'Interior Utama', num: '01', src: '/images/gallery/gallery_1.jpg' },
  { label: 'Espresso Bar',   num: '02', src: '/images/gallery/gallery_2.jpg' },
  { label: 'Behind the Bar', num: '03', src: '/images/gallery/gallery_3.jpg' },
  { label: 'Behind the Bar', num: '04', src: '/images/gallery/gallery_4.png' },
]

export default function Gallery() {
  /* ── Header slide-in ──────────────────────────────────────────────────── */
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerP, setHeaderP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return
      const vh   = window.innerHeight
      const rect = headerRef.current.getBoundingClientRect()
      setHeaderP(Math.max((vh - rect.top) / (vh * 0.65), 0))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = headerP > 0.1

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

  /* ── GSAP scroll gallery ──────────────────────────────────────────────── */
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const imgs = imgRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (!wrapperRef.current || imgs.length < STACK.length) return

    gsap.registerPlugin(ScrollTrigger)

    /* gsap.context() scopes all tweens + ScrollTriggers to this component.
       ctx.revert() on unmount cleanly kills everything.                    */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start:   'top top',      /* animation begins when wrapper hits viewport top  */
          end:     'bottom bottom',/* 300vh wrapper → 200vh scroll space = 2 slides   */
          scrub:   0.8,            /* animation lags slightly behind scroll for feel   */
        },
      })

      /* 2 transitions across 3 stacked images
         ─ Top image:   scale 1 → 0  (shrinks away to reveal the layer below)
         ─ Below image: stays at scale 1 — revealed statically, no zoom      */
      for (let i = 0; i < STACK.length - 1; i++) {
        tl.fromTo(imgs[i], { scale: 1 }, { scale: 0, ease: 'none' }, i)
      }
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="galeri" className="bg-kotta-red">

      {/* ── Section Header ─────────────────────────────────────────────────
          Slides in from the left screen-edge as the section enters view.   */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 lg:pt-40 pb-20">
        <div ref={headerRef} className="text-center">
          <p className="section-label text-kotta-cream/50 tracking-[0.45em] mb-3" style={fadeUp(0)}>
            Galeri
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-kotta-cream leading-tight mb-6">
            {['Tempatnya', 'Buat', 'Konten,'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(i * 0.035)}>{word}</span>
              </span>
            ))}
            <br />
            {['Kopinya', 'Buat', 'Jiwa'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom text-kotta-cream/60" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(0.10 + i * 0.035)}>{word}</span>
              </span>
            ))}
          </h2>
          <p className="text-kotta-cream/40 text-sm max-w-md mx-auto leading-relaxed tracking-wide" style={fadeUp(560)}>
            Setiap sudut dirancang untuk jadi background foto terbaikmu.
          </p>
        </div>
      </div>

      {/* ── Scroll Gallery Stack ────────────────────────────────────────────
          wrapperRef is 300 vh tall — the scroll runway.
          Scroll distance = 300 vh − 100 vh = 200 vh → drives 2 transitions.

          The sticky viewport inside pins at top:0 while the user scrolls
          through the runway. GSAP maps scroll progress → timeline progress
          which scales each image layer in / out in sequence.               */}
      <div id="galeri-wrapper" ref={wrapperRef} style={{ height: '300vh' }}>

        {/* Sticky full-viewport canvas */}
        <div
          style={{
            position: 'sticky',
            top:      0,
            height:   '100vh',
            overflow: 'hidden',
          }}
        >
          {STACK.map((photo, i) => (
            <div
              key={i}
              ref={el => { imgRefs.current[i] = el }}
              style={{
                position:   'absolute',
                inset:      0,
                zIndex:     STACK.length - 1 - i,   /* 2, 1, 0  — top to bottom */
                willChange: 'transform',
              }}
            >
              {/* Full-bleed photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.label}
                style={{
                  width:      '100%',
                  height:     '100%',
                  objectFit:  'cover',
                  objectPosition: 'center',
                  display:    'block',
                }}
              />

              {/* Dark gradient — ensures text legibility on any photo */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(13,13,13,.75) 0%, rgba(13,13,13,.15) 50%, transparent 100%)',
                }}
              />
            </div>
          ))}
        </div>

      </div>
      {/* End scroll gallery */}

    </section>
  )
}
