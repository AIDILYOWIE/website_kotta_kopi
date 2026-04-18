'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import logo from '../../public/images/logo/logo.jpg'

const links = [
  { label: 'Tentang Kami', href: '#tentang' },
  { label: 'Menu',         href: '#menu'    },
  { label: 'Galeri',       href: '#galeri'  },
  { label: 'Lokasi',       href: '#lokasi'  },
  { label: 'Ulasan',       href: '#ulasan'  },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [inGallery, setInGallery] = useState(false)
  /* true once the hero section has scrolled fully out of the viewport */
  const [pastHero,  setPastHero]  = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)

      /* Hero visibility — navbar hidden while #beranda is still on screen */
      const hero = document.getElementById('beranda')
      if (hero) {
        /* rect.bottom ≤ 0 means the hero's bottom edge is above the viewport */
        setPastHero(hero.getBoundingClientRect().bottom <= 0)
      } else {
        /* No hero on this page — always show navbar */
        setPastHero(true)
      }

      const wrapper = document.getElementById('galeri-wrapper')
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect()
        const vh   = window.innerHeight
        setInGallery(rect.top <= 0 && rect.bottom >= vh)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile menu on route change / link click */
  const close = () => setMenuOpen(false)

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const filled = scrolled || menuOpen

  return (
    <>
      {/* Outer header: fixed, with padding to float pill away from edges */}
      <header
        className="fixed inset-x-0 top-0 z-50 px-4 lg:px-8 pt-4 transition-all duration-500"
        style={{
          opacity:       (!pastHero || inGallery) ? 0 : 1,
          transform:     (!pastHero || inGallery) ? 'translateY(-100%)' : 'translateY(0)',
          pointerEvents: (!pastHero || inGallery) ? 'none' : undefined,
        }}
      >

        {/* Inner pill: rounded container that gets background on scroll */}
        <div
          className={`
            max-w-7xl mx-auto rounded-full transition-all duration-500
            ${filled
              ? 'bg-kotta-red shadow-lg'
              : 'bg-transparent'}
          `}
        >
        <nav className="px-6 lg:px-10 h-[64px] flex items-center justify-between gap-8">

          {/* ── Logo ───────────────────────────────────────────────── */}
          <Link href="/" onClick={close} className="flex items-center gap-3 group shrink-0">
            {/* Ornamental mark */}
            <span
              className={`w-full border flex items-center justify-center transition-colors duration-300`}
            >
              <img src={logo.src} alt='logo' width={48} height={48} />
            </span>
          </Link>

          {/* ── Desktop Links ───────────────────────────────────────── */}
          <div className=" hidden lg:flex items-center gap-10">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`font-display section-label transition-colors duration-300
                  ${filled
                    ? 'text-kotta-cream hover:text-kotta-red'
                    : 'text-kotta-red hover:text-kotta-cream'}
                `}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTA ────────────────────────────────────────── */}
          <div className=" hidden lg:flex items-center gap-4 shrink-0">
            <Link
              href="#pesan"
              className={`font-display section-label px-6 py-3 border transition-all duration-300
                ${filled
                  ? 'border-kotta-cream text-kotta-cream hover:bg-kotta-red hover:text-kotta-cream'
                  : 'border-kotta-red text-kotta-red hover:border-kotta-cream'}
              `}
            >
              Pesan Sekarang
            </Link>
          </div>

          {/* ── Hamburger ──────────────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className={`block h-px transition-all duration-300 origin-center bg-kotta-cream
                  ${i === 0 ? (menuOpen ? 'rotate-45 translate-y-[6px] w-6'  : 'w-6') : ''}
                  ${i === 1 ? (menuOpen ? 'opacity-0 w-4'                    : 'w-4') : ''}
                  ${i === 2 ? (menuOpen ? '-rotate-45 -translate-y-[6px] w-6': 'w-6') : ''}
                `}
              />
            ))}
          </button>
        </nav>
        </div>{/* end pill */}
      </header>

      {/* ── Mobile Menu Overlay ──────────────────────────────────────── */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden transition-all duration-500
          ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          onClick={close}
          className={`absolute inset-0 bg-kotta-black/40 backdrop-blur-sm transition-opacity duration-500
            ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Drawer */}
        <div
          className={`
            absolute inset-x-0 top-[80px] bg-kotta-cream border-t border-kotta-mist
            transition-all duration-500 ease-out overflow-hidden
            ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="px-8 py-10 flex flex-col gap-7">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="section-label text-kotta-black/60 hover:text-kotta-red transition-colors"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="#pesan"
              onClick={close}
              className=""
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
