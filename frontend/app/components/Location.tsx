'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin } from 'lucide-react'

/* ── Branch data ─────────────────────────────────────────────────────────── */
const branches = [
  {
    id:       'ponorogo',
    city:     'Ponorogo',
    address:  ['Jl. [Nama Jalan No. XX]', 'Ponorogo, Jawa Timur 63411'],
    mapQuery: 'Ponorogo,Jawa+Timur',
    wa:       'https://wa.me/6281234567890?text=Halo%20Kotta%20Kopi%20Ponorogo%2C%20saya%20ingin%20bertanya...',
    map:      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.4474018211363!2d111.4739659!3d-7.848154199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e799f35d3ade2e3%3A0x4b05d881f4049ff!2sKotta%20Kopi%20Ponorogo!5e0!3m2!1sid!2sid!4v1776166040266!5m2!1sid!2sid',
  },
  {
    id:       'bali',
    city:     'Bali',
    address:  ['Jl. Sempol No.58, Pererenan', 'Kec. Mengwi, Kab. Badung, Bali'],
    mapQuery: 'Jl.+Sempol+No.58+Pererenan+Mengwi+Badung+Bali',
    wa:       'https://wa.me/6281234567890?text=Halo%20Kotta%20Kopi%20Bali%2C%20saya%20ingin%20bertanya...',
    map:      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.581281225421!2d115.1364229743722!3d-8.636133591410369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2391e9c389dc9%3A0x356b866fa20f1ba7!2sKotta%20Kopi%20Prive%20Pererenan!5e0!3m2!1sid!2sid!4v1776166412818!5m2!1sid!2sid',
  },
] as const

/* ── Opening hours — identical for both branches (WIB) ──────────────────── */
const hoursMap: Record<number, { open: number; close: number; label: string }> = {
  0: { open: 7,  close: 23, label: 'Minggu' },
  1: { open: 8,  close: 22, label: 'Senin'  },
  2: { open: 8,  close: 22, label: 'Selasa' },
  3: { open: 8,  close: 22, label: 'Rabu'   },
  4: { open: 8,  close: 22, label: 'Kamis'  },
  5: { open: 8,  close: 22, label: 'Jumat'  },
  6: { open: 7,  close: 23, label: 'Sabtu'  },
}

const HOURS_ROWS = [
  { days: 'Senin – Jumat',  time: '08.00 – 22.00' },
  { days: 'Sabtu – Minggu', time: '07.00 – 23.00' },
]

function getWIBStatus(): { isOpen: boolean; text: string } {
  const now = new Date()
  const wib = new Date(now.getTime() + 7 * 3600 * 1000)
  const day = wib.getUTCDay()
  const h   = wib.getUTCHours()
  const { open, close } = hoursMap[day]
  if (h >= open && h < close) return { isOpen: true, text: 'Buka Sekarang' }
  const next = (day + 1) % 7
  return { isOpen: false, text: `Tutup · Buka ${hoursMap[next].label} pukul ${hoursMap[next].open}.00` }
}

/* ── Ease ────────────────────────────────────────────────────────────────── */
const ease4 = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4)

/* ── Header animations (Gallery pattern) ────────────────────────────────── */
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
    transform:  visible ? 'none' : 'translateY(18px)',
    transition: `opacity 0.65s ease-out ${delayMs}ms, transform 0.65s ease-out ${delayMs}ms`,
  }
}

/* ── Scroll-driven content animations ───────────────────────────────────────
   rawP = −wrapperTop / (vh × 1.5)  ·  400 vh wrapper → rawP max = 2.0
   tl_position ≡ rawP (both share the same numeric scale).

   TRANSITION = 1.00 — the rawP value at which branches switch.
   Per-branch offsets are derived from index i:

     enterOffset = i === 0 ? −2 (immediate) : TRANSITION × i
     exitOffset  = i < last  ? TRANSITION × (i+1)  : 99 (no exit)

   MAP (Gallery stack): branch[0] sits on top (z = N − i), GSAP scales it 1→0
   at tl pos 1.00→1.30, revealing branch[1] underneath.                       */

const TRANSITION = 1.00

/** text/badge — enters & exits sliding horizontally */
function slideLeft(rawP: number, enter: number, exit: number): React.CSSProperties {
  const eIn  = ease4(rawP - enter)
  const eOut = ease4(rawP - exit)
  return {
    opacity:    Math.max(0, eIn - eOut),
    transform:  `translateX(${(1 - eIn) * -56 - eOut * 56}px)`,
    filter:     `blur(${Math.max(0, (1 - eIn) * 6 + eOut * 4)}px)`,
    willChange: 'transform, opacity, filter',
    transition: 'opacity 0.9s ease-out, transform 0.9s ease-out, filter 0.9s ease-out',
  }
}

