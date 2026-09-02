import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from './Picture'
import type { MediaKey } from '../data/media'

gsap.registerPlugin(ScrollTrigger)

const items: { n: string; title: string; desc: string; tag: string; photo: MediaKey }[] = [
  {
    n: '01',
    title: 'Preço de atacado',
    desc: 'Volume competitivo para quem revende, produz ou presta serviço.',
    tag: 'Volume',
    photo: 'dif-volume',
  },
  {
    n: '02',
    title: 'Direto de Guarapuava',
    desc: 'Localização estratégica na região, com atendimento próximo e sem intermediário.',
    tag: 'Região',
    photo: 'dif-regiao',
  },
  {
    n: '03',
    title: 'Variedade de linhas',
    desc: 'Sacola, descartável, filme, fita e delivery no mesmo fornecedor.',
    tag: 'Catálogo',
    photo: 'dif-linhas',
  },
  {
    n: '04',
    title: 'Atendimento direto',
    desc: 'Contato rápido pelo WhatsApp para orçamento e disponibilidade.',
    tag: 'Contato',
    photo: 'dif-atendimento',
  },
]

export default function Differentials() {
  const root = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const shadeRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current
      const total = cards.length

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (total - 1) * 1.1}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        onUpdate: (self) => {
          const raw = self.progress * (total - 1)
          cards.forEach((card, i) => {
            const diff = raw - i
            // diff < 0: ainda abaixo da dobra | diff > 0: já coberta pela próxima
            const y = gsap.utils.clamp(0, 108, -diff * 108)
            const scale = diff > 0 ? gsap.utils.clamp(0.86, 1, 1 - diff * 0.075) : 1
            const rot = diff > 0 ? gsap.utils.clamp(-2, 0, -diff * 1) : 0
            // só transform no cartão; o escurecimento vai numa camada composta
            gsap.set(card, { yPercent: y, scale, rotate: rot })
            gsap.set(shadeRef.current[i], {
              opacity: diff > 0 ? gsap.utils.clamp(0, 0.7, diff * 0.55) : 0,
            })
          })
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-kraft-50">
      <div className="container-page absolute left-0 right-0 top-12 z-20 md:top-16">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.32em] text-stamp">
          05 — Diferenciais
        </span>
        <h2 className="mt-3 font-display text-[11vw] leading-[0.92] text-ink-900 md:text-[4.4vw]">
          POR QUE COMPRAR AQUI
        </h2>
      </div>

      {items.map((item, i) => (
        <div
          key={item.n}
          ref={(el) => {
            if (el) cardsRef.current[i] = el
          }}
          className="absolute inset-0 flex items-center pt-24 will-change-transform md:pt-20"
          style={{ zIndex: 10 + i }}
        >
          <div className="container-page w-full">
            <div className="relative grid overflow-hidden rounded-[3px] bg-ink-900 text-kraft-50 shadow-[0_40px_80px_-40px_rgba(20,18,16,0.7)] md:min-h-[62vh] md:grid-cols-[1fr_44%]">
              {/* lado tipográfico */}
              <div className="noise-overlay relative flex flex-col justify-between px-7 py-8 md:px-12 md:py-12">
                <span className="text-outline pointer-events-none absolute right-[3%] top-1/2 z-0 hidden -translate-y-1/2 font-display leading-none text-kraft-50/25 md:block md:text-[13vw]">
                  {item.n}
                </span>

                <div className="relative z-20 flex items-start justify-between">
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-stamp-light">
                    {item.tag}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-[0.3em] text-kraft-50/60 md:hidden">
                    {item.n} / 04
                  </span>
                </div>

                <div className="relative z-20 mt-8 md:mt-10">
                  <h3 className="font-display text-[9.5vw] leading-[0.98] md:text-[3.6vw]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md font-body text-[15px] leading-relaxed text-kraft-100/70 md:text-base">
                    {item.desc}
                  </p>
                  <div className="mt-6 flex items-center gap-4 md:mt-7">
                    <span className="h-px w-16 bg-stamp" />
                    <span className="font-body text-[10px] uppercase tracking-[0.28em] text-kraft-100/45">
                      Disk Atacado Embalagens
                    </span>
                  </div>
                </div>
              </div>

              {/* lado fotográfico */}
              <div className="relative h-[24vh] md:h-auto">
                <Picture
                  name={item.photo}
                  sizes="(min-width: 768px) 44vw, 100vw"
                  grade
                  className="absolute inset-0 h-full w-full"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/25 to-transparent md:via-ink-900/10" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/50 to-transparent md:from-ink-900/20" />
                <span className="absolute -right-14 top-8 h-11 w-64 rotate-[-16deg] bg-stamp/90" />
                <span className="absolute right-6 top-9 z-10 hidden font-body text-[10px] uppercase tracking-[0.3em] text-kraft-50/90 md:block">
                  {item.n} / 04
                </span>
              </div>

              <div className="pointer-events-none absolute inset-4 z-10 border border-kraft-50/10" />

              {/* camada de escurecimento quando o cartão é coberto pelo próximo */}
              <span
                ref={(el) => {
                  if (el) shadeRef.current[i] = el
                }}
                className="pointer-events-none absolute inset-0 z-30 bg-ink-900 opacity-0"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
