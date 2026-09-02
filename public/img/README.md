# Imagens

Fotografias de referência licenciadas para uso comercial livre (Pexels).
Cada foto existe em três larguras servidas por `srcset`:

```
<slug>-640.webp   <slug>-1024.webp   <slug>-1600.webp
```

O componente [`src/components/Picture.tsx`](../../src/components/Picture.tsx) monta o
`srcset` a partir de `MEDIA_WIDTHS` e o placeholder desfocado (`lqip`) vem embutido
em [`src/data/media.ts`](../../src/data/media.ts) — nenhum request extra.

## Trocar por fotos reais da loja

1. Exporte a foto em WebP nas três larguras (640, 1024 e 1600 px de largura).
2. Substitua os arquivos mantendo **exatamente** os mesmos nomes.
3. Atualize em `src/data/media.ts` o `alt` do slug e, se possível, o `lqip`
   (um WebP de ~20 px de largura em base64 — pode ser gerado em qualquer
   conversor; se ficar o antigo, só o desfoque inicial fica com a cor errada).

Slugs em uso e onde aparecem:

| slug | seção |
| --- | --- |
| `loja-fachada` | Hero (foto real da fachada da loja, pré-carregada) |
| `estoque-pallets`, `estoque-prateleira`, `lacre-fita`, `balcao-entrega` | Operação (sequência de 4 etapas) |
| `linha-*` | Linhas (palco fotográfico por categoria) |
| `ficha-*` | Catálogo (fichas horizontais) |
| `dif-*` | Diferenciais (cartões empilhados) |
| `uso-*` | Na prática (mosaico com parallax) |

Os slugs `linha-*` e `ficha-*` são referenciados em `src/data/categories.ts`.

## Foto real da loja

`loja-fachada-*.webp` vem da foto real da fachada (Google Maps/perfil do
negócio), em `public/img/real/loja-google-01.webp` (fonte, 680×510 — as
larguras maiores foram escaladas a partir dela). Ao conseguir uma foto de
resolução maior, gere os três tamanhos novamente a partir do original e
substitua os três arquivos `loja-fachada-*.webp`.
