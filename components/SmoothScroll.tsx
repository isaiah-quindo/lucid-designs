'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href === '#') return
      const target =
        href === '#top'
          ? 0
          : document.querySelector<HTMLElement>(href)
      if (target === null) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement | 0, {
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      })
      if (history.replaceState) {
        history.replaceState(null, '', href)
      }
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
