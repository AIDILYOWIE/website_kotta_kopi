'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/* ── clip-path values ────────────────────────────────────────────────────
   SQUARE_CLIP: 320×320 px centered square at any viewport — calc(50% - 160px)
   insets exactly 160px from centre on every side.
   FULL_CLIP:   zero inset — image fills the entire hero card.             */
const SQUARE_CLIP = 'inset(max(0px, calc(50% - 160px)) max(0px, calc(50% - 160px)) round 16px)'
const FULL_CLIP   = 'inset(0px 0px round 0px)'

/* ── Timeline (ms) ───────────────────────────────────────────────────────
   Each photo gets its own 1.4 s square→full expansion.
   hero_1 opens first (starting frame) and resurfaces last (ending frame). */
const T = {
  img1:   0,     // hero_1 begins expanding on first paint
  img2:   1300,  // hero_2 appears as square → expands
  img3:   2600,  // hero_3 appears as square → expands
  img4:   3900,  // hero_4 appears as square → expands
  text:   4200,  // per-letter title begins
  desc:   5000,
  ctas:   5200,
  badge:  5800,
}

/* ── Per-letter transform helper ─────────────────────────────────────── */
function ltr(active: boolean, delay: number): React.CSSProperties {
  return {
    display: 'inline-block',
    transform: active ? 'translateY(0)' : 'translateY(115%)',
    transition: active
      ? `transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
      : 'none',
    willChange: 'transform',
  }
}

/* ── Overlay image phase ─────────────────────────────────────────────────
   'hidden' → opacity 0, square clip, no transition  (invisible in DOM)
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

/* 32 ms ≈ 2 frames — guarantees a paint before the state flip so CSS
   transitions fire correctly. Uses setTimeout instead of requestAnimationFrame
   because iOS Safari suspends rAF during its initial page-load activation
   window; setTimeout runs from a separate timer queue that is not suspended. */
const dblRaf = (fn: () => void) => setTimeout(fn, 32)

export default function Hero() {
  /* hero_1: clip state (base layer, always present) */
  const [img1Full, setImg1Full] = useState(false)
  /* hero_2 / hero_3: overlay phases */
  const [p2, setP2] = useState<Phase>('hidden')
  const [p3, setP3] = useState<Phase>('hidden')
  const [p4, setP4] = useState<Phase>('hidden')
  /* gradient */
  const [gradIn,  setGradIn]  = useState(false)
  /* text elements */
  const [textIn,  setTextIn]  = useState(false)
  const [descIn,  setDescIn]  = useState(false)
  const [ctasIn,  setCtasIn]  = useState(false)
  const [badgeIn, setBadgeIn] = useState(false)

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => ids.push(setTimeout(fn, ms))

    /* hero_1 — expands immediately on first paint */
    dblRaf(() => { setImg1Full(true); setGradIn(true) })

    /* hero_2 — snaps in as square, then a double-rAF later starts expanding */
    at(T.img2, () => { setP2('square'); dblRaf(() => setP2('full')) })

    /* hero_3 — same pattern */
    at(T.img3, () => { setP3('square'); dblRaf(() => setP3('full')) })

    /* hero_4 — same pattern */
    at(T.img4, () => { setP4('square'); dblRaf(() => setP4('full')) })


    /* text cascade */
    at(T.text,  () => setTextIn(true))
    at(T.desc,  () => setDescIn(true))
    at(T.ctas,  () => setCtasIn(true))
    at(T.badge, () => setBadgeIn(true))

    return () => ids.forEach(clearTimeout)
  }, [])

  return (
    <section
      id="beranda"
      className="min-h-[calc(100vh-1rem)] max-h-[calc(100vh-1rem)] mx-3 my-3 rounded-3xl overflow-hidden relative"
    >
      {/* ── Layer 1: hero_1.png ───────────────────────────────────────────
          Starting frame: square clip on dark bg.
          Ending frame:   same image, full-screen, after hero_2/3 fade out. */}
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

      {/* ── Layer 2: hero_2.jpg ───────────────────────────────────────────
          Appears as square at t=1.5 s, expands to full, then fades out.   */}
      <div style={overlayStyle(p2, '/images/hero/hero_2.jpg', 2)} />

      {/* ── Layer 3: hero_3.jpg ───────────────────────────────────────────
          Appears as square at t=3.0 s, expands to full, then fades out.   */}
      <div style={overlayStyle(p3, '/images/hero/hero_3.jpg', 3)} />

      {/* ── Layer 4: hero_4.jpg ───────────────────────────────────────────
          Appears as square at t=4.5 s, expands to full, then fades out.   */}
      <div style={overlayStyle(p4, '/images/hero/hero_1.png', 4)} />

      {/* ── Gradient overlay — fades in with hero_1's expansion ─────────── */}
      <div
        className="hero-img-gradient"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          opacity:    gradIn ? 1 : 0,
          transition: gradIn ? 'opacity 1.4s ease' : 'none',
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {/* opacity:0 until textIn fires — hides text reliably during image animation */}
      <div
        className="relative z-20 text-center px-6 max-w-6xl mx-auto mt-[60px] md:mt-[80px]
                   flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]"
        style={{
          opacity:    textIn ? 1 : 0,
          transition: textIn ? 'opacity 0.4s ease' : 'none',
        }}
      >

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
          <span
            className="h-px w-8 md:w-16 bg-kotta-red/60"
            style={{
              opacity:    textIn ? 1 : 0,
              transition: textIn ? 'opacity 1s ease 0.5s' : 'none',
            }}
          />
          <div style={{ overflow: 'hidden' }}>
            <p
              className="section-label text-kotta-red tracking-[0.35em] md:tracking-[0.45em]"
              style={{
                transform:  textIn ? 'translateY(0)' : 'translateY(115%)',
                transition: textIn ? 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' : 'none',
              }}
            >
              Now Open · Ponorogo
            </p>
          </div>
          <span
            className="h-px w-8 md:w-16 bg-kotta-red/60"
            style={{
              opacity:    textIn ? 1 : 0,
              transition: textIn ? 'opacity 1s ease 0.5s' : 'none',
            }}
          />
        </div>

        {/* "Kopinya" — per-letter slide-up */}
        <div className="mb-1 md:mb-2" style={{ overflow: 'hidden', paddingBottom: '0.12em' }}>
          <h1 className="font-display text-[11vw] sm:text-[11vw] md:text-[10vw] lg:text-[9rem]
                         text-kotta-red leading-[0.88] mb-0 text-shadow-sm">
            {'Kopinya'.split('').map((char, i) => (
              <span key={i} style={ltr(textIn, 0.15 + i * 0.065)}>{char}</span>
            ))}
          </h1>
        </div>

        {/* "Anak KOTTA" — per-letter, KOTTA in cream */}
        <div className="mb-5 md:mb-8 mt-[10px] md:mt-[20px]" style={{ overflow: 'hidden', paddingBottom: '0.12em' }}>
          <h1 className="font-display text-[11vw] sm:text-[11vw] md:text-[10vw] lg:text-[9rem]
                         text-kotta-red leading-[0.88] mb-0 text-shadow-sm">
            {'Anak\u00A0'.split('').map((char, i) => (
              <span key={i} style={ltr(textIn, 0.5 + i * 0.065)}>{char}</span>
            ))}
            {'KOTTA'.split('').map((char, i) => (
              <span
                key={i}
                className="text-kotta-cream"
                style={{ ...ltr(textIn, 0.82 + i * 0.065), letterSpacing: '0.1em' }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Description */}
        <div
          style={{
            opacity:    descIn ? 1 : 0,
            transform:  descIn ? 'translateY(0)' : 'translateY(16px)',
            transition: descIn ? 'opacity 0.9s ease, transform 0.9s ease' : 'none',
          }}
        >
          <p className="font-body text-kotta-cream/85 text-sm md:text-lg max-w-sm md:max-w-md mx-auto mb-6 md:mb-8 leading-relaxed tracking-wide">
            Lokasi baru kami kini resmi dibuka di Ponorogo —
            kopi specialty, ruang yang hangat, untuk kamu.
          </p>
        </div>

        {/* CTAs */}
        <div
          style={{
            opacity:    ctasIn ? 1 : 0,
            transform:  ctasIn ? 'translateY(0)' : 'translateY(16px)',
            transition: ctasIn ? 'opacity 0.9s ease, transform 0.9s ease' : 'none',
          }}
        >
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
        <div
          style={{
            opacity:    badgeIn ? 1 : 0,
            transition: badgeIn ? 'opacity 1s ease' : 'none',
          }}
        >
          <p className="font-body mb-[10px] text-kotta-cream/40 text-[10px] tracking-[0.35em] md:tracking-[0.45em] uppercase">
            Grand Opening · 21 Maret 2026
          </p>
        </div>

      </div>
    </section>
  )
}