/** buttons — enters rising from below, exits sinking down */
function slideUp(rawP: number, enter: number, exit: number): React.CSSProperties {
  const eIn  = ease4(rawP - enter)
  const eOut = ease4(rawP - exit)
  return {
    opacity:    Math.max(0, eIn - eOut),
    transform:  `translateY(${(1 - eIn) * 40 + eOut * 40}px)`,
    willChange: 'transform, opacity',
    transition: 'opacity 0.9s ease-out, transform 0.9s ease-out',
  }
}

/* ── StatusBadge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: { isOpen: boolean; text: string } }) {
  return (
    <div className={`
      inline-flex items-center gap-3 px-5 py-2.5 border rounded-full w-max
      ${status.isOpen
        ? 'border-green-500/30 bg-green-50 text-green-800'
        : 'border-kotta-gray/30 bg-kotta-black/5 text-kotta-gray'}
    `}>
      <span className={`block w-2 h-2 rounded-full ${status.isOpen ? 'bg-green-500 animate-pulse' : 'bg-kotta-gray'}`} />
      <span className="font-body text-sm tracking-wide">{status.text}</span>
    </div>
  )
}

/* ── WhatsApp icon ───────────────────────────────────────────────────────── */
function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function Location() {
  const [status,     setStatus]     = useState<{ isOpen: boolean; text: string } | null>(null)
  const headerRef                   = useRef<HTMLDivElement>(null)
  const [headerP,    setHeaderP]    = useState(0)
  const wrapperRef                  = useRef<HTMLDivElement>(null)
  const [wrapperTop, setWrapperTop] = useState(9999)

  /* mapRefs[i] mirrors branches[i].
     Branch 0 (Ponorogo) has the highest z-index — GSAP scales it to 0,
     revealing branch 1 (Bali) underneath. Same as Gallery photo stack.   */
  const mapRefs = useRef<(HTMLDivElement | null)[]>(branches.map(() => null))

  useEffect(() => {
    setStatus(getWIBStatus())
    const id = setInterval(() => setStatus(getWIBStatus()), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        setHeaderP(Math.min(Math.max((vh - rect.top) / (vh * 0.65), 0), 1))
      }
      if (wrapperRef.current) {
        setWrapperTop(wrapperRef.current.getBoundingClientRect().top)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* GSAP — scale branch[0] map 1→0 at tl pos 1.00→1.30, revealing branch[1] */
  useEffect(() => {
    const map0 = mapRefs.current[0]
    if (!wrapperRef.current || !map0) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start:   'top top',
          end:     'bottom bottom',  /* 400 vh − 100 vh = 300 vh scrub range */
          scrub:   0.8,
        },
      })
      /* Branch[0] top-layer scales away, identical to Gallery photo stack */
      tl.fromTo(map0, { scale: 1 }, { scale: 0, ease: 'none', duration: 0.30 }, TRANSITION)
      /* Anchor timeline to duration 2.0 so tl_position ≡ rawP throughout  */
      tl.to({}, { duration: 0 }, 2.00)
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  const vh   = typeof window !== 'undefined' ? window.innerHeight : 900
  const rawP = Math.max(-wrapperTop / (vh * 1.5), 0)
  const N    = branches.length

  /* Per-branch animation offsets derived from index */
  const enterOffset = (i: number) => i === 0 ? -2 : TRANSITION * i
  const exitOffset  = (i: number) => i < N - 1 ? TRANSITION * (i + 1) : 99
  /* Branch is interactive when rawP is within its active window ±0.15     */
  const isInteractive = (i: number) =>
    rawP >= TRANSITION * i - 0.15 && (i === N - 1 || rawP <= TRANSITION * (i + 1) + 0.15)

  return (
    <section id="lokasi" className="bg-kotta-cream">

      {/* ── HEADER — normal flow, above the scroll runway ─────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 lg:pt-40 pb-16">
        <div ref={headerRef} className="text-center">
          <p
            className="section-label text-kotta-red tracking-[0.45em] mb-4"
            style={headerFadeUp(headerP, 0)}
          >
            Temukan Kami
          </p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-kotta-black leading-tight">
            {['Kami', 'Ada', 'di', 'Sini,'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(headerP, i * 0.035)}>{word}</span>
              </span>
            ))}
            <br />
            <span className="inline-block overflow-hidden align-bottom">
              <span className="text-kotta-red" style={clipWord(headerP, 0.14)}>Menunggumu</span>
            </span>
          </h2>
        </div>
      </div>

      {/* ── CONTENT SCROLL RUNWAY — 400 vh ────────────────────────────────
          Scroll distance = 300 vh → rawP max = 2.0
          TRANSITION at rawP = 1.00: branch[0] exits, branch[1] enters       */}
      <div ref={wrapperRef} style={{ height: '400vh' }}>

        <div className="sticky top-0 h-screen overflow-hidden flex items-start lg:items-center bg-kotta-cream">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12
                          pt-24 pb-3 lg:py-0
                          grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-20 items-center">

            {/* ── Map — order-1 on mobile (top), order-2 on desktop (right) ── */}
            <div className="relative order-1 lg:order-2">
              <div className="relative w-full h-[145px] sm:h-[220px] lg:h-[420px]
                              rounded-2xl lg:rounded-none overflow-hidden">
                {branches.map((branch, i) => (
                  <div
                    key={branch.id}
                    ref={el => { mapRefs.current[i] = el }}
                    className="absolute inset-0"
                    style={{
                      zIndex:     N - i,
                      willChange: i === 0 ? 'transform' : undefined,
                    }}
                  >
                    <iframe
                      src={branch.map}
                      className="absolute inset-0 w-full h-full"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Lokasi Kotta Kopi ${branch.city}`}
                    />
                  </div>
                ))}
              </div>

              {/* Branch indicator pills — mobile only, below the map */}
              <div className="flex items-center gap-2 mt-4 lg:hidden">
                {branches.map((b, i) => {
                  const active = (rawP >= TRANSITION ? 1 : 0) === i
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="h-[2px] rounded-full transition-all duration-500"
                        style={{
                          width:      active ? '20px' : '6px',
                          background: active ? 'var(--kotta-red)' : 'rgba(13,13,13,0.18)',
                        }}
                      />
                      <span
                        className="font-body text-[9px] tracking-[0.3em] uppercase transition-all duration-500"
                        style={{ color: active ? 'var(--kotta-red)' : 'rgba(13,13,13,0.3)' }}
                      >
                        {b.city}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Decorative border — desktop only */}
              <div className="hidden lg:block absolute -bottom-3 -right-3 w-full h-full border border-kotta-red/20 pointer-events-none" />
            </div>

            {/* ── Content panels — order-2 on mobile (below map), order-1 on desktop ── */}
            <div className="relative order-2 lg:order-1" style={{ minHeight: 'clamp(260px, calc(100vh - 400px), 420px)' }}>
              {branches.map((branch, i) => (
                <div
                  key={branch.id}
                  className="absolute inset-0 flex flex-col"
                  style={{ pointerEvents: isInteractive(i) ? 'auto' : 'none' }}
                >
                  {/* Text group — slides left */}
                  <div className="flex flex-col gap-2 sm:gap-4" style={slideLeft(rawP, enterOffset(i), exitOffset(i))}>

                    {/* City name + status — prominent header for this branch */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl md:text-3xl text-kotta-black leading-none">
                        Kotta Kopi {branch.city}
                      </h3>
                      {status && <StatusBadge status={status} />}
                    </div>

                    <div>
                      <p className="section-label text-kotta-gray tracking-[0.35em] mb-2">Alamat</p>
                      <p className="font-display text-lg md:text-xl text-kotta-black leading-snug">
                        {branch.address[0]}<br />{branch.address[1]}
                      </p>
                    </div>

                    <div className="h-px w-full bg-kotta-black/10" />

                    <div>
                      <p className="section-label text-kotta-gray tracking-[0.35em] mb-3">Jam Operasional</p>
                      <div className="space-y-2">
                        {HOURS_ROWS.map((row, j) => (
                          <div key={j} className="flex items-center justify-between gap-4">
                            <span className="font-body text-sm text-kotta-black/70">{row.days}</span>
                            <span className="font-body text-sm font-semibold text-kotta-black">{row.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px w-full bg-kotta-black/10" />
                  </div>

                  {/* Buttons — in normal flow (no absolute positioning) */}
                  <div
                    className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-6"
                    style={slideUp(rawP, enterOffset(i), exitOffset(i))}
                  >
                    <a
                      href={`https://maps.google.com/?q=${branch.mapQuery}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-primary !py-2.5 sm:!py-4 text-sm"
                    >
                      <MapPin width={16} height={16} />
                      Google Maps
                    </a>
                    <a
                      href={branch.wa}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-outline-dark !py-2.5 sm:!py-4 text-sm"
                    >
                      <WhatsAppIcon />
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
