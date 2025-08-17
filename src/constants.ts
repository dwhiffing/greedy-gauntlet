export type ISpawn = { type: string; variant: string; size?: number }
export type ILevel = {
  pool: ISpawn[]
  waveRate: number
  attackDelay: number
  arrowSpeed: number
  milestone: number
}

export const COMBO_AMOUNTS = [4, 10, 18, 28, 40, 54]
export const MULTIPLIERS = [1, 2, 3, 5, 10, 20, 50]

export const COIN_LIFETIME = 40
export const COIN_LIFETIME_DECREASE = 2.5
export const SPIKE_EXTRA_FRAMES = 4

export const PLAYER_IFRAMES = 500
export const PLAYER_REGEN_TIME = 5000
export const PLAYER_BASE_SPEED = 170
export const PLAYER_SLOW_SPEED = 220

export const LEVELS = [
  {
    milestone: 0,
    pool: [{ type: 'arrow', variant: 'volley', size: 4 }],
    waveRate: 30,
    attackDelay: 15,
    arrowSpeed: 5,
  },
  {
    milestone: 25,
    pool: [
      { type: 'arrow', variant: 'volley', size: 4 },
      { type: 'spike', variant: 'box', size: 4 },
    ],
    waveRate: 20,
    attackDelay: 15,
    arrowSpeed: 4,
  },
  {
    milestone: 100,
    pool: [
      { type: 'arrow', variant: 'volley', size: 4 },
      { type: 'spike', variant: 'box', size: 4 },
    ],
    waveRate: 15,
    attackDelay: 10,
    arrowSpeed: 3,
  },
  {
    milestone: 200,
    pool: [
      { type: 'arrow', variant: 'volley', size: 4 },
      { type: 'spike', variant: 'box', size: 4 },
    ],
    waveRate: 10,
    attackDelay: 5,
    arrowSpeed: 2,
  },
]

export const COLORS = [
  0xaa00ff, 0x0099ee, 0x00aa44, 0xffcc00, 0xff8800, 0xcc3300, 0xff00aa,
]
export const HAT_COLORS = [
  0x00aa44, 0xaa00ff, 0xcc3300, 0xff00aa, 0x0099ee, 0xffcc00, 0xff8800,
]
