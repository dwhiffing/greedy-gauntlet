export type ISpawn = { type: string; variant: string; size?: number }
export type ILevel = {
  pool: ISpawn[]
  waveRate: number
  attackDelay: number
  arrowSpeed: number
  milestone: number
}

export const LEVELS = [
  {
    pool: [{ type: 'arrow', variant: 'volley', size: 4 }],
    waveRate: 30,
    attackDelay: 15,
    arrowSpeed: 5,
    milestone: 0,
  },
  {
    pool: [
      { type: 'arrow', variant: 'volley', size: 4 },
      { type: 'spike', variant: 'box', size: 4 },
    ],
    waveRate: 20,
    attackDelay: 15,
    arrowSpeed: 4,
    milestone: 25,
  },
  {
    pool: [
      { type: 'arrow', variant: 'volley', size: 4 },
      { type: 'spike', variant: 'row' },
    ],
    waveRate: 15,
    attackDelay: 10,
    arrowSpeed: 3,
    milestone: 100,
  },
  {
    pool: [
      { type: 'arrow', variant: 'volley', size: 4 },
      { type: 'spike', variant: 'row' },
    ],
    waveRate: 10,
    attackDelay: 5,
    arrowSpeed: 2,
    milestone: 200,
  },
]
