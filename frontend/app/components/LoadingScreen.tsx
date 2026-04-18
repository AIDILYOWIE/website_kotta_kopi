'use client'

import { useEffect, useState } from 'react'

const LETTERS = 'Loading'.split('')

export default function LoadingScreen() {
  const [fading,  setFading]  = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const dismiss = () => {
      setFading(true)
      setTimeout(() => setVisible(false), 550)
    }

    if (document.readyState === 'complete') {
      dismiss()
    } else {
      window.addEventListener('load', dismiss, { once: true })
      return () => window.removeEventListener('load', dismiss)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         99999,
        backgroundColor: 'var(--kotta-cream)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '28px',
        opacity:        fading ? 0 : 1,
        transition:     'opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents:  fading ? 'none' : 'auto',
      }}
    >
      {/* Logo */}
      <img
        src="/images/logo/logo.jpg"
        alt="Kotta Kopi"
        style={{
          width:        72,
          height:       72,
          objectFit:    'cover',
          borderRadius: '50%',
          display:      'block',
        }}
      />

      {/* Waving "Loading" letters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.08em' }}>
        {LETTERS.map((char, i) => (
          <span
            key={i}
            style={{
              display:         'inline-block',
              fontFamily:      'var(--font-body), "Plus Jakarta Sans", system-ui, sans-serif',
              fontSize:        '10px',
              letterSpacing:   '0.35em',
              textTransform:   'uppercase',
              fontWeight:      500,
              color:           'rgba(13,13,13,0.45)',
              animation:       `loader-wave 1.5s ease-in-out ${i * 0.11}s infinite`,
              willChange:      'transform',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}
