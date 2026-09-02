import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from './Picture'
import { media, type MediaKey } from '../data/media'
import { useInView } from '../lib/useInView'

gsap.registerPlugin(ScrollTrigger)

const steps: { n: string; title: string; desc: string; photo: MediaKey; tag: string }[] = [
  {
    n: '01',
    title: 'Estoque completo',
    desc: 'Pallet completo em prateleira: quem compra volume não espera reposição.',
    photo: 'estoque-pallets',
    tag: 'Volume em estoque',
  },
  {
    n: '02',
    title: 'Linha por linha',
    desc: 'Sacola, descartável, filme, fita e delivery separados e prontos para conferência.',
    photo: 'estoque-prateleira',
    tag: 'Cinco linhas',
  },
  {
    n: '03',
    title: 'Fechado para viagem',
    desc: 'Fita no vinco central, caixa firme e sem folga para o pedido rodar inteiro.',
    photo: 'lacre-fita',
    tag: 'Pedido lacrado',
  },
  {
    n: '04',
    title: 'No seu balcão',
    desc: 'Da nossa loja para o seu balcão — sem depender de cinco fornecedores diferentes.',
    photo: 'balcao-entrega',
    tag: 'Entrega',
  },
]

export default function Flow() {
  const root = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const frames = useRef<HTMLDivElement[]>([])
  const hazes = useRef<HTMLDivElement[]>([])
  const [step, setStep] = useState(0)
  // as fotos só entram na fila de download quando a seção se aproxima
  const [mount, near] = useInView<HTMLDivElement>('50%')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const shots = frames.current.filter(Boolean)
      const haze = hazes.current.filter(Boolean)
      const last = steps.length - 1

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        anticipatePin: 1,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress
          gsap.set(fill.current, { scaleY: p })

          // posição contínua na sequência: crossfade entre os dois quadros vizinhos
          const at = p * last
          shots.forEach((el, i) => {
            const d = Math.min(1, Math.abs(at - i))
            gsap.set(el, { opacity: 1 - d, scale: 1.05 - d * 0.045, zIndex: 10 - Math.round(d * 9) })
            if (haze[i]) gsap.set(haze[i], { opacity: (1 - d) * 0.42 })
          })

          const i = Math.min(last, Math.round(at))
          setStep((prev) => (prev === i ? prev : i))
        },
      })

      gsap.from('.flow-head', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
      gsap.from('.flow-frame', {
        opacity: 0,
        yPercent: 8,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-[#0d0b09] text-kraft-50">
      {/* atmosfera fora de foco: reaproveita o placeholder embutido, custo zero */}
      <div className="absolute inset-0" aria-hidden>
        {steps.map((s, i) => (
          <div
            key={s.n}
            ref={(el) => {
              if (el) hazes.current[i] = el
            }}
            className="absolute inset-0 scale-125 bg-cover bg-center blur-2xl"
            style={{ backgroundImage: `url(${media[s.photo].lqip})`, opacity: i === 0 ? 0.42 : 0 }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,rgba(13,11,9,0.35)_20%,rgba(13,11,9,0.95)_100%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0" />

      <div className="container-page relative flex h-full flex-col justify-center gap-8 py-24 md:grid md:grid-cols-[1fr_minmax(340px,46%)] md:items-center md:gap-14 md:py-0">
        <div className="order-2 md:order-1">
          <div className="flow-head">
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.32em] text-stamp-light">
              02 — Operação
            </span>
            <h2 className="mt-4 max-w-md font-display text-[13vw] leading-[0.95] md:text-[4.4vw]">
              DO CAMINHÃO
              <br />
              AO <span className="text-outline text-kraft-50">BALCÃO</span>
            </h2>
          </div>

          <div className="mt-9 flex gap-6 md:mt-12 md:max-w-md">
            <div className="relative w-px shrink-0 bg-kraft-50/15">
              <div
                ref={fill}
                className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-stamp"
              />
            </div>

            <ol className="flex-1 space-y-1">
              {steps.map((s, i) => {
                const active = step === i
                return (
                  <li
                    key={s.n}
                    className="transition-all duration-500"
                    style={{
                      opacity: active ? 1 : 0.3,
                      transform: `translateX(${active ? 10 : 0}px)`,
                    }}
                  >
                    <div className="flex items-baseline gap-4 py-1.5">
                      <span
                        className={`font-body text-[11px] font-semibold tracking-[0.2em] transition-colors duration-500 ${
                          active ? 'text-stamp-light' : 'text-kraft-100/50'
                        }`}
                      >
                        {s.n}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl leading-none md:text-3xl">
                          {s.title}
                        </h3>
                        <p
                          className="overflow-hidden font-body text-sm leading-relaxed text-kraft-100/70 transition-all duration-500"
                          style={{
                            maxHeight: active ? 92 : 0,
                            opacity: active ? 1 : 0,
                            marginTop: active ? 8 : 0,
                          }}
                        >
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-kraft-50/10 pt-5 font-body text-[11px] uppercase tracking-[0.24em] text-kraft-100/40 md:mt-12 md:max-w-md">
            <span>Av. Antonio Losso, 1226</span>
            <span className="hidden md:inline">·</span>
            <a
              href="https://wa.me/5542998330224"
              target="_blank"
              rel="noreferrer"
              data-cursor="Falar"
              className="group inline-flex items-center gap-2 text-kraft-50 transition-colors hover:text-stamp-light"
            >
              Pedir orçamento
              <span className="transition-transform duration-500 group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </div>

        {/* quadro fotográfico: as etapas trocam dentro da moldura */}
        <div ref={mount} className="flow-frame relative order-1 md:order-2">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink-800 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] md:aspect-[4/5]">
            {steps.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  if (el) frames.current[i] = el
                }}
                className="absolute inset-0 will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 1 }}
              >
                {near && (
                  <Picture
                    name={s.photo}
                    sizes="(min-width: 768px) 46vw, 100vw"
                    grade
                    className="h-full w-full"
                  />
                )}
              </div>
            ))}

            <span className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#0d0b09]/75 via-transparent to-transparent" />
            <span className="pointer-events-none absolute inset-3 z-20 border border-kraft-50/10" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between p-5 font-body text-[10px] uppercase tracking-[0.28em] text-kraft-100/70">
              <span>{steps[step].tag}</span>
              <span className="text-stamp-light">
                {steps[step].n} / 0{steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
