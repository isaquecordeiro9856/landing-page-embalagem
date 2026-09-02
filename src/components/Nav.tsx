import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useMagnetic } from '../lib/useMagnetic'

const links = [
  { href: '#produtos', label: 'Linhas' },
  { href: '#contato', label: 'Contato' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.3)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(root.current, { y: -50, opacity: 0, duration: 0.9, delay: 1.15, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <header
      id="top"
      ref={root}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'border-b border-ink-900/10 bg-kraft-50/90 py-3 backdrop-blur-md'
          : 'py-5'
      }`}
    >
      <div className="container-page flex items-center justify-between">
        <a
          href="#top"
          data-cursor="Topo"
          className={`font-display text-lg leading-none tracking-wide transition-colors duration-500 md:text-xl ${
            solid ? 'text-ink-900' : 'text-kraft-50 mix-blend-difference'
          }`}
        >
          DISK ATACADO
          <span className={solid ? 'text-stamp' : 'text-stamp-light'}>.</span>
        </a>

        <div className="flex items-center gap-6 md:gap-10">
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="Ir"
                className={`group relative font-body text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ${
                  solid ? 'text-ink-900/70 hover:text-ink-900' : 'text-kraft-100/80 mix-blend-difference'
                }`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-stamp transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a
            ref={ctaRef}
            href="https://wa.me/5542998330224"
            target="_blank"
            rel="noreferrer"
            data-cursor="Falar"
            className={`group relative overflow-hidden border px-5 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
              solid
                ? 'border-ink-900/20 text-ink-900'
                : 'border-kraft-50/30 text-kraft-50 mix-blend-difference'
            }`}
          >
            <span className="absolute inset-0 -translate-y-full bg-stamp transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />
            <span className={`relative ${solid ? 'group-hover:text-kraft-50' : ''}`}>
              (42) 99833-0224
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
