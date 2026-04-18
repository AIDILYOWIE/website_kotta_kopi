'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/* ── clip-path values ────────────────────────────────────────────────────
   SQUARE_CLIP: 320×320 px centered square at any viewport.
   FULL_CLIP:   zero inset — image fills the entire hero card.             */
const SQUARE_CLIP = 'inset(max(0px, calc(50% - 160px)) max(0px, calc(50% - 160px)) round 16px)'
const FULL_CLIP   = 'inset(0px 0px round 0px)'

/* ── Timeline (ms from page load) ────────────────────────────────────────
   Image layers are JS-driven (state machine).
   Text layers are CSS-animated — delays count from page paint, not
   from React hydration, so they always fire on time on mobile.            */
const T = {
  img2:  1300,
  img3:  2600,
  img4:  3900,
  text:  4200,   // content wrapper fades in
  desc:  5000,
  ctas:  5200,
  badge: 5800,
}

/* ── CSS animation shorthand helper ─────────────────────────────────────
   All text animations use this instead of React state so the delay
   is measured from the CSS paint, not from when useEffect fires.          */
function anim(
  name: string,
  duration: string,
  easing: string,
  delayMs: number,
): React.CSSProperties {
  return {
    animationName:           name,
    animationDuration:       duration,
    animationTimingFunction: easing,
    animationDelay:          `${delayMs}ms`,
    animationFillMode:       'forwards',
  }
}

/* ── Per-letter CSS slide-up (replaces the old ltr() state helper) ──────
   baseDelayMs  = T.text (when the title block becomes visible)
   letterOffset = additional stagger in seconds for this specific letter   */
function ltr(baseDelayMs: number, letterOffsetSec: number): React.CSSProperties {
  return {
    display:    'inline-block',
    transform:  'translateY(115%)',
    ...anim(
      'hero-slide-up',
      '1.4s',
      'cubic-bezier(0.16, 1, 0.3, 1)',
      baseDelayMs + Math.round(letterOffsetSec * 1000),
    ),
    willChange: 'transform',
  }
}

/* ── Overlay image phase ─────────────────────────────────────────────────
   'hidden' → opacity 0, square clip, no transition
   'square' → opacity 1, square clip, no transition  (just appeared)
   'full'   → opacity 1, full  clip, clip transition (expanding)
   'gone'   → opacity 0, full  clip, opacity transition (fading out)        */
type Phase = 'hidden' | 'square' | 'full' | 'gone'

