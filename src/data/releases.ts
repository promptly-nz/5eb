export interface Release {
  title: string
  kind: 'album' | 'ep' | 'single'
  year: number
  /** path under /img/ */
  img: string
  /** the release's own page; missing ones fall back to the artist page, see `linkOf` */
  url?: string
  /** YouTube video id of the track that plays on the site (for albums, one track off it) */
  yt?: string
}

export const R = {
  friedInnaMansion: { title: "fried inna mansion", kind: 'single', year: 2026, img: '5eb/fried-inna-mansion.jpg', yt: 'Nc1O2Y4asT0', url: 'https://www.deezer.com/en/album/1058154472' },
  ducati: { title: "Ducati", kind: 'single', year: 2026, img: '5eb/ducati.jpg', yt: 'cRKhAGzrpTM' },
  back2backFreestyle: { title: "back2back freestyle", kind: 'single', year: 2026, img: '5eb/back2back-freestyle.jpg', yt: 'SZUJVdclf2U', url: 'https://open.spotify.com/album/5KgbAT9t8Fv59DcLG92jh1' },
  fashionablyLate: { title: "fashionably late", kind: 'single', year: 2026, img: '5eb/fashionably-late.jpg', yt: 'S8Yx0MdoXEM', url: 'https://music.apple.com/gb/song/fashionably-late/1894300301' },
  sexSells: { title: "Sex Sells", kind: 'single', year: 2026, img: '5eb/sex-sells.jpg', yt: 'EZCYoYP5a18', url: 'https://open.spotify.com/album/5Ck8kmDvjegC38402ZGwJb' },
  allsummalong: { title: "allsummalong", kind: 'album', year: 2025, img: '5eb/allsummalong.jpg', yt: 'D_n5QhsOp3o', url: 'https://music.apple.com/gb/album/allsummalong/1828944877' },
  dlsDrugsLifeSex: { title: "dls (drugs life sex)", kind: 'single', year: 2025, img: '5eb/dls-drugs-life-sex.jpg' },
  hysteric: { title: "hysteric", kind: 'single', year: 2025, img: '5eb/hysteric.jpg', yt: 'abg1RcpE7RA' },
  motionmuzik: { title: "##MOTIONMUZIK", kind: 'album', year: 2025, img: '5eb/motionmuzik.jpg', yt: '8Zlx6ucAT1U', url: 'https://open.spotify.com/album/4JyQNptaUaPVmSyO3FK8e0' },
  londonTipton: { title: "London Tipton", kind: 'single', year: 2024, img: '5eb/london-tipton.jpg', yt: 'g3-Zju4i6Fo' },
  sorrym8: { title: "sorrym8", kind: 'single', year: 2024, img: '5eb/sorrym8.jpg', yt: 'CN6HsFbfUgM' },
  mashup: { title: "MASHUP", kind: 'single', year: 2024, img: '5eb/mashup.jpg', yt: 'of046GTWaEw' },
  hypocritical: { title: "Hypocritical", kind: 'single', year: 2024, img: '5eb/hypocritical.jpg' },
  moneyfesting: { title: "moneyfesting", kind: 'single', year: 2024, img: '5eb/moneyfesting.jpg' },
  rollTheDice: { title: "roll the dice", kind: 'single', year: 2024, img: '5eb/roll-the-dice.jpg' },
  wheezy: { title: "Wheezy", kind: 'single', year: 2023, img: '5eb/wheezy.jpg', yt: 'pko-raeVZbE', url: 'https://open.spotify.com/album/4kKKj0Erm0myaR1L4sTOOj' },
  noHabloEspanol: { title: "No Hablo Español", kind: 'single', year: 2023, img: '5eb/no-hablo-espa-ol.jpg', yt: 'qNXEtutTb6w' },
  planz1000: { title: "1000planz", kind: 'single', year: 2022, img: '5eb/1000planz.jpg', yt: '517gk7dnFhs' },
  twiyfreestyle: { title: "TWIYFreestyle", kind: 'single', year: 2022, img: '5eb/twiyfreestyle.jpg', yt: 'M2HgP7jcrF0' },
  '25_8': { title: "25/8 (Silento)", kind: 'single', year: 2022, img: '5eb/25-8-silento.jpg', yt: 'anlIyTKi9Yk' },
  yinYang: { title: "Yin & Yang", kind: 'single', year: 2022, img: '5eb/yin-yang.jpg', yt: 'DrAh_bQmJxk' },
  fendi5ive: { title: "FENDI5IVE", kind: 'album', year: 2021, img: '5eb/fendi5ive.jpg', yt: 'SdvNqyrpfvM', url: 'https://open.spotify.com/album/3G4x5zVe0brytospmob6jO' },
  itsAllLuv: { title: "It’s All Luv", kind: 'single', year: 2021, img: '5eb/it-s-all-luv.jpg' },
  magic: { title: "Magic!", kind: 'single', year: 2021, img: '5eb/magic.jpg' },
  lonDon: { title: "Lon-Don", kind: 'single', year: 2021, img: '5eb/lon-don.jpg', yt: 'Y8v2px-RfCU', url: 'https://open.spotify.com/album/50eVCeWa6VgVJdsylRJi2K' },
  lovely: { title: "Lovely", kind: 'single', year: 2021, img: '5eb/lovely.jpg', yt: 'SdvNqyrpfvM' },
  inTheMorn: { title: "In The Morn", kind: 'single', year: 2020, img: '5eb/in-the-morn.jpg', yt: 'lLRbhDLVcyo' },
  starStruck: { title: "5TAR5TRUCK", kind: 'single', year: 2020, img: '5eb/5tar5truck.jpg' },
  highbernation: { title: "Highbernation", kind: 'ep', year: 2020, img: '5eb/highbernation.jpg', yt: 'ZaVP_Tc_bW4' },
  childi5h: { title: "Childi5h", kind: 'ep', year: 2019, img: '5eb/childi5h.jpg' },
  sorryMyBad: { title: "5orryMyBad!", kind: 'single', year: 2019, img: '5eb/5orrymybad-feat-smith-blaxk.jpg' },
  jacuzziFreestyle: { title: "Jacuzzi Freestyle", kind: 'single', year: 2019, img: '5eb/jacuzzi-freestyle.jpg' },
} satisfies Record<string, Release>

/** Where releases without their own page send you. */
export const ARTIST_URL = 'https://open.spotify.com/artist/70P7as3HD8esc9Dx2TAR7o'
/** The artist's social and streaming pages (the "stand by" card). */
export const SOCIALS = [
  ['Spotify', ARTIST_URL],
  ['Apple', 'https://music.apple.com/gb/artist/5eb/1299459650'],
  ['YouTube', 'https://www.youtube.com/@5EBfendi'],
  ['Insta', 'https://www.instagram.com/5ebfendi/'],
] as const
/** The playable song for a release, if it has one. */
export const songOf = (r: Release) => (r.yt ? { id: r.yt, title: r.title } : undefined)
export const linkOf = (r: Release) => r.url ?? ARTIST_URL

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
