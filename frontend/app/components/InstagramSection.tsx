'use client'

import { useEffect, useRef, useState } from 'react'

/* ── TypeScript: tell the compiler about Instagram's global ──────────────── */
declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } }
  }
}

/* ── Animation helpers ───────────────────────────────────────────────────── */
/* Cubic ease-out — grid/card progress (matches MenuHighlights) */
const ease  = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3)
/* Power4 ease-out — header word reveal */
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

// content

/* ── Post permalinks ─────────────────────────────────────────────────────────
   Replace slots 2–6 with real post URLs when available.
   Instagram's embed.js accepts any public post URL — single photo and
   carousels are both handled automatically by the same renderer.             */
const posts = [
  'https://www.instagram.com/p/DW3Nq1lkocv/', /* ← real post */
  'https://www.instagram.com/p/DOYzWnBk8jV/', /* TODO: replace */
  'https://www.instagram.com/p/DNM2VNeR3l0/', /* TODO: replace */
  'https://www.instagram.com/p/DOgEGeMjz7w/', /* TODO: replace */
  'https://www.instagram.com/p/DWdfqr9Dxi7/', /* TODO: replace */
  'https://www.instagram.com/p/DWam3rpCSGu/', /* TODO: replace */
]

export default function InstagramSection() {

  /* ── Header scroll animation ────────────────────────────────────────────── */
  const headerRef             = useRef<HTMLDivElement>(null)
  const [headerP, setHeaderP] = useState(0)

  /* ── Grid scroll animation (MenuHighlights pattern) ─────────────────────── */
  const gridRef                       = useRef<HTMLDivElement>(null)
  const [gridRectTop, setGridRectTop] = useState(9999)

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        setHeaderP(Math.min(Math.max((vh - rect.top) / (vh * 0.65), 0), 1))
      }
      if (gridRef.current) {
        setGridRectTop(gridRef.current.getBoundingClientRect().top)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vh    = typeof window !== 'undefined' ? window.innerHeight : 900
  const gridE = ease((vh - gridRectTop) / (vh * 0.55))

  /* ── Instagram embed script ─────────────────────────────────────────────── */
  useEffect(() => {
    const SCRIPT_ID = 'instagram-embed-js'

    if (!document.getElementById(SCRIPT_ID)) {
      /* First load — append the script; process() is called in onload */
      const s    = document.createElement('script')
      s.id       = SCRIPT_ID
      s.src      = '//www.instagram.com/embed.js'
      s.async    = true
      s.onload   = () => window.instgrm?.Embeds.process()
      document.body.appendChild(s)
    } else {
      /* Script already present (e.g. hot-reload) — re-scan the page */
      window.instgrm?.Embeds.process()
    }
  }, [])

  return (
    <section className="bg-kotta-cream py-28 lg:py-40 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 ">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div ref={headerRef} className="text-center mb-16">

          {/* Eyebrow */}
          <p
            className="section-label text-kotta-red/60 tracking-[0.45em] mb-4"
            style={headerFadeUp(headerP, 0)}
          >
            Instagram
          </p>

          {/* Heading — clip-reveal per word */}
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-kotta-black leading-tight mb-6">
            {['Jadilah', 'Bagian', 'dari'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(headerP, i * 0.035)}>{word}</span>
              </span>
            ))}
            <br />
            {['Komunitas', 'Anak'].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom text-kotta-red" style={{ marginRight: '0.28em' }}>
                <span style={clipWord(headerP, 0.10 + i * 0.035)}>{word}</span>
              </span>
            ))}
            {' '}
            <span className="inline-block overflow-hidden align-bottom text-kotta-red">
              <span style={{ ...clipWord(headerP, 0.17), letterSpacing: '0.15em' }}>KOTTA</span>
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="text-kotta-black/60 text-base max-w-lg mx-auto leading-relaxed mb-4"
            style={headerFadeUp(headerP, 300)}
          >
            Bagikan momen ngopimu, tag{' '}
            <span className="font-semibold text-kotta-red">@kottakopi</span>{' '}
            — siapa tahu kami repost!
          </p>
          <p
            className="section-label text-kotta-black/40 tracking-[0.2em]"
            style={headerFadeUp(headerP, 500)}
          >
            #KottaKopi &nbsp;·&nbsp; #KopiAnakKota
          </p>

        </div>

        {/* ── Instagram embed grid ─────────────────────────────────────────
            Each <blockquote> is replaced in-place by Instagram's renderer
            into a full interactive iframe (supports carousels natively).
            grid-cols-1 on mobile, 2 on sm, 3 on lg keeps cells wide enough
            for the embed's 326 px minimum width to fit comfortably.         */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {posts.map((permalink, i) => (
            /*  Fixed height + overflow:hidden enforces uniform card size.
                The white overlay at the bottom covers the action bar and
                like count — it blends with the iframe's own white bg so
                the crop looks clean and intentional.

                560 px = header (~65 px) + square image (~380–400 px) +
                         buffer for the overlay to start above the image. */
            <div
              key={i}
              className="w-full overflow-hidden relative"
              style={{
                height:     '430px',
                minWidth:   0,
                opacity:    gridE,
                transition: `opacity 0.4s ease ${i * 0.06}s`,
              }}
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`${permalink}?utm_source=ig_embed&utm_campaign=loading`}
                data-instgrm-version="14"
                style={{
                  background: 'transparent',
                  border:     0,
                  margin:     0,
                  maxWidth:   '100%',
                  minWidth:   0,
                  padding:    0,
                  width:      '100%',
                }}
              />

              {/* White overlay — hides the action icons row + like count.
                  Blends with Instagram's iframe white background seamlessly.
                  130 px covers: like btn row (~48 px) + like count (~20 px)
                  + caption start (~62 px buffer). pointer-events:none keeps
                  the visible card area (header + image) fully interactive.  */}
              {/* <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height: '130px', background: '#ffffff', zIndex: 10 }}
              /> */}
            </div>
          ))}
        </div>

        {/* ── Follow CTA ──────────────────────────────────────────────── */}
        <div className="flex justify-center">
        <a
          href="https://instagram.com/kottakopi"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-dark !w-max whitespace-nowrap !tracking-[0.15em]"
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Follow @kottakopi
        </a>
        </div>

      </div>
    </section>
  )
}
