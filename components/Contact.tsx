'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from('.contact-headline span', {
        y: '110%',
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="contact"
      className="relative py-32 md:py-56 px-6 md:px-10 bg-white border-t border-ink/10"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-baseline justify-between mb-16">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink/60">
            <span className="block w-8 h-px bg-ink/40" />
            Let's build something
          </div>
          <span className="text-xs text-ink/50">(05)</span>
        </div>

        <h2 className="contact-headline font-display text-[clamp(2.75rem,10vw,10rem)] leading-[0.95] tracking-tightest mb-20 md:mb-28">
          <span className="block overflow-hidden">
            <span className="block">Have a project</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block italic">in mind?</span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-6">
            <a
              href="mailto:hello@luciddesigns.com.au"
              data-hover
              className="group inline-flex items-baseline gap-4 font-display text-3xl md:text-5xl tracking-tightest"
            >
              <span className="border-b border-ink pb-1 group-hover:pl-2 transition-all duration-500">
                hello@luciddesigns.com.au
              </span>
              <span className="text-ink/40 group-hover:translate-x-2 transition-transform duration-500">
                →
              </span>
            </a>
            <p className="mt-6 text-ink/60 max-w-md">
              Drop us a line with a bit about your business, timelines, and
              what you'd like to build. We reply within two working days.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-ink/15 pb-2">
              <span className="text-ink/50">Studio</span>
              <span>Sydney, AU</span>
            </div>
            <div className="flex justify-between border-b border-ink/15 pb-2">
              <span className="text-ink/50">Hours</span>
              <span>Mon to Fri, 9 to 5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
