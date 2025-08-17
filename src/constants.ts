import {
  CROSS_ARROWS_EASY,
  CROSS_ARROWS_HARD,
  CROSS_ARROWS_MEDIUM,
  EASY_ARROW_SPREAD,
  EASY_ARROW_VOLLEY,
  EASY_SPIKE_BOX,
  EASY_SPIKE_CHECKER,
  EASY_SPIKE_ROWS,
  HARD_ARROW_SPREAD,
  HARD_ARROW_VOLLEY,
  HARD_SPIKE_BOX,
  HARD_SPIKE_CHECKER,
  HARD_SPIKE_ROWS,
  MEDIUM_ARROW_SPREAD,
  MEDIUM_ARROW_VOLLEY,
  MEDIUM_SPIKE_BOX,
  MEDIUM_SPIKE_CHECKER,
  MEDIUM_SPIKE_ROWS,
} from './attacks'

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
export const MULTIPLIERS = [1, 2, 4, 6, 8, 10, 12]

export const TICK_DURATION = 100
export const COIN_LIFETIME = 5000 / TICK_DURATION
export const COIN_LIFETIME_DECREASE = 250 / TICK_DURATION
export const SPIKE_EXTRA_FRAMES = 1

export const PLAYER_IFRAMES = 500
export const PLAYER_REGEN_TIME = 5000
export const PLAYER_BASE_SPEED = 170
export const PLAYER_SLOW_SPEED = 220

const JUST_VOLLEYS = [EASY_ARROW_VOLLEY]
const EASY_BASIC = [EASY_ARROW_SPREAD, MEDIUM_ARROW_VOLLEY, EASY_SPIKE_BOX]

const MEDIUM_BASIC = [
  MEDIUM_ARROW_SPREAD,
  MEDIUM_ARROW_VOLLEY,
  MEDIUM_SPIKE_BOX,
]
const HARD_BASIC = [HARD_ARROW_SPREAD, HARD_ARROW_VOLLEY, HARD_SPIKE_BOX]
const EASY_ADV = [
  ...CROSS_ARROWS_EASY,
  ...EASY_SPIKE_ROWS,
  ...EASY_SPIKE_CHECKER,
]
const MEDIUM_ADV = [
  ...CROSS_ARROWS_MEDIUM,
  ...MEDIUM_SPIKE_ROWS,
  ...MEDIUM_SPIKE_CHECKER,
]
const HARD_ADV = [
  ...CROSS_ARROWS_HARD,
  ...HARD_SPIKE_ROWS,
  ...HARD_SPIKE_CHECKER,
]

const base = {
  waveRate: 3000 / TICK_DURATION,
  attackDelay: 2000 / TICK_DURATION,
  arrowSpeed: 5,
}

export const LEVELS: ILevel[] = [
  {
    milestone: 0,
    pool: JUST_VOLLEYS,
    ...base,
  },
  {
    milestone: 10,
    pool: EASY_BASIC,
    ...base,
  },
  {
    milestone: 50,
    pool: MEDIUM_BASIC,
    ...base,
  },
  {
    milestone: 100,
    pool: [...MEDIUM_BASIC, ...CROSS_ARROWS_EASY],
    ...base,
    arrowSpeed: 4,
  },
  {
    milestone: 200,
    pool: [...MEDIUM_BASIC, ...CROSS_ARROWS_EASY, ...EASY_SPIKE_ROWS],
    ...base,
    arrowSpeed: 4,
  },
  {
    milestone: 300,
    pool: [...MEDIUM_BASIC, ...EASY_ADV],
    ...base,
    arrowSpeed: 4,
  },
  {
    milestone: 500,
    pool: [...HARD_BASIC, ...MEDIUM_ADV],
    ...base,
    arrowSpeed: 4,
  },
  {
    milestone: 750,
    pool: [...HARD_BASIC, ...MEDIUM_ADV],
    ...base,
    arrowSpeed: 3,
  },
  {
    milestone: 1000,
    pool: [...HARD_BASIC, ...HARD_ADV],
    ...base,
    arrowSpeed: 3,
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
