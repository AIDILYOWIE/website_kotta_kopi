'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, Box, Star } from 'lucide-react'

/* ─── power4.out — fast start, long graceful tail ───────────────────────── */
const ease4 = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4)

/* ─── diamondrosesanctuary.com "preserved land" reveal ─────────────────────
   opacity 0→1 · translateY(35% own height)→0 · blur 10px→0
   1 s CSS transition lets each scroll-driven step play out visibly.
   offset = rawP value at which this element begins revealing.              */
function reveal(rawP: number, offset = 0): React.CSSProperties {
  const e = ease4(rawP - offset)
  return {
    opacity:    e,
    transform:  `translateY(${(1 - e) * 35}%)`,
    filter:     `blur(${(1 - e) * 10}px)`,
    willChange: 'transform, opacity, filter',
    transition: 'opacity 1s ease-out, transform 1s ease-out, filter 1s ease-out',
  }
}

/* ─── clip-reveal for individual h2 words (translateY only, no blur) ──────── */
function clipWord(rawP: number, offset = 0): React.CSSProperties {
  const e = ease4(rawP - offset)
  return {
    display:    'inline-block',
    transform:  `translateY(${(1 - e) * 105}%)`,
    transition: 'transform 1s ease-out',
  }
}

const badges = [
  { icon: Zap,  text: 'Est. 15–25 mnt'   },
  { icon: Box,  text: 'Delivery & Pickup' },
  { icon: Star, text: 'Rating 4.8+'       },
]

