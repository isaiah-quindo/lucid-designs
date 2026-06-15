'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLineReveal } from './useLineReveal'

const principles = [
  {
    n: '01',
    t: 'Substance over noise',
    d: 'We design with intent. Every element earns its place. The result is work that feels inevitable, not decorated.',
  },
  {
    n: '02',
    t: 'Craft at every layer',
    d: 'From typographic detail to the underlying code, we treat every layer of the work as visible, because eventually, it is.',
  },
  {
    n: '03',
    t: 'One team, start to finish',
    d: 'The same people guide your project from first brief to launch. Nothing gets lost in a handover.',
  },
  {
    n: '04',
    t: 'Built to last',
    d: 'Our sites are fast, accessible and maintainable. We leave you with something your team can grow with.',
  },
]

export default function About() {
  const root = useRef<HTMLElement>(null)
  const headlineRef = useLineReveal<HTMLHeadingElement>({ start: 'top 80%' })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from('.principle', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="about"
      className="relative py-32 md:py-48 px-6 md:px-10 bg-[#eeeeec] border-t border-ink/10 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-1/4 right-0 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(150,140,170,0.18),transparent)] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(180,160,140,0.16),transparent)] blur-3xl" />
      </div>
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-baseline justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink/60">
            <span className="block w-8 h-px bg-ink/40" />
            About the studio
          </div>
          <span className="text-xs text-ink/50">(04)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <h2
              ref={headlineRef}
              className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1] tracking-tightest mb-8"
            >
              A studio for people who care about the details.
            </h2>
            <p className="text-ink/70 leading-relaxed max-w-md">
              Lucid Designs was founded on a simple idea: that great digital
              work is the product of clear thinking, real craft, and a small
              team of people who actually give a damn. We work directly with
              founders, design leaders, and marketing teams to make work we
              are proud to put our name on.
            </p>
          </div>

          <ul className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map((p) => (
              <li
                key={p.n}
                className="principle p-8 md:p-10 flex flex-col gap-4 min-h-[260px] rounded-2xl bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/60 shadow-[0_8px_40px_-20px_rgba(0,0,0,0.2)]"
              >
                <span className="text-xs text-ink/40">{p.n}</span>
                <h3 className="font-display text-2xl md:text-3xl tracking-tightest leading-tight">
                  {p.t}
                </h3>
                <p className="text-sm text-ink/65 leading-relaxed">{p.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
