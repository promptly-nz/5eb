export interface Release {
  title: string
  kind: 'album' | 'ep' | 'single'
  year: number
  /** path under /img/ */
  img: string
}

export const R = {
  friedInnaMansion: { title: "fried inna mansion", kind: 'single', year: 2026, img: '5eb/fried-inna-mansion.jpg' },
  ducati: { title: "Ducati", kind: 'single', year: 2026, img: '5eb/ducati.jpg' },
  back2backFreestyle: { title: "back2back freestyle", kind: 'single', year: 2026, img: '5eb/back2back-freestyle.jpg' },
  fashionablyLate: { title: "fashionably late", kind: 'single', year: 2026, img: '5eb/fashionably-late.jpg' },
  sexSells: { title: "Sex Sells", kind: 'single', year: 2026, img: '5eb/sex-sells.jpg' },
  allsummalong: { title: "allsummalong", kind: 'album', year: 2025, img: '5eb/allsummalong.jpg' },
  dlsDrugsLifeSex: { title: "dls (drugs life sex)", kind: 'single', year: 2025, img: '5eb/dls-drugs-life-sex.jpg' },
  hysteric: { title: "hysteric", kind: 'single', year: 2025, img: '5eb/hysteric.jpg' },
  motionmuzik: { title: "##MOTIONMUZIK", kind: 'album', year: 2025, img: '5eb/motionmuzik.jpg' },
  londonTipton: { title: "London Tipton", kind: 'single', year: 2024, img: '5eb/london-tipton.jpg' },
  sorrym8: { title: "sorrym8", kind: 'single', year: 2024, img: '5eb/sorrym8.jpg' },
  mashup: { title: "MASHUP", kind: 'single', year: 2024, img: '5eb/mashup.jpg' },
  hypocritical: { title: "Hypocritical", kind: 'single', year: 2024, img: '5eb/hypocritical.jpg' },
  moneyfesting: { title: "moneyfesting", kind: 'single', year: 2024, img: '5eb/moneyfesting.jpg' },
  rollTheDice: { title: "roll the dice", kind: 'single', year: 2024, img: '5eb/roll-the-dice.jpg' },
  wheezy: { title: "Wheezy", kind: 'single', year: 2023, img: '5eb/wheezy.jpg' },
  noHabloEspanol: { title: "No Hablo Español", kind: 'single', year: 2023, img: '5eb/no-hablo-espa-ol.jpg' },
  planz1000: { title: "1000planz", kind: 'single', year: 2022, img: '5eb/1000planz.jpg' },
  twiyfreestyle: { title: "TWIYFreestyle", kind: 'single', year: 2022, img: '5eb/twiyfreestyle.jpg' },
  '25_8': { title: "25/8 (Silento)", kind: 'single', year: 2022, img: '5eb/25-8-silento.jpg' },
  yinYang: { title: "Yin & Yang", kind: 'single', year: 2022, img: '5eb/yin-yang.jpg' },
  fendi5ive: { title: "FENDI5IVE", kind: 'album', year: 2021, img: '5eb/fendi5ive.jpg' },
  itsAllLuv: { title: "It’s All Luv", kind: 'single', year: 2021, img: '5eb/it-s-all-luv.jpg' },
  magic: { title: "Magic!", kind: 'single', year: 2021, img: '5eb/magic.jpg' },
  lonDon: { title: "Lon-Don", kind: 'single', year: 2021, img: '5eb/lon-don.jpg' },
  lovely: { title: "Lovely", kind: 'single', year: 2021, img: '5eb/lovely.jpg' },
  inTheMorn: { title: "In The Morn", kind: 'single', year: 2020, img: '5eb/in-the-morn.jpg' },
  starStruck: { title: "5TAR5TRUCK", kind: 'single', year: 2020, img: '5eb/5tar5truck.jpg' },
  highbernation: { title: "Highbernation", kind: 'ep', year: 2020, img: '5eb/highbernation.jpg' },
  childi5h: { title: "Childi5h", kind: 'ep', year: 2019, img: '5eb/childi5h.jpg' },
  sorryMyBad: { title: "5orryMyBad!", kind: 'single', year: 2019, img: '5eb/5orrymybad-feat-smith-blaxk.jpg' },
  jacuzziFreestyle: { title: "Jacuzzi Freestyle", kind: 'single', year: 2019, img: '5eb/jacuzzi-freestyle.jpg' },
} satisfies Record<string, Release>

/** The artist photo (a press shot, not a release). */
export const PHOTO = '5eb/2.webp'

/** The newest release. The site's "out now" copy follows this: change it here when something drops. */
export const LATEST: Release = R.friedInnaMansion
/** The newest album, used for the physical merch art. */
export const LATEST_ALBUM: Release = R.allsummalong
export const LATEST_ALBUM_TRACKS = [
  'la vida loca', 'hysteric', 'wait on me', 'life aint free', 'dls (drugs life sex)',
  'plain jane', 'do not disturb', 'i feel sick', 'create + make', 'the world keeps spinnin',
]
