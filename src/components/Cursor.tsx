import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const [touch, setTouch] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setTouch(true)
      return
    }

    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' })

    let first = true
    function onMove(e: MouseEvent) {
      if (first) {
        first = false
        gsap.set([ring.current, dot.current], { x: e.clientX, y: e.clientY })
        setReady(true)
      }
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }

    function onOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null
      if (target) {
        setActive(true)
        setLabel(target.dataset.cursor || '')
      } else {
        setActive(false)
        setLabel('')
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  if (touch) return null

  return (
    <>
      <div
        ref={dot}
        style={{ opacity: ready ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stamp-light mix-blend-difference"
      />
      <div
        ref={ring}
        className={`pointer-events-none fixed left-0 top-0 z-[998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-kraft-50 mix-blend-difference transition-[width,height,opacity] duration-300 ease-out ${
          !ready ? 'h-9 w-9 opacity-0' : active ? 'h-20 w-20 opacity-100' : 'h-9 w-9 opacity-60'
        }`}
      >
        <span
          className={`flex h-full w-full items-center justify-center text-center font-body text-[10px] font-semibold uppercase tracking-wider text-kraft-50 transition-opacity duration-200 ${
            active && label ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {label}
        </span>
      </div>
    </>
  )
}