export default function OrderBand() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const [wrapperTop, setWrapperTop] = useState(9999)

  /* ── GSAP parallax — trigger is the tall wrapper so it fires across the
     full sticky duration, not just when the section enters/exits.          */
  useEffect(() => {
    if (!wrapperRef.current || !bgRef.current) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current, { yPercent: -15 }, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   0.8,
        },
      })
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  /* ── Scroll tracker — watches the wrapper's top edge ────────────────────
     rawP = 0  when wrapper top hits viewport top (sticky just activated)
     rawP grows as user scrolls through the runway
     rawP ≈ 1.6 when last animation + CSS transition have completed        */
  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return
      setWrapperTop(wrapperRef.current.getBoundingClientRect().top)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vh   = typeof window !== 'undefined' ? window.innerHeight : 900
  /* Divide by (vh * 1.8) so that across the 300 vh of scroll runway
     rawP climbs to ~1.67 — well past every offset + transition buffer.   */
  const rawP = Math.max(-wrapperTop / (vh * 1.8), 0)

  /* ── Reveal offsets ─────────────────────────────────────────────────────
     Group 1 (simultaneous): eyebrow · heading · description  → 0.00
     Group 2 (badges, staggered)                              → 0.35–0.49
     Group 3 (CTA buttons, staggered)                         → 0.62–0.69
     Group 4 (walk-in ornament)                               → 0.80       */

  return (
    /* ── Tall wrapper provides the scroll runway ───────────────────────── */
    <div ref={wrapperRef} style={{ minHeight: '400vh' }}>

      {/* ── Sticky viewport — pins while user scrolls the runway ────────── */}
      <section  
        id="pesan"
        className="sticky top-0 h-screen bg-kotta-red overflow-hidden
                   flex items-center justify-center"
      >

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-12 text-center mt-20  ">

          {/* ── Group 1 — all offset 0.00: eyebrow · heading · description ── */}
          <p
            className="section-label text-kotta-cream/60 tracking-[0.45em] mb-6"
            style={reveal(rawP, 0)}
          >
            Pesan Sekarang
          </p>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-kotta-cream leading-tight">
            {(['Kotta', 'Kopi', 'Siap'] as const).map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(rawP, i * 0.035)}>{word}</span>
              </span>
            ))}
          </h2>
          <h2 className="mt-[10px] font-display text-kotta-cream/60 text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
            {(['Diantar', 'ke', 'Pintumu'] as const).map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(rawP, 0.10 + i * 0.035)}>{word}</span>
              </span>
            ))}
          </h2>

          <p
            className="text-kotta-cream/65 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
            style={reveal(rawP, 0)}
          >
            Tidak sempat mampir? Kami tetap ada untuk kamu — diantar dalam 15–25 menit.
          </p>

          {/* ── Group 2 — badges, 0.07 stagger each ────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-14">
            {badges.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-kotta-cream/80"
                style={reveal(rawP, 0.35 + i * 0.07)}
              >
                <b.icon width={24} height={24} />
                <span className="font-body text-sm tracking-wide">{b.text}</span>
              </div>
            ))}
          </div>

          {/* ── Group 3 — CTA buttons, staggered ───────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <a
              href="https://gofood.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-kotta-cream text-kotta-black
                         px-8 py-4 font-body font-semibold text-sm tracking-wide rounded-[18px]
                         transition-colors duration-300 hover:bg-kotta-black hover:text-kotta-cream
                         w-full sm:w-auto sm:min-w-[220px] justify-center"
              style={reveal(rawP, 0.62)}
            >
              <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="#00AA13">
                <path d="M12.072.713a15.38 15.38 0 0 0-.643.011C5.317.998.344 5.835.017 11.818c-.266 4.913 2.548 9.21 6.723 11.204 1.557.744 3.405-.19 3.706-1.861.203-1.126-.382-2.241-1.429-2.742-2.373-1.139-3.966-3.602-3.778-6.406.22-3.28 2.931-5.945 6.279-6.171 3.959-.267 7.257 2.797 7.257 6.619 0 2.623-1.553 4.888-3.809 5.965a2.511 2.511 0 0 0-1.395 2.706l.011.056c.295 1.644 2.111 2.578 3.643 1.852C21.233 21.139 24 17.117 24 12.461 23.996 5.995 18.664.749 12.072.711v.002Zm-.061 7.614c-2.331 0-4.225 1.856-4.225 4.139 0 2.282 1.894 4.137 4.225 4.137 2.33 0 4.225-1.855 4.225-4.137 0-2.283-1.895-4.139-4.225-4.139Z" />
              </svg>
              Pesan via GoFood
            </a>

            <a
              href="https://food.grab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-kotta-cream/40 text-kotta-cream
                         px-8 py-4 font-body font-semibold text-sm tracking-wide rounded-[18px]
                         transition-colors duration-300 hover:bg-kotta-cream hover:text-kotta-black hover:border-kotta-cream
                         w-full sm:w-auto sm:min-w-[220px] justify-center"
              style={reveal(rawP, 0.69)}
            >
              <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="#00B14F">
                <path d="M23.129 10.863a2.927 2.927 0 00-2.079-.872c-.57 0-1.141.212-1.455.421-.651.434-1.186.904-2.149 2.148v.894c.817-1.064 1.59-1.903 2.177-2.364.386-.31.933-.501 1.427-.501 1.275 0 2.352 1.077 2.352 2.352v.538c0 .63-.247 1.223-.698 1.668a2.341 2.341 0 01-1.654.685c-1.048 0-1.97-.719-2.22-1.701l-.422.51c.307 1.03 1.417 1.789 2.642 1.789.778 0 1.516-.31 2.079-.872.562-.562.871-1.3.871-2.079v-.538c0-.778-.31-1.517-.871-2.078m-12.8-.274c.406 0 .757.087 1.074.266.149-.186.299-.337.411-.449-.335-.256-.903-.415-1.485-.415-.83 0-1.584.3-2.122.843-.534.54-.83 1.287-.83 2.107v3.489h.598V12.94c0-1.385.968-2.352 2.354-2.352m5.678 5.84v-3.488c0-1.072-.84-1.913-1.913-1.913-.5 0-.976.203-1.343.57a1.895 1.895 0 00-.57 1.343v.538c0 1.037.877 1.913 1.913 1.913.285 0 .671-.07.908-.264v-.631c-.232.187-.57.298-.908.298a1.302 1.302 0 01-1.315-1.316v-.538a1.3 1.3 0 011.315-1.314 1.3 1.3 0 011.316 1.314v3.489zM0 12.596v.193c0 1.036.393 2.003 1.107 2.722a3.759 3.759 0 002.689 1.112c.82 0 1.548-.186 2.162-.551.506-.302.73-.607.75-.635V12.22H3.65v.597H6.11v2.434l-.002.002c-.288.288-.972.77-2.312.77a3.165 3.165 0 01-2.279-.938 3.247 3.247 0 01-.92-2.297v-.193c0-.83.375-1.656 1.026-2.269a3.558 3.558 0 012.442-.967c.847 0 1.438.129 1.913.416v-.67c-.494-.21-1.085-.305-1.913-.305C1.862 8.8 0 10.538 0 12.595m10.329-.968c.226 0 .419.037.571.112.075-.186.151-.339.262-.525-.162-.116-.549-.186-.833-.186-1.09 0-1.913.823-1.913 1.913v3.489h.598V12.94c0-.774.54-1.314 1.315-1.314m-4.351-.702v-.707c-.541-.29-1.131-.419-1.913-.419-.799 0-1.555.293-2.132.824-.577.532-.895 1.233-.895 1.972v.193c0 1.542 1.237 2.796 2.758 2.796 1.237 0 1.745-.405 1.874-.533v-1.794H3.65v.598h1.46v.899l-.005.001c-.187.075-.578.231-1.31.231-.58 0-1.122-.225-1.528-.636a2.203 2.203 0 01-.632-1.562v-.193c0-1.192 1.113-2.198 2.43-2.198.91 0 1.45.147 1.913.528m14.105 1.126c.27-.27.623-.424.967-.424.737 0 1.315.577 1.315 1.314v.538c0 .738-.578 1.316-1.315 1.316-.357 0-.702-.196-.972-.55a2.151 2.151 0 01-.418-1.12l-.484.591c.095.452.33.885.665 1.19.344.313.774.486 1.209.486a1.915 1.915 0 001.913-1.913v-.538c0-.499-.202-.977-.57-1.343a1.896 1.896 0 00-1.343-.57c-.316 0-.818.114-1.417.652l-.002.002c-.16.16-.536.536-.765.804-.384.42-.943 1.054-1.42 1.688v.933c.529-.68.833-1.06 1.33-1.634.445-.519.996-1.15 1.307-1.422m-8.939 1.428c0 .779.31 1.517.872 2.08a2.93 2.93 0 002.078.87c.33 0 .669-.07.908-.188v-.597c-.28.117-.618.188-.908.188-1.274 0-2.352-1.077-2.352-2.353v-.538c0-1.275 1.078-2.352 2.352-2.352a2.34 2.34 0 012.353 2.353v3.488h.598v-3.604a2.979 2.979 0 00-.915-2.006 2.92 2.92 0 00-2.036-.83c-.778 0-1.516.31-2.078.873a2.926 2.926 0 00-.872 2.078zm6.918-2.313c.183-.22.372-.443.596-.631V7.378h-.596zm1.037-.876V7.378h.597V9.88a3.601 3.601 0 00-.597.41" />
              </svg>
              Pesan via GrabFood
            </a>
          </div>

          {/* ── Group 4 — walk-in ornament ──────────────────────────────── */}
          <div
            className="mt-16 flex items-center justify-center gap-6"
            style={reveal(rawP, 0.80)}
          >
            <div className="h-px w-16 bg-kotta-cream/20" />
            <p className="section-label text-kotta-cream/30 tracking-[0.3em]">Juga tersedia Walk-in</p>
            <div className="h-px w-16 bg-kotta-cream/20" />
          </div>

        </div>
      </section>
    </div>
  )
}
