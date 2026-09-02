import { useEffect, useRef, useState } from 'react'

/**
 * Marca `true` na primeira vez que o elemento chega perto do viewport e não
 * volta atrás — serve para adiar a montagem de mídia pesada sem remontá-la.
 */
export function useInView<T extends HTMLElement>(margin = '40%') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin, seen])

  return [ref, seen] as const
}
