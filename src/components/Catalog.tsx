import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from './Picture'
import { categories } from '../data/categories'

gsap.registerPlugin(ScrollTrigger)

export default function Catalog() {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!track.current || !section.current) return
      const distance = () => track.current!.scrollWidth - window.innerWidth

      const scrollTween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.6}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(bar.current, { scaleX: self.progress })
            const i = Math.min(
              categories.length,
              Math.floor(self.progress * (categories.length + 1)) + 1,
            )
            if (counter.current) counter.current.textContent = String(i).padStart(2, '0')
          },
        },
      })

      gsap.utils.toArray<HTMLElement>('.catalog-card').forEach((card) => {
        gsap.fromTo(
          card,
          { yPercent: 7, rotate: 1.2, opacity: 0.4 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left 92%',
              end: 'left 48%',
              scrub: true,
            },
          },
        )

        // parallax interno: a foto anda mais devagar que a ficha
        const shot = card.querySelector('.catalog-shot')
        if (shot) {
          gsap.fromTo(
            shot,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        }
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} className="relative overflow-hidden bg-ink-900 py-20 text-kraft-50">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 border-b border-kraft-100/10 pb-6">
          <div>
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.32em] text-stamp-light">
              04 — Catálogo
            </span>
            <h2 className="mt-4 font-display text-[12vw] leading-[0.98] md:text-[5vw] md:leading-[0.9]">
              O ESTOQUE, FICHA POR FICHA
            </h2>
          </div>
          <span
            data-cursor="Arraste"
            className="hidden shrink-0 font-body text-[11px] uppercase tracking-[0.28em] text-kraft-100/40 md:block"
          >
            <span ref={counter}>01</span> / 0{categories.length + 1} ↦
          </span>
        </div>
        <div className="mt-5 h-[2px] w-full bg-kraft-100/10">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-stamp" />
        </div>
      </div>

      <div ref={track} className="mt-12 flex w-max gap-5 px-6 pb-6 md:gap-8 md:px-12">
        {categories.map((cat, i) => (
          <article
            key={cat.id}
            data-cursor="Ver"
            className="catalog-card group relative flex h-[64vh] w-[80vw] flex-shrink-0 flex-col overflow-hidden rounded-[3px] bg-kraft-100 text-ink-900 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)] transition-transform duration-500 will-change-transform hover:-translate-y-2 md:h-[68vh] md:w-[31vw]"
          >
            {/* foto real da linha */}
            <div className="relative h-[52%] shrink-0 overflow-hidden">
              <Picture
                name={cat.card}
                sizes="(min-width: 768px) 32vw, 80vw"
                grade
                className="absolute inset-0 h-full w-full scale-110"
                imgClassName="catalog-shot will-change-transform"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-kraft-100 via-transparent to-transparent" />
              <span className="absolute -right-16 top-7 h-10 w-64 rotate-[-18deg] bg-stamp transition-all duration-500 group-hover:top-5 group-hover:w-72" />

              <header className="absolute inset-x-0 top-0 flex items-start justify-between p-5 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-kraft-50/85 md:p-6">
                <span>
                  {String(i + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                </span>
                <span className="mr-1 mt-0.5 text-[10px] tracking-[0.2em]">Disk Atacado</span>
              </header>
            </div>

            {/* ficha */}
            <div className="relative flex flex-1 flex-col justify-between p-6 md:p-8">
              <span className="noise-overlay pointer-events-none absolute inset-0" />

              <div className="relative">
                <h3 className="font-display text-[8.5vw] leading-[0.92] md:text-[2.7vw]">
                  {cat.label}
                </h3>
                <p className="mt-2 font-body text-sm text-ink-900/60">{cat.desc}</p>

                <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1.5 border-t border-ink-900/15 pt-4 font-body text-[13px] text-ink-900/70 sm:grid-cols-2">
                  {cat.items.map((it) => (
                    <li key={it} className="flex items-center gap-3">
                      <span className="h-px w-4 shrink-0 bg-stamp" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-6 flex items-center justify-between font-body text-[11px] uppercase tracking-[0.2em] text-ink-900/45">
                <span>Lote 0824 · Guarapuava — PR</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  Consultar ↗
                </span>
              </div>
            </div>
          </article>
        ))}

        {/* ficha final */}
        <article className="catalog-card relative flex h-[64vh] w-[80vw] flex-shrink-0 flex-col justify-between overflow-hidden rounded-[3px] border border-kraft-100/15 p-7 md:h-[68vh] md:w-[31vw] md:p-9">
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-stamp-light">
            Fora do catálogo
          </span>
          <div>
            <p className="font-display text-[9vw] leading-[1] md:text-[3.1vw]">
              NÃO ACHOU A LINHA QUE PRECISA?
            </p>
            <p className="mt-4 max-w-sm font-body text-sm text-kraft-100/60">
              Manda a lista no WhatsApp que a gente confere disponibilidade e volume.
            </p>
            <a
              href="https://wa.me/5542998330224"
              target="_blank"
              rel="noreferrer"
              data-cursor="Falar"
              className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden border border-stamp px-6 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.15em] text-stamp-light hover:text-kraft-50"
            >
              <span className="absolute inset-0 -translate-x-full bg-stamp transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0" />
              <span className="relative">(42) 99833-0224</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}
