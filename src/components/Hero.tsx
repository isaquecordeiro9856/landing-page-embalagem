import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Picture from './Picture'
import { useMagnetic } from '../lib/useMagnetic'
import { deviceTier, reducedMotion } from '../lib/env'

const HeroScene = lazy(() => import('./scene/HeroScene'))

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const plate = useRef<HTMLDivElement>(null)
  const veil = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.3)

  // 3D só entra em desktop capaz e depois do primeiro paint da foto
  const [scene, setScene] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    if (reducedMotion() || deviceTier() !== 'high') return
    const id = window.setTimeout(() => setScene(true), 400)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from('.hero-meta', { opacity: 0, y: -12, duration: 0.7, ease: 'power2.out', stagger: 0.08 })
        .from('.hero-line', { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, '-=0.5')
        .from(
          '.hero-fade',
          { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', stagger: 0.07 },
          '-=0.85',
        )
        .from('.hero-rule', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, '-=0.85')

      // uma única timeline/ScrollTrigger para o pin: várias instâncias no mesmo
      // elemento pinado faziam o GSAP contar o espaçador do pin em dobro e o
      // scrub "sumia" (ficava travado no valor inicial até o fim do pin)
      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = self.progress
          },
        },
      })

      // apenas transform/opacity no scrub: nada de blur em tela cheia
      scrub
        .fromTo(plate.current, { scale: 1.04, yPercent: 0 }, { scale: 1.5, yPercent: -9, ease: 'none', duration: 1 }, 0)
        .fromTo(veil.current, { opacity: 1 }, { opacity: 0.35, ease: 'none', duration: 0.55 }, 0)
        .to(content.current, { opacity: 0, yPercent: -16, ease: 'none', duration: 0.77 }, 0.18)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <section ref={pin} className="relative h-[100svh] overflow-hidden bg-[#0d0b09] text-kraft-50">
        {/* ambiente: foto real da fachada da loja */}
        <div ref={plate} className="absolute inset-0 will-change-transform">
          <Picture
            name="loja-fachada"
            sizes="100vw"
            priority
            className="h-full w-full"
            imgClassName="img-warm object-[50%_38%]"
          />
        </div>

        {/* peça 3D composta sobre a foto, na metade direita do quadro */}
        <div
          className="pointer-events-none absolute -bottom-[3%] right-[2%] z-[4] hidden h-[58%] w-[38%] transition-opacity duration-1000 [filter:saturate(0.84)_brightness(0.94)] md:block"
          style={{ opacity: sceneReady ? 1 : 0 }}
          aria-hidden
        >
          {scene && (
            <Suspense fallback={null}>
              <HeroScene progress={progress} high onReady={() => setSceneReady(true)} />
            </Suspense>
          )}
          {/* derrete o corte inferior do canvas no piso escuro da foto */}
          <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d0b09]/85 to-transparent" />
        </div>

        {/* legibilidade: escurece a esquerda e o rodapé sem apagar a foto; clareia ao rolar */}
        <div ref={veil} className="pointer-events-none absolute inset-0 z-[5]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09] via-[#0d0b09]/25 to-[#0d0b09]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b09] via-[#0d0b09]/45 to-transparent md:via-[#0d0b09]/20" />
          <div className="absolute inset-0 bg-[radial-gradient(130%_95%_at_55%_45%,transparent_38%,rgba(13,11,9,0.82)_100%)]" />
        </div>
        <div className="noise-overlay pointer-events-none absolute inset-0 z-[6]" />

        <div
          ref={content}
          className="relative z-10 flex h-full flex-col justify-between py-24 md:py-20"
        >
          <div className="container-page flex items-start justify-between font-body text-[10px] uppercase tracking-[0.3em] text-kraft-100/45 md:text-[11px]">
            <span className="hero-meta max-w-[9rem] leading-relaxed md:max-w-none">
              Atacado de embalagens
            </span>
            <span className="hero-meta hidden leading-relaxed md:block">
              Av. Antonio Losso, 1226 — Conradinho
            </span>
            <span className="hero-meta text-right leading-relaxed">
              Guarapuava
              <br className="md:hidden" /> — PR
            </span>
          </div>

          <div className="container-page">
            <div className="max-w-[42rem]">
              <h1 className="font-display text-[16vw] leading-[0.95] md:text-[7.2vw] md:leading-[0.94]">
                <span className="reveal-mask">
                  <span className="hero-line block">EMBALAGEM</span>
                </span>
                <span className="reveal-mask">
                  <span className="hero-line block">
                    NO <span className="text-stamp-light">ATACADO,</span>
                  </span>
                </span>
                <span className="reveal-mask">
                  <span className="hero-line block text-outline text-kraft-50">SEM ROLEIO.</span>
                </span>
              </h1>

              <div className="mt-8 flex flex-col items-start gap-6 md:mt-9 md:flex-row md:items-end">
                <p className="hero-fade max-w-xs font-body text-sm leading-relaxed text-kraft-100/70 md:text-base">
                  Loja física com estoque completo, variedade de linhas e preço de atacado para
                  quem revende, produz ou serve em Guarapuava e região.
                </p>
                <a
                  ref={ctaRef}
                  href="https://wa.me/5542998330224"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Falar"
                  className="hero-fade group relative inline-flex shrink-0 items-center gap-3 overflow-hidden border border-kraft-50/25 px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.15em]"
                >
                  <span className="absolute inset-0 -translate-y-full bg-stamp transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />
                  <span className="relative">(42) 99833-0224</span>
                  <span className="relative">→</span>
                </a>
              </div>
            </div>

            <div className="hero-rule mt-10 h-px w-full origin-left bg-kraft-50/15" />

            <div className="mt-4 flex items-center justify-between font-body text-[10px] uppercase tracking-[0.3em] text-kraft-100/40">
              <span className="hero-fade">01 — Loja</span>
              <span className="hero-fade flex items-center gap-3">
                Role para entrar
                <span className="block h-8 w-px overflow-hidden bg-kraft-100/20">
                  <span className="block h-full w-full origin-top animate-[scroll-cue_1.9s_ease-in-out_infinite] bg-stamp-light" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
