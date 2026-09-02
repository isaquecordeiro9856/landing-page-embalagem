import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from './Picture'
import { categories } from '../data/categories'

gsap.registerPlugin(ScrollTrigger)

export default function Categories() {
  const [active, setActive] = useState(0)
  // só monta a foto de uma linha depois que ela é visitada
  const [seen, setSeen] = useState<number[]>([0])
  const root = useRef<HTMLDivElement>(null)
  const layers = useRef<HTMLDivElement[]>([])
  const prev = useRef(0)
  const cat = categories[active]

  const pick = (i: number) => {
    setActive(i)
    setSeen((s) => (s.includes(i) ? s : [...s, i]))
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cat-head', {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      gsap.from('.cat-row', {
        opacity: 0,
        yPercent: 40,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cat-list', start: 'top 80%' },
      })
      gsap.from('.cat-stage', {
        opacity: 0,
        scale: 0.94,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // troca de linha: cortina vertical sobre a foto anterior
  useEffect(() => {
    const el = layers.current[active]
    const out = layers.current[prev.current]
    prev.current = active
    if (!el) return

    gsap.killTweensOf([el, out].filter(Boolean))
    gsap.set(el, { zIndex: 20, opacity: 1 })
    gsap.fromTo(
      el,
      { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.07 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        duration: 1,
        ease: 'expo.out',
        overwrite: 'auto',
      },
    )
    if (out && out !== el) gsap.to(out, { zIndex: 10, duration: 0 })
  }, [active])

  return (
    <section
      id="produtos"
      ref={root}
      className="relative overflow-hidden bg-kraft-50 pb-16 pt-24 md:pb-20 md:pt-32"
    >
      <div className="container-page">
        <div className="cat-head flex flex-col gap-4 border-b border-ink-900/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.32em] text-stamp">
              03 — Linhas
            </span>
            <h2 className="mt-4 font-display text-[13vw] leading-[1.06] text-ink-900 md:text-[5.4vw] md:leading-[0.98]">
              O QUE SAI DO
              <br />
              <span className="text-stamp">NOSSO GALPÃO</span>
            </h2>
          </div>
          <p className="max-w-xs font-body text-sm leading-relaxed text-ink-900/55">
            Passe pelas linhas para ver a peça em detalhe. Catálogo completo e disponibilidade por
            WhatsApp.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1fr_minmax(340px,42%)] md:gap-14">
          <div className="cat-list order-2 flex flex-col md:order-1">
            {categories.map((c, i) => {
              const on = active === i
              return (
                <button
                  key={c.id}
                  data-cursor="Ver"
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  className="cat-row group relative border-b border-ink-900/10 py-5 text-left md:py-7"
                >
                  <span
                    className="absolute inset-y-0 left-0 -z-0 bg-ink-900/[0.04] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: on ? '100%' : '0%' }}
                  />
                  <div
                    className="relative flex items-baseline gap-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:gap-7"
                    style={{ transform: on ? 'translateX(16px)' : 'translateX(0)' }}
                  >
                    <span
                      className={`font-body text-[11px] font-semibold tracking-[0.2em] transition-colors duration-500 ${
                        on ? 'text-stamp' : 'text-ink-900/30'
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`font-display text-[8vw] leading-[0.95] transition-colors duration-500 md:text-[3.2vw] ${
                        on ? 'text-stamp' : 'text-ink-900'
                      }`}
                    >
                      {c.label}
                    </span>
                    <span
                      className="ml-auto hidden shrink-0 font-body text-lg text-stamp transition-all duration-500 md:block"
                      style={{ opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -12}px)` }}
                    >
                      →
                    </span>
                  </div>
                  <div
                    className="relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ maxHeight: on ? 80 : 0, opacity: on ? 1 : 0 }}
                  >
                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 pl-0 font-body text-xs uppercase tracking-wider text-ink-900/50 md:pl-[4.4rem]">
                      {c.items.map((it) => (
                        <li key={it} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-stamp" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              )
            })}
          </div>

          {/* palco fotográfico */}
          <div className="cat-stage order-1 md:order-2 md:sticky md:top-24 md:self-start">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-[#141210] md:aspect-[4/5]">
              {categories.map((c, i) =>
                seen.includes(i) ? (
                  <div
                    key={c.id}
                    ref={(el) => {
                      if (el) layers.current[i] = el
                    }}
                    className="absolute inset-0 will-change-transform"
                    style={{ zIndex: i === active ? 20 : 10 }}
                  >
                    <Picture
                      name={c.stage}
                      sizes="(min-width: 768px) 42vw, 100vw"
                      className="h-full w-full"
                    />
                  </div>
                ) : null,
              )}

              <div className="noise-overlay pointer-events-none absolute inset-0 z-30" />
              <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-[#0d0b09] via-transparent to-[#0d0b09]/35" />

              <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between p-5 font-body text-[10px] uppercase tracking-[0.28em] text-kraft-100/55">
                <span>Linha {String(active + 1).padStart(2, '0')}</span>
                <span>{categories.length} linhas</span>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 p-5 pt-16">
                <h3 className="font-display text-2xl leading-none text-kraft-50 md:text-3xl">
                  {cat.label}
                </h3>
                <p className="mt-2 font-body text-xs text-kraft-100/70">{cat.desc}</p>
              </div>

              <span className="pointer-events-none absolute bottom-5 right-5 z-40 h-8 w-8 animate-spin-slow rounded-full border border-dashed border-kraft-100/30" />
            </div>

            <a
              href="https://wa.me/5542998330224"
              target="_blank"
              rel="noreferrer"
              data-cursor="Falar"
              className="group mt-4 flex items-center justify-between border-b border-ink-900/15 pb-3 font-body text-sm font-semibold uppercase tracking-[0.15em] text-ink-900 transition-colors hover:text-stamp"
            >
              Consultar {cat.short.toLowerCase()}
              <span className="transition-transform duration-500 group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
