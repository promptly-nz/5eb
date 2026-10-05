// Shop catalogue. Every product is a real photograph (cut out, see CREDITS below), not drawn art.
// Garments are recoloured live: the photo becomes a greyscale shading map that is multiplied over a colour.

import { LATEST_ALBUM, LATEST_ALBUM_TRACKS } from './releases'

export type Kind = 'garment' | 'disc' | 'tape' | 'stickers'

export interface Product {
  id: string
  n: string
  p: number
  was: number
  stock: number
  kind: Kind
  /** photo under /img/shop/ */
  img: string
  /** width / height of the photo, so overlays can be positioned in % of the picture */
  ratio: number
  sz?: string[]
  /** colourways: for garments the tint, for the CD the disc finish, for the tape and stickers the label colour */
  cols: [name: string, hex: string][]
  d: string
  spec: [string, string][]
  guide?: [size: string, chest: string, length: string][]
}

export const PRODUCTS: Product[] = [
  {
    id: 'tee', n: `${LATEST_ALBUM.title} Tee`, p: 28, was: 35, stock: 24, kind: 'garment', img: 'tee.webp', ratio: 1.0075, sz: ['S', 'M', 'L', 'XL'],
    cols: [['Midnight', '#2c2c2e'], ['Estate Orange', '#f07000'], ['Concrete', '#cbc6b8']],
    d: 'Heavyweight tee. Logo on the chest, "N17" across the back. Boxy, oversized, built to be worn to death.',
    spec: [['FABRIC', '100% combed cotton, 260gsm'], ['FIT', 'Oversized, dropped shoulder'], ['PRINT', 'Screen-printed, hand finished'], ['MADE', 'Box room, N17 · limited run']],
    guide: [['S', '52', '70'], ['M', '55', '72'], ['L', '58', '74'], ['XL', '61', '76']],
  },
  {
    id: 'hood', n: 'N17 Hoodie', p: 55, was: 70, stock: 7, kind: 'garment', img: 'hoodie.webp', ratio: 0.8107, sz: ['S', 'M', 'L', 'XL'],
    cols: [['Estate Orange', '#f07000'], ['Midnight', '#34343a'], ['Concrete', '#cbc6b8']],
    d: 'Oversized heavy fleece with a deep hood and kangaroo pocket. Proper warm for the top deck of the night bus.',
    spec: [['FABRIC', '80% cotton / 20% poly, 450gsm'], ['FIT', 'Oversized, drop shoulder'], ['PRINT', 'Chest logo, back hit'], ['POCKET', 'Kangaroo, hidden cable port']],
    guide: [['S', '56', '68'], ['M', '59', '70'], ['L', '62', '72'], ['XL', '65', '74']],
  },
  {
    id: 'beanie', n: 'Roadman Beanie', p: 18, was: 22, stock: 40, kind: 'garment', img: 'beanie.webp', ratio: 1.0817,
    cols: [['Midnight', '#34343a'], ['Estate Orange', '#f07000'], ['Concrete', '#cbc6b8']],
    d: 'One size, pulled down low. Chunky knit with a woven 5EB patch on the cuff.',
    spec: [['FABRIC', 'Chunky marl knit'], ['SIZE', 'One size, stretchy'], ['PATCH', 'Woven 5EB, sewn on'], ['FIT', 'Pull it down low']],
  },
  {
    id: 'cdr', n: `${LATEST_ALBUM.title} CD-R`, p: 8, was: 10, stock: 63, kind: 'disc', img: 'cd.webp', ratio: 0.998,
    cols: [['Silver', '#d9d4c4'], ['Black', '#222']],
    d: "Hand-burnt, scribbled on in marker, signed. Plays in anything with a laser, including your nan's stereo.",
    spec: [['MEDIA', 'CD-R, 80 min / 700MB'], ['BURN', 'Hand-burnt, one at a time'], ['LABEL', 'Sharpie, signed'], ['TRACKS', `${LATEST_ALBUM_TRACKS.length} · no skips`]],
  },
  {
    id: 'tape', n: 'Cassette', p: 12, was: 15, stock: 0, kind: 'tape', img: 'cassette.webp', ratio: 1.591,
    cols: [['Cream tape', '#e9e2d0'], ['Orange tape', '#f07000']],
    d: 'Numbered of 100. Chrome tape, hand-labelled shell. Comes with a free Bic and a sore thumb.',
    spec: [['TAPE', 'Type II chrome, C46'], ['RUN', 'Numbered of 100'], ['LABEL', 'Masking tape, marker'], ['STATUS', 'Sold out, ask again']],
  },
  {
    id: 'stk', n: 'Stickers x12', p: 4, was: 6, stock: 200, kind: 'stickers', img: 'bench.jpg', ratio: 1.28,
    cols: [['Orange', '#f07000'], ['Cream', '#e9e2d0']],
    d: 'Twelve matte vinyl stickers, one for every cover. Bomb the bus stop. Not our fault if you do.',
    spec: [['QTY', '12 stickers, assorted'], ['STOCK', 'Matte vinyl, outdoor'], ['SIZE', 'Up to 8cm'], ['WARNING', 'Do not stick on the police']],
  },
]

export const money = (n: number) => '£' + (Math.round(n * 100) / 100).toFixed(2).replace('.00', '')

/** Photo credits shown under the shop. All Wikimedia Commons. */
export const CREDITS = [
  ['Tee', 'Daniel Furon / Wikimedia Foundation', 'CC BY-SA 3.0'],
  ['Hoodie', 'Davidcanogomez', 'CC BY-SA 3.0'],
  ['Beanie', 'ajay_suresh', 'CC BY 2.0'],
  ['CD-R', 'BenesovaDo', 'CC0'],
  ['Cassette', 'Retired electrician', 'CC0'],
  ['Bench', 'Magpieturtle', 'CC BY-SA 4.0'],
] as const
