'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLineReveal } from './useLineReveal'

const projects = [
  {
    title: 'Open Architects',
    type: 'Webflow Design · Development',
    year: '2026',
    sector: 'Education',
    href: 'https://openarchitects.com',
    preview: {
      image: '/work/open-architects.png',
      gradient: 'from-[#d8c7a8] via-[#b89b6a] to-[#5c4a2e]',
      tag: 'OA',
    },
  },
  {
    title: 'MacArthur Infusions',
    type: 'Web Design · Booking System',
    year: '2026',
    sector: 'Healthcare',
    href: 'https://macarthurinfusions.com.au',
    preview: {
      image: '/work/macarthur-infusions.png',
      gradient: 'from-[#cfe0ff] via-[#7aa8e8] to-[#1f3a6b]',
      tag: 'MI',
    },
  },
  {
    title: 'Nomod Feature Pages',
    type: 'Web Design',
    year: '2026',
    sector: 'Fintech',
    href: 'https://nomod.com/en-ae/features/tap-to-pay',
    preview: {
      image: '/work/nomod.png',
      gradient: 'from-[#dde2ef] via-[#8a99b8] to-[#3a4560]',
      tag: 'NM',
    },
  },
  {
    title: 'RiCON',
    type: 'Web Design · Event Registration',
    year: '2026',
    sector: 'Events',
    href: 'https://ricon.ph',
    preview: {
      image: '/work/ricon.png',
      video: '/work/ricon.mp4',
      gradient: 'from-[#eedaba] via-[#c69060] to-[#4f2f1c]',
      tag: 'RC',
    },
  },
]

type Project = (typeof projects)[number]

function ProjectRow({ p, index }: { p: Project; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const video = 'video' in p.preview ? (p.preview as { video?: string }).video : undefined

  const handleEnter = () => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    void v.play().catch(() => {})
  }

  const handleLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <li
      className="work-row group border-b border-paper/15"
      data-hover
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <a
        href={p.href}
        target={p.href.startsWith('http') ? '_blank' : undefined}
        rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="grid grid-cols-12 gap-6 py-7 md:py-10 items-center"
      >
        <span className="col-span-1 text-xs text-paper/40 self-start pt-2">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="col-span-12 md:col-span-5 order-2 md:order-none">
          <div className="relative overflow-hidden rounded-sm p-6 md:p-8">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${p.preview.gradient}`}
            />
            <div className="relative aspect-[1552/982]">
              {p.preview.image && (
                <img
                  src={p.preview.image}
                  alt={`${p.title} preview`}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-contain object-center transition-all duration-700 ease-out grayscale brightness-75 ${
                    video
                      ? 'group-hover:opacity-0'
                      : 'group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105'
                  }`}
                />
              )}
              {video && (
                <video
                  ref={videoRef}
                  src={video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-contain object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              )}
            </div>
            <div className="absolute inset-0 flex items-end justify-between p-4 text-paper transition-opacity duration-500 opacity-60 group-hover:opacity-100">
              <span className="text-[10px] uppercase tracking-[0.25em]">
                {p.preview.tag} · Preview
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em]">
                {p.sector}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-11 md:col-span-5 order-1 md:order-none">
          <h3 className="font-display text-3xl md:text-5xl tracking-tightest leading-none transition-transform duration-500 group-hover:translate-x-2">
            {p.title}
          </h3>
          <div className="mt-4 text-sm text-paper/60">{p.type}</div>
        </div>

        <span className="col-span-1 text-right text-sm text-paper/60 order-3 md:order-none self-start pt-2">
          {p.year}
        </span>
      </a>
    </li>
  )
}

export default function Work() {
  const root = useRef<HTMLElement>(null)
  const headlineRef = useLineReveal<HTMLHeadingElement>({ start: 'top 85%' })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from('.work-row', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 75%',
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="work"
      className="relative py-32 md:py-48 px-6 md:px-10 bg-ink text-paper"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-baseline justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/60">
            <span className="block w-8 h-px bg-paper/40" />
            Selected work
          </div>
          <span className="text-xs text-paper/50">(02)</span>
        </div>

        <h2
          ref={headlineRef}
          className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1] tracking-tightest max-w-5xl mb-20 md:mb-28"
        >
          Long-term partnerships with brands we believe in.
        </h2>

        <ul className="border-t border-paper/15">
          {projects.map((p, i) => (
            <ProjectRow key={p.title} p={p} index={i} />
          ))}
        </ul>

        <div className="mt-16 flex justify-end">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm border border-paper/30 rounded-full px-5 py-3 hover:bg-paper hover:text-ink transition-colors"
          >
            <span>Full archive on request</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
