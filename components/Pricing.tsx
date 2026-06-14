'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLineReveal } from './useLineReveal'
import ProjectForm from './ProjectForm'

type Feature = { included: boolean; label: string }
type Tier = {
  name: string
  tagline: string
  price: string
  priceNote: string
  popular?: boolean
  features: Feature[]
  cta: string
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    tagline: 'Landing page',
    price: '$200',
    priceNote: 'one-time',
    features: [
      { included: true, label: 'Single-page site' },
      { included: true, label: 'Responsive design & motion' },
      { included: true, label: '1 year hosting included' },
      { included: false, label: 'Multi-page architecture' },
      { included: false, label: 'Custom layout & systems' },
    ],
    cta: 'Start with a landing page',
  },
  {
    name: 'Essential',
    tagline: 'Most popular',
    price: '$350',
    priceNote: 'one-time',
    popular: true,
    features: [
      { included: true, label: 'Home, About, Services, Contact' },
      { included: true, label: 'Responsive design & motion' },
      { included: true, label: '1 year hosting included' },
      { included: false, label: 'Unlimited pages' },
      { included: false, label: 'Custom layout & components' },
    ],
    cta: 'Build the full site',
  },
  {
    name: 'Custom',
    tagline: 'Tailored website',
    price: 'Quote',
    priceNote: 'tailored to scope',
    features: [
      { included: true, label: 'Unlimited pages' },
      { included: true, label: 'Custom layout & components' },
      { included: true, label: 'Brand strategy & system' },
      { included: true, label: 'Booking, CMS or integrations' },
      { included: true, label: '1 year hosting included' },
    ],
    cta: 'Request a proposal',
  },
]

function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        on
          ? 'border-current text-current'
          : 'border-current/30 text-current/30'
      }`}
    >
      {on ? (
        <svg viewBox="0 0 10 10" className="h-2 w-2" fill="none">
          <path
            d="M1.5 5.2 L4 7.5 L8.5 2.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 10 10" className="h-1.5 w-1.5" fill="none">
          <path
            d="M2 2 L8 8 M8 2 L2 8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  )
}

export default function Pricing() {
  const root = useRef<HTMLElement>(null)
  const headlineRef = useLineReveal<HTMLHeadingElement>({ start: 'top 80%' })
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from('.price-card', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="pricing"
      className="relative py-32 md:py-48 px-6 md:px-10 border-t border-ink/10"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-baseline justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink/60">
            <span className="block w-8 h-px bg-ink/40" />
            Pricing
          </div>
          <span className="text-xs text-ink/50">(03)</span>
        </div>

        <h2
          ref={headlineRef}
          className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1] tracking-tightest max-w-5xl mb-20 md:mb-32"
        >
          Straightforward pricing for{' '}
          <span className="italic">every stage</span> of your brand.
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {tiers.map((t) => {
            const isDark = !!t.popular
            return (
              <li
                key={t.name}
                className={`price-card relative flex flex-col rounded-2xl border p-8 md:p-10 ${
                  isDark
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-white text-ink border-ink/15'
                }`}
                data-hover
              >
                {t.popular && (
                  <span className="absolute -top-3 left-8 inline-flex items-center gap-2 rounded-full bg-paper text-ink text-[10px] uppercase tracking-[0.25em] px-3 py-1 border border-ink/10">
                    <span className="block h-1.5 w-1.5 rounded-full bg-ink" />
                    Most popular
                  </span>
                )}

                <div className="flex items-baseline justify-between mb-10">
                  <h3 className="font-display text-2xl md:text-3xl tracking-tightest">
                    {t.name}
                  </h3>
                  <span
                    className={`text-[10px] uppercase tracking-[0.25em] ${
                      isDark ? 'text-paper/55' : 'text-ink/50'
                    }`}
                  >
                    {t.tagline}
                  </span>
                </div>

                <div className="mb-10">
                  <div className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.9] tracking-tightest">
                    {t.price}
                  </div>
                  <div
                    className={`mt-3 text-xs uppercase tracking-[0.25em] ${
                      isDark ? 'text-paper/55' : 'text-ink/50'
                    }`}
                  >
                    {t.priceNote}
                  </div>
                </div>

                <ul
                  className={`flex-1 space-y-3.5 text-sm border-t pt-8 ${
                    isDark ? 'border-paper/15' : 'border-ink/10'
                  }`}
                >
                  {t.features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-start gap-3 ${
                        isDark
                          ? f.included
                            ? 'text-paper/90'
                            : 'text-paper/40'
                          : f.included
                            ? 'text-ink/85'
                            : 'text-ink/40'
                      }`}
                    >
                      <Check on={f.included} />
                      <span className="leading-snug">{f.label}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(t.name)}
                  data-hover
                  className={`mt-10 inline-flex items-center justify-between gap-3 rounded-full border px-5 py-3 text-sm transition-colors ${
                    isDark
                      ? 'border-paper/40 hover:bg-paper hover:text-ink'
                      : 'border-ink hover:bg-ink hover:text-paper'
                  }`}
                >
                  <span>{t.cta}</span>
                  <span>→</span>
                </button>
              </li>
            )
          })}
        </ul>

        <p className="mt-12 text-sm text-ink/55 max-w-2xl">
          All projects include strategy, design review and a handover walkthrough.
          Hosting is on our account at no cost for the first year, after
          which you can self-host or stay on with us.
        </p>
      </div>

      <ProjectForm
        open={selectedPlan !== null}
        plan={selectedPlan ?? undefined}
        onClose={() => setSelectedPlan(null)}
      />
    </section>
  )
}
