import { EASY_ARROW_SPREAD, EASY_ARROW_VOLLEY, EASY_SPIKE_BOX } from './attacks'

export type IAttack = {
  type: string
  variant?: string
  // the number of arrows in the attack, negative can be used to state the number of gaps
  size?: number
  // the width/height for spike boxes
  size2?: number
  // a gap between each arrow
  gap?: number
  // the amount of times to repeat for spike rows/cols
  repeat?: number
  // should the gap be randomly distributed instead of contiguous?
  random?: boolean
  // delay between each arrow/spike
  delay?: number
  // delay before attack starts
  baseDelay?: number
  // pass a specific index instead of starting at a random index
  index?: number
  // the index of the opposing axis for spikes
  index2?: number
  // pass a specific direction instead of a random one
  direction?: number
}

export type ISpawn = {
  attacks: IAttack[]
}
export type ILevel = {
  pool: ISpawn[]
  waveRate: number
  attackDelay: number
  arrowSpeed: number
  milestone: number
}

export const COMBO_AMOUNTS = [4, 10, 18, 28, 40, 54]
export const MULTIPLIERS = [1, 2, 3, 5, 10, 20, 50]

export const TICK_DURATION = 100
export const COIN_LIFETIME = 4000 / TICK_DURATION
export const COIN_LIFETIME_DECREASE = 2.5
export const SPIKE_EXTRA_FRAMES = 4

export const PLAYER_IFRAMES = 500
export const PLAYER_REGEN_TIME = 5000
export const PLAYER_BASE_SPEED = 170
export const PLAYER_SLOW_SPEED = 220

export const LEVELS: ILevel[] = [
  {
    milestone: 0,
    // pool: [EASY_SPIKE_ARC],
    pool: [EASY_ARROW_VOLLEY],
    waveRate: 3000 / TICK_DURATION,
    attackDelay: 1500 / TICK_DURATION,
    arrowSpeed: 5,
  },
  {
    milestone: 25,
    pool: [EASY_ARROW_SPREAD, EASY_ARROW_VOLLEY, EASY_SPIKE_BOX],
    waveRate: 2000 / TICK_DURATION,
    attackDelay: 1500 / TICK_DURATION,
    arrowSpeed: 4,
  },
  {
    milestone: 100,
    pool: [EASY_ARROW_VOLLEY, EASY_SPIKE_BOX],
    waveRate: 1500 / TICK_DURATION,
    attackDelay: 1000 / TICK_DURATION,
    arrowSpeed: 3,
  },
  {
    milestone: 200,
    pool: [EASY_ARROW_VOLLEY, EASY_SPIKE_BOX],
    waveRate: 1000 / TICK_DURATION,
    attackDelay: 500 / TICK_DURATION,
    arrowSpeed: 2,
  },
]

export const COLORS = [
  0xaa00ff, 0x0099ee, 0x00aa44, 0xffcc00, 0xff8800, 0xcc3300, 0xff00aa,
]
export const HAT_COLORS = [
  0x00aa44, 0xaa00ff, 0xcc3300, 0xff00aa, 0x0099ee, 0xffcc00, 0xff8800,
]
const key = 'sheet'
export const ANIMATIONS: Phaser.Types.Animations.Animation[] = [
  {
    key: 'player-walk',
    frameRate: 6,
    repeat: -1,
    frames: [
      { key, frame: 6 },
      { key, frame: 7 },
    ],
  },
  { key: 'player-idle', frames: [{ key, frame: 1 }] },
]
