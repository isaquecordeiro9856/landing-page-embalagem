import { useMagnetic } from '../lib/useMagnetic'
import { categories } from '../data/categories'

export default function Footer() {
  const topRef = useMagnetic<HTMLAnchorElement>(0.3)

  return (
    <footer className="relative overflow-hidden bg-ink-900 pb-10 pt-20 text-kraft-100/55">
      <div className="container-page grid gap-10 border-b border-kraft-100/10 pb-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-2xl text-kraft-50">
            DISK ATACADO<span className="text-stamp">.</span>
          </span>
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed">
            Comércio atacadista de embalagens em Guarapuava — Paraná.
          </p>
        </div>

        <div>
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-stamp-light">
            Linhas
          </span>
          <ul className="mt-4 space-y-1.5 font-body text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <a href="#produtos" data-cursor="Ver" className="transition-colors hover:text-kraft-50">
                  {c.short}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-stamp-light">
            Contato
          </span>
          <ul className="mt-4 space-y-1.5 font-body text-sm">
            <li>
              <a
                href="https://wa.me/5542998330224"
                target="_blank"
                rel="noreferrer"
                data-cursor="WhatsApp"
                className="transition-colors hover:text-kraft-50"
              >
                (42) 99833-0224
              </a>
            </li>
            <li>Av. Antonio Losso, 1226</li>
            <li>Conradinho — Guarapuava/PR</li>
          </ul>
        </div>
      </div>

      <div className="container-page mt-10">
        <span className="block whitespace-nowrap font-display text-[17vw] leading-[0.8] text-kraft-50/[0.055] md:text-[10.5vw]">
          EMBALAGENS
        </span>
      </div>

      <div className="container-page mt-8 flex flex-col items-start justify-between gap-4 font-body text-[11px] uppercase tracking-[0.2em] text-kraft-100/35 md:flex-row md:items-center">
        <span>
          © {new Date().getFullYear()} Disk Atacado Embalagens
          <span className="ml-3 hidden normal-case tracking-normal text-kraft-100/25 md:inline">
            Imagens de referência: Pexels
          </span>
        </span>
        <a
          ref={topRef}
          href="#top"
          data-cursor="Topo"
          className="inline-flex items-center gap-2 transition-colors hover:text-stamp-light"
        >
          Voltar ao topo ↑
        </a>
      </div>
    </footer>
  )
}
