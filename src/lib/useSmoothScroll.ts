import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isTouch, reducedMotion } from './env'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    // no touch o scroll nativo é mais fluido e mais leve; reduced-motion sai fora
    const smooth = !reducedMotion() && !isTouch()

    let lenis: Lenis | null = null
    let raf: ((time: number) => void) | null = null

    if (smooth) {
      lenis = new Lenis({
        // lerp responde na hora ao gesto; duration cria lag perceptível no trackpad
        lerp: 0.11,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
      })

      lenis.on('scroll', ScrollTrigger.update)

      raf = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    // as fotos já reservam proporção, mas fontes e webfonts podem mexer nas medidas
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      if (raf) gsap.ticker.remove(raf)
      lenis?.destroy()
    }
  }, [])
}
