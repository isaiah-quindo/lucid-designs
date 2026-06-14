'use client'

import { useEffect, useState } from 'react'

export default function AvailabilityPill() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      href="#contact"
      data-hover
      aria-label="Currently accepting projects for Q3 2026"
      className={`fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3 rounded-full pl-3 pr-4 py-2 text-sm bg-white/40 backdrop-blur-xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] hover:bg-white/60 transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-ink">
        Available <span className="text-ink/50">· Q3 2026</span>
      </span>
    </a>
  )
}
