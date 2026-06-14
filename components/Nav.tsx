'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dark = !scrolled // hero is black — light text when at top

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-white/60 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.06] shadow-[0_1px_30px_-15px_rgba(0,0,0,0.15)] text-ink'
          : 'py-6 text-paper'
      }`}
    >
      <nav className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <Logo
            className={`w-8 h-8 transition-transform duration-500 group-hover:rotate-[8deg] ${
              dark ? 'text-paper' : 'text-ink'
            }`}
          />
          <span className="text-sm tracking-tight font-medium">
            Lucid Designs
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative transition-colors ${
                  dark
                    ? 'text-paper/70 hover:text-paper'
                    : 'text-ink/70 hover:text-ink'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#pricing"
          className={`text-sm border rounded-full px-4 py-2 transition-colors ${
            dark
              ? 'border-paper/60 hover:bg-paper hover:text-ink'
              : 'border-ink hover:bg-ink hover:text-paper'
          }`}
        >
          Start a project
        </a>
      </nav>
    </header>
  )
}
