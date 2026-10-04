import type { Song } from '../lib/music.svelte'

/** The always-on bed: it plays quietly under the page and swells when the radio dial locks on. From ##MOTIONMUZIK. */
export const RADIO_QUEUE: Song[] = [{ title: 'ROSTER', id: '8Zlx6ucAT1U' }]

// Queues for the physical merch. All YouTube uploads on 5EB's own channel (or its auto-generated Topic channel).

/** The CD-R plays the latest album, in the order of its tracklist (see LATEST_ALBUM_TRACKS). */
export const CD_QUEUE: Song[] = [
  { title: 'la vida loca', id: 'D_n5QhsOp3o' },
  { title: 'hysteric', id: 'abg1RcpE7RA' },
  { title: 'wait on me', id: 'Zv4TGwkD03k' },
  { title: 'life aint free', id: 'gAC8nB4_1O4' },
  { title: 'dls (drugs life sex)', id: 'PYuQRHSDSHo' },
  { title: 'plain jane', id: 'fSp1uCQ0a1A' },
  { title: 'do not disturb', id: 'n-oWI-kRhsU' },
  { title: 'i feel sick', id: 'yWCDkw3Ukg4' },
  { title: 'create + make', id: 'QebBPG-DhE4' },
  { title: 'the world keeps spinnin', id: 'bfWr5HWdFtw' },
]

/** The cassette plays the older tape: tracks off the Highbernation EP. */
export const TAPE_QUEUE: Song[] = [
  { title: 'MoveUp', id: 'ZaVP_Tc_bW4' },
  { title: '5MARTERfreestyle', id: 'UatKjsWgRKc' },
  { title: 'Antartica', id: 'Wwuga7KJxZk' },
  { title: 'I5OLATED', id: 'hVGopDMVqPY' },
]
