'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import FloatingCTA from '@/app/components/FloatingCTA'
import ScrollReveal from '@/app/components/ScrollReveal'
import MenuBanner from '@/app/components/MenuBanner'

/* ── Menu Data ─────────────────────────────────────────────────── */
type Category = 'semua' | 'kopi' | 'non-kopi' | 'makanan'

interface MenuItem {
  name: string
  desc: string
  price: string
  badge?: string
  color: string
  category: 'kopi' | 'non-kopi' | 'makanan'
}

const menuItems: MenuItem[] = [
  /* ── Kopi ── */
  { name: 'Kopi Anak Kotta', desc: 'Espresso bold dengan susu segar — rasa ikonik Kotta Kopi.', price: 'Rp 28.000', badge: 'Signature', color: 'bg-[#2a1008]', category: 'kopi' },
  { name: 'Es Kopi Kotta', desc: 'Kopi dingin segar, perpaduan sempurna espresso dan es.', price: 'Rp 25.000', badge: 'Favorit', color: 'bg-[#1a100d]', category: 'kopi' },
  /* ── Non-Kopi ── */
  { name: 'Matcha Latte', desc: 'Matcha premium grade dengan susu oat — kaya rasa dan lembut.', price: 'Rp 26.000', badge: 'Favorit', color: 'bg-[#0d1a0d]', category: 'non-kopi' },
  { name: 'Dark Chocolate', desc: 'Rich Belgian chocolate blended dengan susu segar.', price: 'Rp 24.000', color: 'bg-[#18100a]', category: 'non-kopi' },
  /* ── Makanan ── */
  { name: 'Butter Croissant', desc: 'Croissant lapis-lapis renyah di luar, lembut di dalam. Dibuat segar setiap hari.', price: 'Rp 22.000', badge: 'Segar', color: 'bg-[#1a1408]', category: 'makanan' },
  { name: 'Club Sandwich', desc: 'Sandwich premium isi ayam panggang, keju, tomat, dan selada.', price: 'Rp 38.000', color: 'bg-[#14180a]', category: 'makanan' },
]

const categories: { id: Category; label: string }[] = [
  { id: 'semua', label: 'Semua' },
  { id: 'kopi', label: 'Kopi' },
  { id: 'non-kopi', label: 'Non-Kopi' },
  { id: 'makanan', label: 'Makanan' },
]

/* ── Page ──────────────────────────────────────────────────────── */
export default function MenuPage() {
  const [active, setActive] = useState<Category>('semua')

  const filtered = active === 'semua'
    ? menuItems
    : menuItems.filter(m => m.category === active)

  return (
    <>
      <Navbar />

      <main>

        {/* ── Banner Slider ─────────────────────────────────────────── */}
        <MenuBanner />

        {/* ── Filter Chips ─────────────────────────────────────────── */}
        <div className="sticky top-[72px] z-30">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`
                    shrink-0 rounded-full px-7 py-2.5
                    text-[10px] tracking-[0.3em] uppercase font-body font-medium
                    transition-all duration-300 ease-out
                    ${active === cat.id
                      ? 'bg-kotta-red text-kotta-cream shadow-md shadow-kotta-red/20'
                      : 'text-kotta-black/50 border border-kotta-black/15 hover:border-kotta-red/40 hover:text-kotta-red bg-kotta-cream'}
                  `}
                >
                  {cat.label}
                </button>
              ))}

              {/* Ornamental divider */}
              <div className="hidden sm:flex items-center gap-3 ml-auto">
                <div className="h-px w-12 bg-kotta-black/10" />
                <span className="text-[9px] tracking-[0.25em] uppercase text-kotta-black/25 font-body whitespace-nowrap">
                  {filtered.length} Menu
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Menu Grid ────────────────────────────────────────────── */}
        <section className="bg-kotta-cream py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">

            {/* Count */}
            <div className="flex items-center justify-between mb-10">
              <p className="section-label text-kotta-gray tracking-[0.3em]">
                {filtered.length} Item
              </p>
              <div className="h-px flex-1 bg-kotta-light-gray mx-6" />
              <p className="section-label text-kotta-gray tracking-[0.3em]">
                {categories.find(c => c.id === active)?.label ?? 'Semua'}
              </p>
            </div>

            <div className="grid items-start justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12">
              {filtered.map((item, i) => {
                const img = item.category === 'makanan' ? '/images/menu/croissant.png' : '/images/menu/menu.png'
                const imgHover = item.category === 'makanan' ? '/images/menu/croissant_change.png' : '/images/menu/menu_change.png'

                return (
                  <ScrollReveal key={`${item.name}-${i}`} delay={(i % 4) * 100}>
                    <div className="group relative hover:z-10">
                      {/* Default image — responsive aspect ratio */}
                      <div className="relative w-full aspect-[2/3] overflow-hidden">
                        <img
                          src={img}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover
                                     transition-opacity duration-300 ease-out
                                     md:group-hover:opacity-0"
                        />
                      </div>

                      {/* Hover image — md+ only to prevent overflow on mobile */}
                      <img
                        src={imgHover}
                        alt={item.name}
                        className="hidden md:block absolute bottom-[60px] left-1/2 -translate-x-1/2
                                   w-[130%] max-w-none pointer-events-none
                                   opacity-0 scale-[1]
                                   transition-[opacity,transform] duration-500 ease-out
                                   group-hover:opacity-100 group-hover:scale-[1.15]"
                      />

                      {/* Name + price — always visible on mobile, slide up on hover md+ */}
                      <div className="pt-3 overflow-hidden">
                        <div className="opacity-100 translate-y-0
                                       md:opacity-0 md:translate-y-3
                                       md:group-hover:opacity-100 md:group-hover:translate-y-0
                                       transition-all duration-300 ease-out">
                          <p className="font-display text-kotta-black text-sm md:text-base leading-snug">{item.name}</p>
                          <p className="font-body text-kotta-red text-xs md:text-sm mt-0.5 tracking-wide">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
