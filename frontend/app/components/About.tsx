'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { number: '5', suffix: '+', label: 'Kota' },
  { number: '1', suffix: '+', label: 'Tahun' },
  { number: '1000', suffix: '+', label: 'Pelanggan' },
]

const qualities = [
  { n: '01', title: 'Specialty Coffee', body: 'Biji kopi pilihan dari petani lokal terbaik, diseduh dengan presisi.' },
  { n: '02', title: 'Ruang Aesthetic', body: 'Setiap sudut dirancang menjadi latar foto terbaik Anda.' },
  { n: '03', title: 'WiFi Kencang', body: 'Koneksi yang stabil untuk bekerja, belajar, dan berkreasi.' },
]

/* Cubic ease-out */
const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3)

/* easeOutQuart — fast start, smooth deceleration for counting feel */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

const STAT_TARGETS = [5, 1, 1000]
const COUNT_DURATION = 1800 // ms

export default function About() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const countStarted = useRef(false)
  const rafRef       = useRef<number>(0)

  const [progress,    setProgress]    = useState(0)
  const [rectTop,     setRectTop]     = useState(9999)
  const [counts,      setCounts]      = useState([0, 0, 0])
  const [countFired,  setCountFired]  = useState(false)

  /* ── Scroll tracker — also fires the count trigger ────────────────── */
  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return
      const rect        = wrapperRef.current.getBoundingClientRect()
      const vh          = window.innerHeight
      const totalScroll = wrapperRef.current.offsetHeight - vh
      const scrolled    = -rect.top
      const p           = Math.min(Math.max(scrolled / totalScroll, 0), 1)
      setProgress(p)
      setRectTop(rect.top)

      /* Fire count-up the moment Panel 2 starts becoming visible */
      if (!countStarted.current && ease((p - 0.66) / 0.34) > 0.02) {
        countStarted.current = true
        setCountFired(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Counter animation — runs to completion regardless of scroll ───── */
  useEffect(() => {
    if (!countFired) return

    const startTime = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / COUNT_DURATION, 1)
      const e = easeOutQuart(t)
      setCounts(STAT_TARGETS.map(target => Math.round(e * target)))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    /* No cleanup — intentionally let the loop finish even if user scrolls away */
  }, [countFired])

  /* ── Image entrance ────────────────────────────────────────────────────
     Starts fading in when the section's top edge crosses the bottom of
     the viewport (rectTop = vh) and is fully visible by the time the
     section top reaches the viewport top (rectTop = 0).
     After that it stays at full opacity for the rest of the section.    */
  const vh   = typeof window !== 'undefined' ? window.innerHeight : 900
  const imgE = ease((vh - rectTop) / vh)
  const imgStyle: React.CSSProperties = {
    opacity: imgE,
    transform: `translateX(${(1 - imgE) * -5}rem)`,
  }

  /* ── Panel 1 (Brand Story)
       Slides in from the RIGHT screen edge: progress  0.00 → 0.35
       Fades out:                            progress  0.52 → 0.64       */
  const c1In = ease(progress / 0.35)
  const c1Out = ease((progress - 0.52) / 0.12)
  const c1Opacity = c1In * (1 - c1Out)
  const c1Style: React.CSSProperties = {
    opacity: c1Opacity,
    transform: `translateX(${(1 - c1In) * 100}vw)`,
    pointerEvents: c1Opacity > 0.05 ? 'auto' : 'none',
  }

  /* ── Panel 2 (Stats + Qualities)
       Slides in from the RIGHT screen edge: progress  0.66 → 1.00       */
  const c2In = ease((progress - 0.66) / 0.34)
  const c2Style: React.CSSProperties = {
    opacity: c2In,
    transform: `translateX(${(1 - c2In) * 100}vw)`,
    pointerEvents: c2In > 0.05 ? 'auto' : 'none',
  }

  return (
    <>
      {/* ── Tall wrapper gives the sticky viewport its scroll runway ──── */}
      <div ref={wrapperRef} id="tentang" style={{ minHeight: '200vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden bg-kotta-cream flex">

          {/* ── Mobile background image (Option B: frosted panel) ──────────
              Full-bleed image sits at z-0 behind the sliding panels.
              Visible only on mobile/tablet — lg+ uses the side column.      */}
          <div className="lg:hidden absolute inset-0 z-0" aria-hidden="true">
            <img
              src="/images/about_image.png"
              alt=""
              className="w-full h-full object-cover object-center"
            />
            {/* Warm dark vignette — softens the photo so the cream overlay
                reads as warm rather than clinical                            */}
            <div className="absolute inset-0 bg-kotta-black/20" />
          </div>

          {/* ── Sliding content panels ─────────────────────────────────── */}
          <div className="w-full lg:w-[55%] h-full flex-shrink-0 relative z-10">

            {/* Panel 1 — Brand Story
                Mobile: panels carry their own frosted-cream background so
                the image shows through the translucent wash.
                Desktop: bg transparent, image lives in the right column.    */}
            <div
              className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-20
                         bg-kotta-cream/85 lg:bg-transparent
                         backdrop-blur-[3px] lg:backdrop-blur-none"
              style={c1Style}
            >
              <p className="section-label text-kotta-red mb-5 tracking-[0.45em]">Cerita Kami</p>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.05] mb-7 text-kotta-black text-balance">
                Bukan Sekadar Kopi.
                <br />
                <em className="not-italic text-kotta-red">Ini Gaya Hidup.</em>
              </h2>

              <div className="h-px w-12 bg-kotta-black/15 mb-7" />

              <p className="text-kotta-black/60 leading-relaxed text-sm lg:text-base mb-4">
                Kotta Kopi lahir dari semangat generasi kota — mereka yang percaya bahwa
                secangkir kopi bukan sekadar minuman, melainkan pengalaman. Kami membawa
                jiwa untuk semua kota: ruang yang terbuka, atmosfer yang hangat,
                dan kopi yang benar-benar berkualitas.
              </p>

              <blockquote className="pl-6 border-l-2 border-kotta-red/40">
                <p className="font-display text-lg lg:text-xl text-kotta-black/60 italic leading-relaxed">
                 Selamat datang di keluarga Kotta Kopi.
                </p>
              </blockquote>
            </div>

            {/* Panel 2 — Stats + Qualities */}
            <div
              className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-20
                         bg-kotta-cream/85 lg:bg-transparent
                         backdrop-blur-[3px] lg:backdrop-blur-none"
              style={c2Style}
            >
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-10 pb-10 border-b border-kotta-black/8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="font-display text-4xl lg:text-5xl xl:text-6xl text-kotta-black leading-none">
                      {counts[i]}
                      <span className="text-2xl lg:text-3xl">{s.suffix}</span>
                    </p>
                    <p className="section-label text-kotta-black/35 mt-3 tracking-[0.3em]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Qualities */}
              <div className="space-y-7">
                {qualities.map((q, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="font-display text-3xl text-kotta-black/20 leading-none shrink-0">
                      {q.n}
                    </span>
                    <div>
                      <p className="font-body font-semibold text-kotta-red text-sm tracking-wide mb-1">
                        {q.title}
                      </p>
                      <p className="text-kotta-black/50 text-sm leading-relaxed">{q.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Desktop image — right column, lg+ only ─────────────────── */}
          <div
            className="hidden lg:block lg:w-[45%] h-[90%] flex-shrink-0 mt-20"
            style={imgStyle}
          >
            <img
              src="/images/about_image.png"
              alt="Suasana Kotta Kopi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Marquee banner — sits below the sticky section ─────────────── */}
      <div className="bg-kotta-cream border-y border-kotta-black/8 py-5 overflow-hidden select-none">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-16 shrink-0">
              <span className="font-display text-lg text-kotta-black/15 tracking-[0.3em]">KOPINYA ANAK KOTA</span>
              <span className="text-kotta-red/30 text-sm">✦</span>
              <span className="font-display text-lg text-kotta-black/15 tracking-[0.3em]">KOTTA KOPI PONOROGO</span>
              <span className="text-kotta-red/30 text-sm">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
