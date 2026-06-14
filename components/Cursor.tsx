'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    if (!dot) return

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onEnter = () => {
      gsap.to(dot, { scale: 3, duration: 0.3 })
      dot.classList.add('is-hover')
    }
    const onLeave = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 })
      dot.classList.remove('is-hover')
    }

    window.addEventListener('mousemove', onMove)
    document
      .querySelectorAll('a, button, h1, h2, h3, [data-hover]')
      .forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document
        .querySelectorAll('a, button, h1, h2, h3, [data-hover]')
        .forEach((el) => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mouseleave', onLeave)
        })
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" aria-hidden />
}
