'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children:  ReactNode
  className?: string
  delay?:    number
  direction?: 'up' | 'left' | 'right'
}

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const cls = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal'

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`${cls} ${className}`}>
      {children}
    </div>
  )
}
