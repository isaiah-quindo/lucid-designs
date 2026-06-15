'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLineReveal } from './useLineReveal'

const services = [
  {
    n: '01',
    title: 'Brand Identity',
    body: 'Strategy, naming, visual systems and guidelines that give your brand a clear voice and lasting form.',
    tags: ['Strategy', 'Logo', 'Type', 'Guidelines'],
  },
  {
    n: '02',
    title: 'Web Design',
    body: 'Thoughtful marketing sites, portfolios and product surfaces, designed to convert and built to last.',
    tags: ['UX', 'UI', 'Prototyping', 'Copy'],
  },
  {
    n: '03',
    title: 'Development',
    body: 'End-to-end web builds: interfaces, APIs, databases and the infrastructure underneath. Fast, accessible, and built to scale with your team.',
    tags: ['Next.js', 'Laravel', 'Postgres', 'Infra'],
  },
  {
    n: '04',
    title: 'Design Systems',
    body: 'Component libraries and tokens that scale with your team, from Figma source-of-truth to production code.',
    tags: ['Tokens', 'Components', 'Docs', 'Handoff'],
  },
]

export default function Services() {
  const root = useRef<HTMLElement>(null)
  const headlineRef = useLineReveal<HTMLHeadingElement>({ start: 'top 80%' })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from('.svc-row', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="services"
      className="relative py-32 md:py-48 px-6 md:px-10 border-t border-ink/10"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-baseline justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink/60">
            <span className="block w-8 h-px bg-ink/40" />
            What we do
          </div>
          <span className="text-xs text-ink/50">(01)</span>
        </div>

        <h2
          ref={headlineRef}
          className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1] tracking-tightest max-w-5xl mb-20 md:mb-32"
        >
          A studio practice covering{' '}
          <span className="italic">strategy, design, and engineering</span>
          {' '} end to end.
        </h2>

        <ul className="divide-y divide-ink/15 border-t border-ink/15">
          {services.map((s) => (
            <li
              key={s.n}
              className="svc-row group grid grid-cols-12 gap-6 py-8 md:py-12 items-start hover:bg-ink/[0.02] transition-colors px-2"
              data-hover
            >
              <span className="col-span-2 md:col-span-1 text-sm text-ink/40 pt-2">
                {s.n}
              </span>
              <h3 className="col-span-10 md:col-span-4 font-display text-3xl md:text-5xl tracking-tightest leading-none">
                {s.title}
              </h3>
              <p className="col-span-12 md:col-span-5 text-ink/70 leading-relaxed">
                {s.body}
              </p>
              <ul className="col-span-12 md:col-span-2 flex md:flex-col flex-wrap gap-2 md:gap-1 text-xs text-ink/50">
                {s.tags.map((t) => (
                  <li key={t}>— {t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
