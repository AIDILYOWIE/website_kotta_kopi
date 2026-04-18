'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/* ── Testimonial data ────────────────────────────────────────────────────── */
const testimonials = [
  {
    text:   'Suasananya bikin betah banget! WiFi kencang, kopi enak, dan tempatnya aesthetic banget. Udah jadi tempat nongkrong favorit gue di Ponorogo.',
    name:   'Dinda Rahayu',
    role:   'Mahasiswi UNMUH Ponorogo',
    stars:  5,
    source: 'Google Maps',
  },
  {
    text:   'Sebagai remote worker, tempat ini jawaban banget. Koneksi internet super stabil, kursinya nyaman, dan barista-nya sangat profesional. Highly recommended!',
    name:   'Rizky Pratama',
    role:   'Product Designer',
    stars:  5,
    source: 'GoFood',
  },
  {
    text:   'Kopi Anak Kottanya beda banget dari kafe biasa. Ada kompleksitas rasa yang bikin penasaran. Akan balik lagi dan lagi!',
    name:   'Arief Santoso',
    role:   'Coffee Enthusiast',
    stars:  5,
    source: 'GrabFood',
  },
  {
    text:   'Akhirnya ada kafe yang beneran ngerti kopi specialty di Ponorogo. Dari sisi brew method sampai pemilihan bean-nya, semuanya top notch.',
    name:   'Sari Dewi',
    role:   'Food Blogger',
    stars:  5,
    source: 'Instagram',
  },
]

/* ── Header animation helpers (Gallery / Location pattern) ──────────────── */
const ease4 = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4)

function clipWord(headerP: number, offset: number): React.CSSProperties {
  return {
    display:    'inline-block',
    transform:  `translateY(${(1 - ease4(headerP - offset)) * 105}%)`,
    transition: 'transform 1s ease-out',
  }
}

function headerFadeUp(headerP: number, delayMs: number): React.CSSProperties {
  const visible = headerP > 0.1
  return {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'none' : 'translateY(20px)',
    transition: `opacity 0.65s ease-out ${delayMs}ms, transform 0.65s ease-out ${delayMs}ms`,
  }
}