function overlayStyle(phase: Phase, src: string, zIndex: number): React.CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    zIndex,
    backgroundImage: `url('${src}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'inherit',
    opacity:   (phase === 'hidden' || phase === 'gone') ? 0 : 1,
    clipPath:  (phase === 'full'   || phase === 'gone') ? FULL_CLIP : SQUARE_CLIP,
    transition: phase === 'full' ? 'clip-path 1.4s cubic-bezier(0.76, 0, 0.24, 1)'
              : phase === 'gone' ? 'opacity 0.4s ease'
              : 'none',
    willChange: 'clip-path, opacity',
  }
}

/* ── setTimeout wrapper — more reliable than rAF on iOS Safari ───────────
   iOS Safari can suspend requestAnimationFrame before the first user
   interaction; setTimeout uses a separate timer queue that is not paused. */
const dblRaf = (fn: () => void) => setTimeout(fn, 32)

export default function Hero() {
  /* Only image-layer states remain — all text reveals are CSS-animated */
  const [img1Full, setImg1Full] = useState(false)
  const [p2, setP2] = useState<Phase>('hidden')
  const [p3, setP3] = useState<Phase>('hidden')
  const [p4, setP4] = useState<Phase>('hidden')

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => ids.push(setTimeout(fn, ms))

    /* hero_1 — expands 32 ms after mount */
    ids.push(dblRaf(() => setImg1Full(true)))

    /* hero_2 / 3 / 4 — each snaps to square then transitions to full */
    at(T.img2, () => { setP2('square'); dblRaf(() => setP2('full')) })
    at(T.img3, () => { setP3('square'); dblRaf(() => setP3('full')) })
    at(T.img4, () => { setP4('square'); dblRaf(() => setP4('full')) })

    return () => ids.forEach(clearTimeout)
  }, [])

  return (
    <section
      id="beranda"
      className="min-h-[calc(100vh-1rem)] max-h-[calc(100vh-1rem)] mx-3 my-3 rounded-3xl overflow-hidden relative"
    >
      {/* ── Layer 1: hero_1.png (base, always present) ───────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: "url('/images/hero/hero_1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 'inherit',
          clipPath:   img1Full ? FULL_CLIP   : SQUARE_CLIP,
          transition: img1Full ? 'clip-path 1.4s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
          willChange: 'clip-path',
        }}
      />

      {/* ── Layer 2: hero_2.jpg ───────────────────────────────────────── */}
      <div style={overlayStyle(p2, '/images/hero/hero_2.jpg', 2)} />

      {/* ── Layer 3: hero_3.jpg ───────────────────────────────────────── */}
      <div style={overlayStyle(p3, '/images/hero/hero_3.jpg', 3)} />

      {/* ── Layer 4: hero_4 (resurfaces as hero_1) ───────────────────── */}
      <div style={overlayStyle(p4, '/images/hero/hero_1.png', 4)} />

      {/* ── Gradient overlay — CSS animated, starts from page paint ─────
          No React state needed; animation-delay counts from CSS apply time */}
      <div
        className="hero-img-gradient"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          opacity: 0,
          ...anim('hero-fade-in', '1.4s', 'ease', 200),
        }}
      />

      {/* ── Content — CSS animated wrapper ───────────────────────────────
          opacity: 0 via initial style; hero-fade-in lifts it at T.text.
          Because this is a CSS animation (not React state), the delay
          counts from page paint — guaranteed to fire on mobile.           */}
      <div
        className="relative z-20 text-center px-6 max-w-6xl mx-auto mt-[60px] md:mt-[80px]
                   flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]"
        style={{ opacity: 0, ...anim('hero-fade-in', '0.4s', 'ease', T.text) }}
      >

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
          <span
            className="h-px w-8 md:w-16 bg-kotta-red/60"
            style={{ opacity: 0, ...anim('hero-fade-in', '1s', 'ease', T.text + 500) }}
          />
          <div style={{ overflow: 'hidden' }}>
            <p
              className="section-label text-kotta-red tracking-[0.35em] md:tracking-[0.45em]"
              style={{
                transform: 'translateY(115%)',
                ...anim('hero-slide-up', '1.4s', 'cubic-bezier(0.16, 1, 0.3, 1)', T.text + 100),
              }}
            >
              Now Open · Ponorogo
            </p>
          </div>
          <span
            className="h-px w-8 md:w-16 bg-kotta-red/60"
            style={{ opacity: 0, ...anim('hero-fade-in', '1s', 'ease', T.text + 500) }}
          />
        </div>

        {/* "Kopinya" — per-letter slide-up */}
        <div className="mb-1 md:mb-2" style={{ overflow: 'hidden', paddingBottom: '0.12em' }}>
          <h1 className="font-display text-[11vw] sm:text-[11vw] md:text-[10vw] lg:text-[9rem]
                         text-kotta-red leading-[0.88] mb-0 text-shadow-sm">
            {'Kopinya'.split('').map((char, i) => (
              <span key={i} style={ltr(T.text, 0.15 + i * 0.065)}>{char}</span>
            ))}
          </h1>
        </div>

        {/* "Anak KOTTA" — per-letter, KOTTA in cream */}
        <div className="mb-5 md:mb-8 mt-[10px] md:mt-[20px]" style={{ overflow: 'hidden', paddingBottom: '0.12em' }}>
          <h1 className="font-display text-[11vw] sm:text-[11vw] md:text-[10vw] lg:text-[9rem]
                         text-kotta-red leading-[0.88] mb-0 text-shadow-sm">
            {'Anak\u00A0'.split('').map((char, i) => (
              <span key={i} style={ltr(T.text, 0.5 + i * 0.065)}>{char}</span>
            ))}
            {'KOTTA'.split('').map((char, i) => (
              <span
                key={i}
                className="text-kotta-cream"
                style={{ ...ltr(T.text, 0.82 + i * 0.065), letterSpacing: '0.1em' }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Description */}
        <div style={{
          opacity: 0,
          transform: 'translateY(16px)',
          ...anim('hero-rise-in', '0.9s', 'ease', T.desc),
        }}>
          <p className="font-body text-kotta-cream/85 text-sm md:text-lg max-w-sm md:max-w-md mx-auto mb-6 md:mb-8 leading-relaxed tracking-wide">
            Lokasi baru kami kini resmi dibuka di Ponorogo —
            kopi specialty, ruang yang hangat, untuk kamu.
          </p>
        </div>

        {/* CTAs */}
        <div style={{
          opacity: 0,
          transform: 'translateY(16px)',
          ...anim('hero-rise-in', '0.9s', 'ease', T.ctas),
        }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 md:mb-8">
            <Link href="/menu" className="font-display btn-primary shadow-sm w-full sm:w-auto">
              Lihat Menu Kami
            </Link>
            <Link href="#lokasi" className="font-display btn-light shadow-sm w-full sm:w-auto">
              Temukan Lokasi
            </Link>
          </div>
        </div>

        {/* Opening date */}
        <div style={{
          opacity: 0,
          ...anim('hero-fade-in', '1s', 'ease', T.badge),
        }}>
          <p className="font-body mb-[10px] text-kotta-cream/40 text-[10px] tracking-[0.35em] md:tracking-[0.45em] uppercase">
            Grand Opening · 21 Maret 2026
          </p>
        </div>

      </div>
    </section>
  )
}
