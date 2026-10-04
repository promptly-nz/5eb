import { LATEST, R, type Release } from './releases'

export const SMS = [
  'big up the N17 massive - Tash x',
  `play ${R.ducati.title} again!!! - Kez`,
  'who got the bluetooth for the new tape? - Marv',
  'ROAD RADIO > everything - Jade',
  '5EB on Dubplate FM at 11 no cap - Dre',
  'send this to 3 people or bare bars curse - Shan',
  "turn it up my nan can't hear - Leon",
  'free download link pls - Ayo',
  "where's the cypher at? Alex Park - Bez",
]

export const MARQUEE_WORDS = ['Bare Bars', 'N17', LATEST.title, 'No Hooks', 'Wagwan', R.ducati.title, R.allsummalong.title, 'Stream Now']
export const MARQUEE_IMGS = [R.ducati, R.fendi5ive, R.motionmuzik, R.highbernation, R.wheezy, R.allsummalong, R.londonTipton, R.childi5h].map(r => r.img)

export interface Channel { img: string; f: string; a: string; b: string }
const label = (r: Release) => `${r.kind[0].toUpperCase()}${r.kind.slice(1)} · ${r.year}`
export const CHANNELS: Channel[] = [
  { img: R.motionmuzik.img, f: 'f1', a: R.motionmuzik.title, b: label(R.motionmuzik) + ' · N17' },
  { img: R.fendi5ive.img, f: 'f2', a: R.fendi5ive.title, b: label(R.fendi5ive) },
  { img: R.highbernation.img, f: 'f3', a: R.highbernation.title, b: label(R.highbernation) },
  { img: R.ducati.img, f: 'f4', a: R.ducati.title, b: label(R.ducati) },
  { img: R.allsummalong.img, f: 'f5', a: R.allsummalong.title, b: label(R.allsummalong) },
  { img: R.friedInnaMansion.img, f: 'f6', a: R.friedInnaMansion.title, b: label(R.friedInnaMansion) },
]

/** The station that 5EB broadcasts on. */
export const F0 = 93.7
export const STATIONS: [number, string][] = [
  [87.9, 'ROADSIDE FM'], [90.6, 'STATIC FM'], [F0, '5EB FM'], [98.4, 'DUBPLATE FM'], [102.3, 'MAN DEM FM'], [106.1, 'LOW-VIS FM'],
]
export const GARBLE = ['~~khhhh~~', '..shhh..', '[ no signal ]', 'sk-sk-skrrt', '~~~tzzzt~~', '( reception poor )']

/** DVD menu entries: title, year, cover. */
export type Track = [title: string, year: string, img: string]
export const TRACKS: Track[] = [R.ducati, R.friedInnaMansion, R.hysteric, R.motionmuzik, R.fendi5ive, R.highbernation, R.wheezy].map(r => [r.title, String(r.year), r.img])

export const PAINT = [
  ['orange', '#f07000'], ['cream', '#e9e2d0'], ['red', '#ff2a2a'], ['cyan', '#19e6ff'], ['black', '#000'],
] as const

export const BOOT_LINES = [
  'SONY HANDYCAM DCR-TRV', '', '> INSERT TAPE ........ OK', `> READING 5EB_${LATEST.title.toUpperCase().replace(/\W+/g, '_')}.MPG`,
  '> SIGNAL: ANALOGUE / PAL', '> LOCATION: N17, LONDON, UK', '> BATTERY: ▮▮▮▯', '', 'READY.',
]
