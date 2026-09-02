export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/** low = celular/GPU fraca, high = desktop. Decide dpr, sombras e post-fx. */
export function deviceTier(): 'low' | 'high' {
  if (typeof window === 'undefined') return 'low'
  const cores = navigator.hardwareConcurrency ?? 4
  if (window.innerWidth < 900 || cores <= 2 || isTouch()) return 'low'
  return 'high'
}
