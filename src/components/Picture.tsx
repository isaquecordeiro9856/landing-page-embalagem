import { useCallback, useState } from 'react'
import { MEDIA_WIDTHS, media, type MediaKey } from '../data/media'

type Props = {
  name: MediaKey
  /** Descritor `sizes` — sempre informe para o browser não baixar a maior largura. */
  sizes: string
  /** Classes do contêiner (aspect-ratio, arredondamento, etc). */
  className?: string
  /** Classes extras da própria imagem (object-position, escala…). */
  imgClassName?: string
  /** true só para a imagem acima da dobra. */
  priority?: boolean
  /** Correção de cor leve que unifica fotos de origens diferentes. */
  grade?: boolean
  alt?: string
}

const srcFor = (name: MediaKey, w: number) => `/img/${name}-${w}.webp`

/**
 * Imagem responsiva com placeholder embutido (LQIP em base64, sem request extra).
 * O blur fica atrás e some quando o arquivo real decodifica — sem salto de layout,
 * porque o contêiner já reserva a proporção.
 */
export default function Picture({
  name,
  sizes,
  className = '',
  imgClassName = '',
  priority = false,
  grade = false,
  alt,
}: Props) {
  const entry = media[name]
  const [loaded, setLoaded] = useState(false)

  // imagem em cache pode terminar antes do React ligar o onLoad
  const attach = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete) setLoaded(true)
  }, [])

  return (
    <div className={`relative overflow-hidden bg-ink-800 ${className}`}>
      <img
        src={entry.lqip}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover blur-lg"
      />
      <img
        ref={attach}
        src={srcFor(name, 1024)}
        srcSet={MEDIA_WIDTHS.map((w) => `${srcFor(name, w)} ${w}w`).join(', ')}
        sizes={sizes}
        alt={alt ?? entry.alt}
        loading={priority ? 'eager' : 'lazy'}
        // React 18 não reconhece fetchPriority em camelCase; vai como atributo cru
        {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : null)}
        data-hero={priority ? '' : undefined}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        // a imagem prioritária não faz fade: atrasar a pintura atrasaria o LCP
        className={`absolute inset-0 h-full w-full object-cover ${
          priority ? '' : `transition-opacity duration-[900ms] ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`
        } ${grade ? 'img-grade' : ''} ${imgClassName}`}
      />
      {grade && (
        <span className="pointer-events-none absolute inset-0 bg-stamp/[0.07] mix-blend-soft-light" />
      )}
    </div>
  )
}
