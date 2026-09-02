import type { MediaKey } from './media'

export type Category = {
  id: string
  label: string
  short: string
  desc: string
  /** Foto do palco das linhas (fundo escuro, formato retrato). */
  stage: MediaKey
  /** Foto da ficha no catálogo horizontal. */
  card: MediaKey
  /** Itens da linha — atualizar quando o catálogo oficial for enviado. */
  items: string[]
}

export const categories: Category[] = [
  {
    id: 'sacolas',
    label: 'Sacolas & Sacos',
    short: 'Sacolas',
    desc: 'Papel, plástico e reforçadas',
    stage: 'linha-sacolas',
    card: 'ficha-sacolas',
    items: ['Sacola kraft com alça', 'Sacola plástica reforçada', 'Saco de lixo', 'Saco picotado'],
  },
  {
    id: 'descartaveis',
    label: 'Descartáveis',
    short: 'Descartáveis',
    desc: 'Potes, copos e talheres',
    stage: 'linha-descartaveis',
    card: 'ficha-descartaveis',
    items: ['Copos descartáveis', 'Potes com tampa', 'Talheres', 'Pratos e bandejas'],
  },
  {
    id: 'filmes',
    label: 'Filmes & Papéis',
    short: 'Filmes',
    desc: 'PVC, alumínio e kraft',
    stage: 'linha-filmes',
    card: 'ficha-filmes',
    items: ['Filme PVC', 'Papel alumínio', 'Papel kraft', 'Filme stretch'],
  },
  {
    id: 'fitas',
    label: 'Fitas & Adesivos',
    short: 'Fitas',
    desc: 'Adesivas, crepe e dupla face',
    stage: 'linha-fitas',
    card: 'ficha-fitas',
    items: ['Fita adesiva', 'Fita crepe', 'Fita dupla face', 'Fita de empacotamento'],
  },
  {
    id: 'delivery',
    label: 'Embalagens Delivery',
    short: 'Delivery',
    desc: 'Marmitas, potes e caixas',
    stage: 'linha-delivery',
    card: 'ficha-delivery',
    items: ['Marmita de alumínio', 'Embalagem térmica', 'Caixa para delivery', 'Pote para sopa'],
  },
]
