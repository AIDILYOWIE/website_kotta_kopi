'use client'

import { useState, useEffect } from 'react'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function update() {
      const hero    = document.getElementById('beranda')
      const order   = document.getElementById('pesan')
      const scrollY = window.scrollY
      const heroH   = hero ? hero.offsetHeight : 500

      if (scrollY < heroH * 0.6) { setVisible(false); return }

      if (order) {
        const rect = order.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) { setVisible(false); return }
      }

      setVisible(true)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden
        transition-all duration-400
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
      `}
    >
      <a
        href="https://gofood.co.id"
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="
          flex items-center gap-3 bg-kotta-red text-kotta-cream
          px-7 py-3.5 shadow-2xl shadow-kotta-red/30
          font-body font-semibold text-sm tracking-wide
          transition-all duration-300 hover:bg-kotta-dark-red
        "
      >
        🛵&nbsp; Pesan Sekarang
      </a>
    </div>
  )
}
