import * as THREE from 'three'

/**
 * Texturas PBR do palete do hero, geradas em canvas.
 * Nada é baixado e nada roda antes da cena 3D montar (o módulo só é
 * importado pelo chunk lazy do hero).
 */

const cache = new Map<string, THREE.Texture>()

function make(
  size: [number, number],
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const c = document.createElement('canvas')
  c.width = size[0]
  c.height = size[1]
  const ctx = c.getContext('2d')!
  draw(ctx, c.width, c.height)
  return c
}

function tex(
  key: string,
  size: [number, number],
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  opts: { color?: boolean; repeat?: [number, number] } = {},
) {
  const hit = cache.get(key)
  if (hit) return hit
  const t = new THREE.CanvasTexture(make(size, draw))
  if (opts.color !== false) t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1])
  t.anisotropy = 4
  cache.set(key, t)
  return t
}

/* ---------- utilidades de pintura ---------- */

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount
    d[i] = Math.min(255, Math.max(0, d[i] + n))
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n))
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
}

function fibers(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  count: number,
  colors: string[],
) {
  for (let i = 0; i < count; i++) {
    ctx.strokeStyle = colors[(Math.random() * colors.length) | 0]
    ctx.globalAlpha = 0.05 + Math.random() * 0.14
    ctx.lineWidth = Math.random() * 1.6 + 0.3
    const x = Math.random() * w
    const y = Math.random() * h
    const len = 6 + Math.random() * 44
    const a = Math.random() * Math.PI
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function flecks(ctx: CanvasRenderingContext2D, w: number, h: number, count: number) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#6b4b28' : '#e8d3ad'
    ctx.globalAlpha = 0.1 + Math.random() * 0.3
    const s = Math.random() * 2.4 + 0.4
    ctx.fillRect(Math.random() * w, Math.random() * h, s, s)
  }
  ctx.globalAlpha = 1
}

/** Texto condensado tipo Anton, desenhado sem depender de webfont carregada. */
function condensed(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  px: number,
  squeeze = 0.82,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(squeeze, 1)
  ctx.font = `900 ${px}px "Arial Black", Impact, Arial, sans-serif`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function spaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  px: number,
  gap: number,
) {
  ctx.save()
  ctx.font = `700 ${px}px Arial, Helvetica, sans-serif`
  ctx.textBaseline = 'alphabetic'
  let cx = x
  for (const ch of text) {
    ctx.fillText(ch, cx, y)
    cx += ctx.measureText(ch).width + gap
  }
  ctx.restore()
}

function kraftBase(ctx: CanvasRenderingContext2D, w: number, h: number, tone = '#c39a67') {
  ctx.fillStyle = tone
  ctx.fillRect(0, 0, w, h)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, 'rgba(255,255,255,0.10)')
  g.addColorStop(0.5, 'rgba(0,0,0,0.00)')
  g.addColorStop(1, 'rgba(80,50,20,0.12)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  fibers(ctx, w, h, 700, ['#8a6234', '#e2c9a0', '#a87c48'])
  flecks(ctx, w, h, 340)
  noise(ctx, w, h, 26)
}

/* ---------- mapas exportados ---------- */

/** Papelão liso (faces sem impressão). */
export const kraftMap = () => tex('kraft', [512, 512], (c, w, h) => kraftBase(c, w, h))

/** Bump do papelão: fibra fina. */
export const kraftBump = () =>
  tex(
    'kraft-bump',
    [512, 512],
    (c, w, h) => {
      c.fillStyle = '#808080'
      c.fillRect(0, 0, w, h)
      fibers(c, w, h, 1100, ['#5c5c5c', '#a8a8a8'])
      noise(c, w, h, 42)
    },
    { color: false },
  )

/** Impressão da caixa: marca, tarja, símbolos de manuseio, código de barras. */
export const printMap = () =>
  tex('print', [1024, 1024], (c, w, h) => {
    kraftBase(c, w, h)

    c.save()
    c.translate(w * 0.78, h * 0.12)
    c.rotate(-0.32)
    c.fillStyle = 'rgba(200,64,29,0.92)'
    c.fillRect(-260, -34, 620, 68)
    c.restore()

    c.strokeStyle = 'rgba(20,18,16,0.78)'
    c.lineWidth = 6
    c.strokeRect(96, 300, w - 192, 300)

    c.fillStyle = 'rgba(20,18,16,0.86)'
    condensed(c, 'DISK ATACADO', 132, 440, 118)
    c.fillStyle = 'rgba(200,64,29,0.95)'
    spaced(c, 'EMBALAGENS', 138, 522, 40, 12)

    c.fillStyle = 'rgba(20,18,16,0.55)'
    spaced(c, 'GUARAPUAVA - PR   (42) 99833-0224', 138, 572, 22, 3)

    c.strokeStyle = 'rgba(20,18,16,0.6)'
    c.lineWidth = 5
    for (let i = 0; i < 2; i++) {
      const x = 140 + i * 110
      const y = 730
      c.beginPath()
      c.moveTo(x, y + 60)
      c.lineTo(x, y - 20)
      c.moveTo(x - 26, y + 6)
      c.lineTo(x, y - 24)
      c.lineTo(x + 26, y + 6)
      c.stroke()
    }
    c.fillStyle = 'rgba(20,18,16,0.5)'
    spaced(c, 'ESTE LADO PARA CIMA', 140, 840, 20, 2)

    let bx = w - 330
    c.fillStyle = 'rgba(20,18,16,0.8)'
    for (let i = 0; i < 46; i++) {
      const bw = 1 + Math.random() * 5
      c.fillRect(bx, 700, bw, 120)
      bx += bw + 2 + Math.random() * 3
    }
    c.fillStyle = 'rgba(20,18,16,0.6)'
    spaced(c, 'LOTE 0824', w - 330, 856, 20, 3)

    c.strokeStyle = 'rgba(20,18,16,0.18)'
    c.lineWidth = 3
    c.strokeRect(60, 60, w - 120, h - 120)
  })

/** Fita adesiva com marca repetida. */
export const tapeMap = () =>
  tex(
    'tape',
    [512, 128],
    (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#a8331a')
      g.addColorStop(0.5, '#c8401d')
      g.addColorStop(1, '#8d2a14')
      c.fillStyle = g
      c.fillRect(0, 0, w, h)
      c.fillStyle = 'rgba(247,241,230,0.92)'
      spaced(c, 'DISK ATACADO  ·  EMBALAGENS  ·', 14, 82, 34, 4)
      noise(c, w, h, 14)
    },
    { repeat: [3, 1] },
  )

/** Onda do papelão (miolo) para as bordas cortadas. */
export const fluteMap = () =>
  tex('flute', [256, 64], (c, w, h) => {
    c.fillStyle = '#b98a58'
    c.fillRect(0, 0, w, h)
    const n = 26
    for (let i = 0; i < n; i++) {
      const x = (i / n) * w
      const g = c.createLinearGradient(x, 0, x + w / n, 0)
      g.addColorStop(0, '#7d5731')
      g.addColorStop(0.45, '#d6ad7e')
      g.addColorStop(1, '#7d5731')
      c.fillStyle = g
      c.fillRect(x, 0, w / n + 1, h)
    }
    c.fillStyle = 'rgba(60,40,20,0.55)'
    c.fillRect(0, 0, w, 5)
    c.fillRect(0, h - 5, w, 5)
    noise(c, w, h, 16)
  })
