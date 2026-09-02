import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StampBadge from './StampBadge'

gsap.registerPlugin(ScrollTrigger)

const text =
  'Somos o ponto de atacado de embalagens de Guarapuava: variedade de linhas, disponibilidade imediata e atendimento que entende o volume de quem revende, produz ou serve.'

const meta = [
  { k: 'Endereço', v: 'Av. Antonio Losso, 1226\nConradinho' },
  { k: 'Cidade', v: 'Guarapuava\nParaná' },
  { k: 'Contato', v: '(42) 99833-0224\nWhatsApp' },
]

export default function Brand() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.brand-word', {
        opacity: 0.1,
        stagger: 0.02,
        ease: 'none',
        scrollTrigger: { trigger: '.brand-text', start: 'top 82%', end: 'bottom 55%', scrub: true },
      })

      gsap.from('.brand-badge', {
        scale: 0.5,
        rotate: -60,
        opacity: 0,
        duration: 1.1,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })

      gsap.to('.brand-watermark', {
        xPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })

      gsap.from('.brand-meta', {
        opacity: 0,
        y: 22,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.brand-metarow', start: 'top 88%' },
      })

      gsap.from('.brand-rule', {
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.brand-metarow', start: 'top 92%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="paper-kraft relative overflow-hidden bg-kraft-100 py-24 md:py-32"
    >
      <span className="brand-watermark text-outline pointer-events-none absolute -top-6 left-0 whitespace-nowrap font-display text-[24vw] leading-none text-ink-900/[0.07] md:text-[15vw]">
        ATACADO ATACADO
      </span>

      <div className="container-page relative">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start md:gap-16">
          <div className="brand-badge shrink-0 text-stamp md:sticky md:top-28">
            <StampBadge className="h-28 w-28 md:h-40 md:w-40" />
          </div>

          <p className="brand-text font-display text-[7.5vw] leading-[1.06] text-ink-900 md:text-[3.5vw] md:leading-[1.1]">
            {text.split(' ').map((word, i) => (
              <span key={i} className="brand-word mr-[0.28em] inline-block">
                {word}
              </span>
            ))}
          </p>
        </div>

        <div className="brand-metarow mt-16 md:mt-24">
          <div className="brand-rule h-px w-full origin-left bg-ink-900/15" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 pt-7 md:grid-cols-4">
            {meta.map((mi) => (
              <div key={mi.k} className="brand-meta">
                <span className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-stamp">
                  {mi.k}
                </span>
                <p className="mt-2 whitespace-pre-line font-body text-sm leading-relaxed text-ink-900/70">
                  {mi.v}
                </p>
              </div>
            ))}
            <div className="brand-meta col-span-2 md:col-span-1">
              <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-stamp">
                Atendimento
              </span>
              <a
                href="https://wa.me/5542998330224"
                target="_blank"
                rel="noreferrer"
                data-cursor="Falar"
                className="group mt-2 inline-flex items-center gap-2 font-display text-xl text-ink-900 transition-colors hover:text-stamp md:text-2xl"
              >
                Chamar agora
                <span className="transition-transform duration-500 group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
