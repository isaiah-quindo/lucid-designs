'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroBackground from './HeroBackground'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.6,
      })

      gsap.set('.hero-line', { y: '110%' })
      gsap.set('.hero-fade', { opacity: 0, y: 24 })

      tl.to('.hero-line', {
        y: '0%',
        duration: 1.2,
        stagger: 0.08,
      })
        .to(
          '.hero-fade',
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          '-=0.6'
        )
        .from(
          '.hero-meta',
          { opacity: 0, y: 12, duration: 0.6, stagger: 0.05 },
          '-=0.4'
        )

      // Fade the hero content out as the user scrolls through the section
      gsap.to('.hero-content', {
        opacity: 0,
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate min-h-screen pt-40 pb-24 md:pt-56 md:pb-32 px-6 md:px-10 overflow-hidden bg-ink text-paper"
    >
      <HeroBackground />
      <div className="hero-content relative z-10 mx-auto max-w-[1400px]">
        <div className="hero-fade flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/60 mb-10 [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
          <span className="block w-8 h-px bg-paper/40" />
          Design & Development Studio · Australia
        </div>

        <h1 className="font-display text-[clamp(3rem,11vw,11rem)] leading-[0.95] tracking-tightest [text-shadow:0_2px_40px_rgba(0,0,0,0.6),0_1px_4px_rgba(0,0,0,0.4)]">
          <span className="block overflow-hidden">
            <span className="hero-line block">Clarity in</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block italic">every pixel,</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block">every line of code.</span>
          </span>
        </h1>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <p className="hero-fade md:col-span-5 text-lg md:text-xl text-paper/70 leading-relaxed max-w-xl [text-shadow:0_1px_18px_rgba(0,0,0,0.45)]">
            We are a small, hands-on studio building considered websites,
            interfaces, and brand systems for companies who care about how
            things work and how they feel.
          </p>

          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-3 text-sm [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
            <div className="hero-meta flex justify-between border-b border-paper/20 pb-2">
              <span className="text-paper/50">Based</span>
              <span>Sydney, AU</span>
            </div>
            <div className="hero-meta flex justify-between border-b border-paper/20 pb-2">
              <span className="text-paper/50">Available</span>
              <span>Q3 — Q4 2026</span>
            </div>
            <div className="hero-meta flex justify-between border-b border-paper/20 pb-2">
              <span className="text-paper/50">Working with</span>
              <span>Global clients</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