/* ── Gold star ───────────────────────────────────────────────────────────── */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3" fill={filled ? '#D4A017' : 'none'} stroke="#D4A017" strokeWidth="1.2">
      <path d="M8 1.5l1.545 3.13 3.455.502-2.5 2.436.59 3.44L8 9.385 4.91 11.008l.59-3.44L3 5.132l3.455-.503L8 1.5z" />
    </svg>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function Testimonials() {
  const total = testimonials.length

  /* ── Carousel state ─────────────────────────────────────────────────── */
  const [current,   setCurrent]   = useState(0)
  const [phase,     setPhase]     = useState<'in' | 'out'>('in')
  const [animating, setAnimating] = useState(false)
  const [paused,    setPaused]    = useState(false)
  const [progress,  setProgress]  = useState(0)
  const touchStart                = useRef(0)
  const progressRef               = useRef<number>(0)
  const rafRef                    = useRef<number>(0)

  /* ── Header scroll animation ────────────────────────────────────────── */
  const headerRef             = useRef<HTMLDivElement>(null)
  const [headerP, setHeaderP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return
      const vh   = window.innerHeight
      const rect = headerRef.current.getBoundingClientRect()
      setHeaderP(Math.min(Math.max((vh - rect.top) / (vh * 0.65), 0), 1))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Navigate ───────────────────────────────────────────────────────── */
  const goTo = useCallback((next: number) => {
    if (animating) return
    setAnimating(true)
    setPhase('out')
    setTimeout(() => {
      setCurrent(((next % total) + total) % total)
      setPhase('in')
      setTimeout(() => setAnimating(false), 420)
    }, 280)
  }, [animating, total])

  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

  /* ── Auto-advance with gold progress bar ────────────────────────────── */
  useEffect(() => {
    setProgress(0)
    progressRef.current = 0
    cancelAnimationFrame(rafRef.current)
    if (paused) return

    const duration  = 4800
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const p       = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        goNext()
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, paused])

  /* ── Slide style ────────────────────────────────────────────────────── */
  const slideStyle: React.CSSProperties = {
    opacity:    phase === 'in' ? 1 : 0,
    transform:  phase === 'in' ? 'translateY(0)' : 'translateY(-14px)',
    transition: phase === 'in'
      ? 'opacity 0.42s ease, transform 0.42s ease'
      : 'opacity 0.28s ease, transform 0.28s ease',
  }

  const t = testimonials[current]
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section
      id="ulasan"
      className="bg-kotta-red overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-28 lg:pt-40 pb-20">
        <div ref={headerRef} className="text-center">
          <p
            className="section-label text-kotta-cream/50 tracking-[0.45em] mb-3"
            style={headerFadeUp(headerP, 0)}
          >
            Ulasan
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-kotta-cream leading-tight">
            {['Kata', 'Mereka,'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(headerP, i * 0.035)}>{word}</span>
              </span>
            ))}
            <br />
            {['Bukan', 'Kata', 'Kami'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom text-kotta-cream/55" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(headerP, 0.07 + i * 0.035)}>{word}</span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* ── Editorial slide ───────────────────────────────────────────── */}
      <div
        className="max-w-5xl mx-auto px-6 lg:px-12 pb-28 lg:pb-40"
        onTouchStart={e => { touchStart.current = e.changedTouches[0].clientX }}
        onTouchEnd={e => {
          const diff = touchStart.current - e.changedTouches[0].clientX
          if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
        }}
      >

        {/* Counter + rule */}
        <div className="flex items-center gap-6 mb-12">
          <div className="h-px flex-1 bg-kotta-cream/15" />
          <span className="font-body text-[10px] tracking-[0.45em] text-kotta-cream/35 uppercase tabular-nums">
            {pad(current + 1)} / {pad(total)}
          </span>
          <div className="h-px w-8 bg-kotta-cream/15" />
        </div>

        {/* Slide content */}
        <div className="relative" style={slideStyle}>

          {/* Enormous atmospheric quotation mark */}
          <div
            aria-hidden="true"
            className="absolute -top-10 -left-6 lg:-left-12 font-display leading-none pointer-events-none select-none"
            style={{
              fontSize:    'clamp(8rem, 20vw, 14rem)',
              color:       'rgba(251,244,242,0.055)',
              lineHeight:  1,
              userSelect:  'none',
            }}
          >
            ❝
          </div>

          {/* Quote text */}
          <blockquote className="relative font-display text-2xl md:text-3xl lg:text-[2.1rem] text-kotta-cream leading-[1.55] italic mb-12 lg:pr-12">
            {t.text}
          </blockquote>

          {/* Thin rule */}
          <div className="h-px w-full bg-kotta-cream/12 mb-8" />

          {/* Author row */}
          <div className="flex items-start justify-between gap-4 flex-wrap">

            {/* Left: stars + identity */}
            <div className="flex items-center gap-5">
              {/* Monogram */}
              <div
                className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ border: '1px solid rgba(251,244,242,0.18)' }}
              >
                <span className="font-display text-lg text-kotta-cream/80">{t.name[0]}</span>
              </div>

              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-1.5">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} filled={i < t.stars} />
                  ))}
                </div>
                <p className="section-label text-kotta-cream tracking-[0.3em] mb-0.5">{t.name}</p>
                <p className="font-body text-[11px] text-kotta-cream/45 tracking-wide">{t.role}</p>
              </div>
            </div>

            {/* Right: platform badge */}
            <div
              className="shrink-0 self-center font-body text-[9px] tracking-[0.35em] uppercase text-kotta-cream/35 px-3.5 py-1.5"
              style={{ border: '1px solid rgba(251,244,242,0.13)' }}
            >
              via {t.source}
            </div>
          </div>
        </div>

        {/* ── Gold progress bar ────────────────────────────────────── */}
        <div className="mt-12 mb-7 relative h-px" style={{ background: 'rgba(251,244,242,0.08)' }}>
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width:      `${progress * 100}%`,
              background: '#D4A017',
              transition: 'none',
            }}
          />
        </div>

        {/* ── Navigation ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between">

          {/* Prev */}
          <button
            onClick={goPrev}
            className="group flex items-center gap-3 font-body text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-kotta-cream/35 hover:text-kotta-cream/80 transition-colors duration-300"
          >
            <span
              className="block w-7 h-px bg-current transition-all duration-300 group-hover:w-10"
              style={{ transformOrigin: 'right' }}
            />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ulasan ${i + 1}`}
                className="block transition-all duration-300 hover:opacity-80"
                style={{
                  width:           i === current ? '28px' : '6px',
                  height:          '1.5px',
                  background:      i === current ? '#FBF4F2' : 'rgba(251,244,242,0.25)',
                  transition:      'width 0.35s ease, background 0.35s ease',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            className="group flex items-center gap-3 font-body text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-kotta-cream/35 hover:text-kotta-cream/80 transition-colors duration-300"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <span
              className="block w-7 h-px bg-current transition-all duration-300 group-hover:w-10"
              style={{ transformOrigin: 'left' }}
            />
          </button>

        </div>

      </div>
    </section>
  )
}
