import { IAttack, ISpawn } from './constants'

export const EASY_ARROW_VOLLEY: ISpawn = {
  attacks: [{ type: 'arrow', delay: 0, size: 3 }],
}

export const MEDIUM_ARROW_VOLLEY: ISpawn = {
  attacks: [{ type: 'arrow', delay: 0, size: 4 }],
}

export const HARD_ARROW_VOLLEY: ISpawn = {
  attacks: [{ type: 'arrow', delay: 0, size: 5 }],
}

export const EASY_ARROW_SPREAD: ISpawn = {
  attacks: [{ type: 'arrow', delay: 2, size: 3 }],
}

export const MEDIUM_ARROW_SPREAD: ISpawn = {
  attacks: [{ type: 'arrow', delay: 2, size: 4 }],
}

export const HARD_ARROW_SPREAD: ISpawn = {
  attacks: [{ type: 'arrow', delay: 3, size: 5 }],
}

const CROSS_ARROW_BASE: IAttack = {
  type: 'arrow',
  delay: 0,
  size: 4,
  gap: 1,
  direction: 0,
  index: 0,
}

export const CROSS_ARROWS_EASY: ISpawn[] = [
  {
    attacks: [
      { ...CROSS_ARROW_BASE, direction: 0, index: 0 },
      { ...CROSS_ARROW_BASE, baseDelay: 15, direction: 2, index: 1 },
    ],
  },
  {
    attacks: [
      { ...CROSS_ARROW_BASE, direction: 1, index: 0 },
      { ...CROSS_ARROW_BASE, baseDelay: 15, direction: 3, index: 0 },
    ],
  },
]
export const CROSS_ARROWS_MEDIUM: ISpawn[] = [
  {
    attacks: [
      { ...CROSS_ARROW_BASE, direction: 0, index: 0 },
      { ...CROSS_ARROW_BASE, baseDelay: 7, direction: 2, index: 1 },
    ],
  },
  {
    attacks: [
      { ...CROSS_ARROW_BASE, direction: 1, index: 0 },
      { ...CROSS_ARROW_BASE, baseDelay: 7, direction: 3, index: 0 },
    ],
  },
]
export const CROSS_ARROWS_HARD: ISpawn[] = [
  {
    attacks: [
      { ...CROSS_ARROW_BASE, delay: 1, direction: 0, index: 0 },
      { ...CROSS_ARROW_BASE, baseDelay: 4, delay: 1, direction: 2, index: 1 },
    ],
  },
  {
    attacks: [
      { ...CROSS_ARROW_BASE, delay: 1, direction: 1, index: 0 },
      { ...CROSS_ARROW_BASE, baseDelay: 4, delay: 1, direction: 3, index: 0 },
    ],
  },
]

export const EASY_SPIKE_BOX: ISpawn = {
  attacks: [{ type: 'spike', size: 3, size2: 3 }],
}

export const MEDIUM_SPIKE_BOX: ISpawn = {
  attacks: [{ type: 'spike', size: 4, size2: 4 }],
}

export const HARD_SPIKE_BOX: ISpawn = {
  attacks: [{ type: 'spike', size: 5, size2: 5 }],
}

const SPIKE_ROW_BASE: IAttack = {
  type: 'spike',
  size: 8,
  size2: 1,
  repeat: 3,
  baseDelay: 0,
}
export const EASY_SPIKE_ROWS: ISpawn[] = [
  { attacks: [{ ...SPIKE_ROW_BASE, direction: 0 }] },
  { attacks: [{ ...SPIKE_ROW_BASE, direction: 1 }] },
]
export const MEDIUM_SPIKE_ROWS: ISpawn[] = [
  {
    attacks: [
      { ...SPIKE_ROW_BASE, repeat: 2, direction: 0 },
      { ...SPIKE_ROW_BASE, repeat: 2, direction: 1 },
    ],
  },
]
export const HARD_SPIKE_ROWS: ISpawn[] = [
  {
    attacks: [
      { ...SPIKE_ROW_BASE, direction: 0 },
      { ...SPIKE_ROW_BASE, direction: 1 },
    ],
  },
]

const SPIKE_CHECKER_BASE: IAttack = {
  type: 'spike',
  gap: 1,
  size: 8,
  size2: 8,
}
export const EASY_SPIKE_CHECKER: ISpawn[] = [
  { attacks: [{ ...SPIKE_CHECKER_BASE, baseDelay: 0, gap: 1 }] },
  { attacks: [{ ...SPIKE_CHECKER_BASE, baseDelay: 0, gap: 0 }] },
]
export const MEDIUM_SPIKE_CHECKER: ISpawn[] = [
  { attacks: [{ ...SPIKE_CHECKER_BASE, gap: 1 }] },
  { attacks: [{ ...SPIKE_CHECKER_BASE, gap: 0 }] },
]
export const HARD_SPIKE_CHECKER: ISpawn[] = [
  { attacks: [{ ...SPIKE_CHECKER_BASE, delay: 3, gap: 1 }] },
  { attacks: [{ ...SPIKE_CHECKER_BASE, delay: 3, gap: 0 }] },
]

export const SPIKE_ARC: ISpawn = {
  attacks: [{ type: 'spike', variant: 'arc', direction: 1, repeat: 1 }],
}
