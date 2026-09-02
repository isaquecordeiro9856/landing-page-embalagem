import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from './Picture'
import { categories } from '../data/categories'
import type { MediaKey } from '../data/media'
import { reducedMotion } from '../lib/env'

gsap.registerPlugin(ScrollTrigger)

type Shot = { name: MediaKey; caption: string; ratio: string }

/** Três colunas com velocidades diferentes: profundidade sem 3D. */
const columns: { speed: number; offset: string; shots: Shot[] }[] = [
  {
    speed: -7,
    offset: 'md:mt-0',
    shots: [
      { name: 'uso-confeitaria', caption: 'Confeitaria', ratio: 'aspect-[4/5]' },
      { name: 'uso-sacola', caption: 'Varejo', ratio: 'aspect-[3/4]' },
      { name: 'uso-galpao', caption: 'Estoque', ratio: 'aspect-[4/3]' },
    ],
  },
  {
    speed: -14,
    offset: 'md:mt-14',
    shots: [
      { name: 'uso-potes', caption: 'Balcão', ratio: 'aspect-[3/4]' },
      { name: 'uso-bolo', caption: 'Padaria', ratio: 'aspect-[4/3]' },
      { name: 'uso-separacao', caption: 'Separação', ratio: 'aspect-[4/5]' },
    ],
  },
  {
    speed: -3,
    offset: 'md:mt-28',
    shots: [
      { name: 'uso-copos', caption: 'Cafeteria', ratio: 'aspect-[3/4]' },
      { name: 'ficha-delivery', caption: 'Delivery', ratio: 'aspect-[3/4]' },
    ],
  },
]

export default function Showcase() {
  const section = useRef<HTMLDivElement>(null)
  const cols = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.showcase-line', {
        yPercent: 115,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: section.current, start: 'top 70%' },
      })

      gsap.from('.showcase-fade', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: section.current, start: 'top 60%' },
      })

      gsap.utils.toArray<HTMLElement>('.showcase-shot').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          yPercent: 14,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        })
      })

      if (!reducedMotion() && window.innerWidth >= 768) {
        cols.current.filter(Boolean).forEach((el, i) => {
          gsap.to(el, {
            yPercent: columns[i].speed,
            ease: 'none',
            scrollTrigger: {
              trigger: '.showcase-grid',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          })
        })
      }

      gsap.to('.showcase-marquee', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const ticker = [...categories.map((c) => c.short), 'Atacado', 'Guarapuava']

  return (
    <section ref={section} className="relative overflow-hidden bg-ink-900 pt-24 text-kraft-50">
      <div className="container-page relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="showcase-fade font-body text-[11px] font-semibold uppercase tracking-[0.32em] text-stamp-light">
              06 — Na prática
            </span>
            <h2 className="mt-4 font-display text-[13vw] leading-[0.95] md:text-[6vw] md:leading-[0.92]">
              <span className="reveal-mask">
                <span className="showcase-line block">MUITAS LINHAS.</span>
              </span>
              <span className="reveal-mask">
                <span className="showcase-line block text-outline text-kraft-50">
                  UM SÓ FORNECEDOR.
                </span>
              </span>
            </h2>
          </div>
          <p className="showcase-fade max-w-xs font-body text-sm leading-relaxed text-kraft-100/60">
            Sacola, descartável, filme, fita e delivery saindo do mesmo balcão — atendendo padaria,
            lanchonete, mercado e quem revende.
          </p>
        </div>

        {/* mosaico fotográfico com parallax por coluna */}
        <div className="showcase-grid mt-16 grid grid-cols-2 gap-4 md:mt-24 md:grid-cols-3 md:gap-6">
          {columns.map((col, ci) => (
            <div
              key={ci}
              ref={(el) => {
                if (el) cols.current[ci] = el
              }}
              className={`flex flex-col gap-4 will-change-transform md:gap-6 ${col.offset} ${
                ci === 2 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              {col.shots.map((s) => (
                <figure key={s.name} className="showcase-shot group relative">
                  <Picture
                    name={s.name}
                    sizes="(min-width: 768px) 31vw, 50vw"
                    grade
                    className={`w-full rounded-sm ${s.ratio}`}
                    imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink-900/85 to-transparent p-4 font-body text-[10px] uppercase tracking-[0.26em] text-kraft-100/75">
                    {s.caption}
                    <span className="h-1 w-1 rotate-45 bg-stamp-light" />
                  </figcaption>
                </figure>
              ))}

              {/* fecha a coluna curta com um bloco de texto no lugar de mais uma foto */}
              {ci === 2 && (
                <div className="showcase-shot paper-kraft flex flex-1 flex-col justify-between rounded-sm bg-kraft-100 p-6 text-ink-900 md:min-h-[16rem]">
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-stamp">
                    Um fornecedor
                  </span>
                  <div className="mt-8">
                    <p className="font-display text-[9vw] leading-[1] md:text-[2.5vw]">
                      5 LINHAS
                      <br />
                      UM PEDIDO SÓ
                    </p>
                    <a
                      href="https://wa.me/5542998330224"
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="Falar"
                      className="group mt-5 inline-flex items-center gap-2 border-b border-ink-900/25 pb-1 font-body text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-stamp hover:text-stamp"
                    >
                      Montar meu pedido
                      <span className="transition-transform duration-500 group-hover:translate-x-1">
                        ↗
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-20 overflow-hidden whitespace-nowrap border-y border-kraft-100/10 py-4 md:mt-28">
        <div className="showcase-marquee flex w-max gap-10 font-display text-3xl uppercase text-kraft-100/20 md:text-5xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex items-center gap-10">
              {ticker.map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t}
                  <span className="h-2 w-2 rotate-45 bg-stamp/60" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
