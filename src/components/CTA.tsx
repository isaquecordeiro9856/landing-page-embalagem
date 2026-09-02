import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../lib/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const root = useRef<HTMLDivElement>(null)
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-line', {
        yPercent: 115,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      })
      gsap.from('.cta-reveal', {
        opacity: 0,
        y: 22,
        duration: 0.85,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: 'top 68%' },
      })
      gsap.from('.cta-tape', {
        scaleX: 0,
        duration: 1.2,
        ease: 'power4.inOut',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contato"
      ref={root}
      className="noise-overlay relative overflow-hidden bg-stamp py-20 text-kraft-50 md:py-24"
    >
      {/* fitas de lacre como motivo gráfico */}
      <div className="cta-tape absolute -left-10 top-14 h-9 w-64 origin-left rotate-[-8deg] bg-ink-900/85" />
      <div className="cta-tape absolute -left-24 bottom-14 h-9 w-72 origin-left rotate-[7deg] bg-ink-900/85" />

      <div className="container-page relative">
        <div className="flex items-center justify-between font-body text-[11px] font-semibold uppercase tracking-[0.32em] text-ink-900/55">
          <span className="cta-reveal">07 — Contato</span>
          <span className="cta-reveal hidden md:block">Guarapuava — PR</span>
        </div>

        <h2 className="mt-8 font-display text-[15vw] leading-[0.85] md:text-[8vw]">
          <span className="reveal-mask">
            <span className="cta-line block">VAMOS FECHAR</span>
          </span>
          <span className="reveal-mask">
            <span className="cta-line block text-outline text-kraft-50">O PEDIDO?</span>
          </span>
        </h2>

        <div className="mt-12 grid gap-10 border-t border-ink-900/20 pt-9 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-8 sm:grid-cols-2 md:max-w-2xl">
            <p className="cta-reveal font-body text-base leading-relaxed text-kraft-50/85">
              Manda a lista de itens e o volume que você precisa. Respondemos com disponibilidade e
              preço de atacado.
            </p>
            <div className="cta-reveal font-body text-sm leading-relaxed">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-900/55">
                Onde estamos
              </span>
              <p className="mt-2 text-kraft-50/85">
                Av. Antonio Losso, 1226 — Conradinho
                <br />
                Guarapuava — Paraná
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Antonio+Losso,+1226,+Conradinho,+Guarapuava+-+PR"
                target="_blank"
                rel="noreferrer"
                data-cursor="Mapa"
                className="group mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-900/70 transition-colors hover:text-ink-900"
              >
                Ver no mapa
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <a
            ref={ctaRef}
            href="https://wa.me/5542998330224"
            target="_blank"
            rel="noreferrer"
            data-cursor="WhatsApp"
            className="cta-reveal group relative inline-flex w-fit items-center gap-4 overflow-hidden bg-ink-900 px-8 py-5 font-display text-[9vw] leading-none tracking-wide text-kraft-50 md:text-[3.4vw]"
          >
            <span className="absolute inset-0 -translate-y-full bg-kraft-50 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-500 group-hover:text-ink-900">
              (42) 99833-0224
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
