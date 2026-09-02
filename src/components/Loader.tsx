import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const MIN_MS = 420
const MAX_MS = 2400

/** Espera a foto do hero (marcada com data-hero) decodificar. */
function heroReady() {
  return new Promise<void>((resolve) => {
    const find = () => {
      const img = document.querySelector<HTMLImageElement>('img[data-hero]')
      if (!img) return requestAnimationFrame(find)
      if (img.complete) return resolve()
      img.addEventListener('load', () => resolve(), { once: true })
      img.addEventListener('error', () => resolve(), { once: true })
    }
    find()
  })
}

/**
 * Cortina de entrada atada ao que realmente importa: fonte de display e foto
 * do hero. Sem espera artificial — se vier do cache, abre quase imediato.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    let target = 0.85
    let value = 0

    const tick = () => {
      // aproximação assintótica: a barra nunca "trava" nem estoura
      value += (target - value) * 0.08
      setPct(Math.min(100, Math.round(value * 100)))
      if (value < 0.999) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const fonts = document.fonts?.ready ?? Promise.resolve()
    const timeout = new Promise<void>((r) => window.setTimeout(r, MAX_MS))

    Promise.race([Promise.all([fonts, heroReady()]).then(() => undefined), timeout]).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start))
      window.setTimeout(() => {
        target = 1
        const tl = gsap.timeline({ onComplete: () => setDone(true) })
        tl.to('.loader-count', { opacity: 0, duration: 0.3, delay: 0.18 }).to(
          root.current,
          { yPercent: -100, duration: 0.95, ease: 'expo.inOut' },
          '-=0.05',
        )
      }, wait)
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  if (done) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[900] flex flex-col justify-between bg-[#0d0b09] px-6 py-8 text-kraft-50 md:px-12"
    >
      <div className="flex items-start justify-between font-body text-[10px] uppercase tracking-[0.3em] text-kraft-100/40">
        <span>Disk Atacado Embalagens</span>
        <span className="hidden md:block">Guarapuava — PR</span>
      </div>

      <div className="loader-count flex items-end justify-between">
        <span className="font-display text-[18vw] leading-[0.8] md:text-[9vw]">
          {String(pct).padStart(3, '0')}
        </span>
        <span className="mb-3 font-body text-[10px] uppercase tracking-[0.3em] text-kraft-100/40">
          Abrindo a loja
        </span>
      </div>

      <div className="h-px w-full bg-kraft-100/15">
        <div
          className="loader-bar h-px origin-left bg-stamp"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
    </div>
  )
}
