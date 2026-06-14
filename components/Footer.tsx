import HeroBackground from './HeroBackground'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-paper px-6 md:px-10 pt-20 pb-10">
      <HeroBackground gridScale={80} />
      <div className="relative z-10 mx-auto max-w-[1400px] [text-shadow:0_0_2px_rgba(0,0,0,1),0_1px_5px_rgba(0,0,0,1),0_2px_32px_rgba(0,0,0,0.95)]">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-20">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2.5 mb-6">
              <Logo className="w-8 h-8 text-paper" />
              <span className="text-sm font-medium">Lucid Designs</span>
            </div>
            <p className="text-paper/60 max-w-sm text-sm leading-relaxed">
              A design and development studio crafting clear, considered
              digital experiences for ambitious brands.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7 text-sm">
            <h4 className="text-paper/40 mb-4 text-xs uppercase tracking-[0.2em]">
              Studio
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#work" className="text-paper/80 hover:text-paper">
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-paper/80 hover:text-paper"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-paper/80 hover:text-paper"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#about" className="text-paper/80 hover:text-paper">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 text-sm">
            <h4 className="text-paper/40 mb-4 text-xs uppercase tracking-[0.2em]">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@luciddesigns.com.au"
                  className="text-paper/80 hover:text-paper"
                >
                  hello@luciddesigns.com.au
                </a>
              </li>
              <li className="text-paper/60">Sydney, AU</li>
            </ul>
          </div>

          <div className="md:col-span-2 text-sm">
            <h4 className="text-paper/40 mb-4 text-xs uppercase tracking-[0.2em]">
              Hours
            </h4>
            <ul className="space-y-2">
              <li className="text-paper/80">Mon — Fri</li>
              <li className="text-paper/60">9 to 5</li>
            </ul>
          </div>
        </div>

        <div
          aria-hidden
          className="font-display text-[clamp(4rem,22vw,22rem)] leading-[0.85] tracking-tightest -mb-6 select-none overflow-hidden [text-shadow:0_4px_60px_rgba(0,0,0,0.65),0_2px_8px_rgba(0,0,0,0.45)]"
        >
          Lucid<span className="italic">.</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-paper/15 pt-6 text-xs text-paper/50">
          <span>© {new Date().getFullYear()} Lucid Designs. ABN 52 361 537 985</span>
          <span>Made in Sydney · luciddesigns.com.au</span>
        </div>
      </div>
    </footer>
  )
}
