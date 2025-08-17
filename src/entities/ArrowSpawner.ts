import { IAttack } from '../constants'
import { Game } from '../scenes/Game'
import { Arrow } from './Arrow'
import { BaseSpawner } from './BaseSpawner'

const isPri = [true, false, true, false]
const sec = [9, -1, -1, 9]

export class ArrowSpawner extends BaseSpawner {
  constructor(sceneRef: Game) {
    super(sceneRef)
  }

  spawn = (index: number, delay: number): void => {
    if (index === -1) return

    const arrow = this.sceneRef.arrows.get() as Arrow | null
    if (!arrow) return
    const direction = Math.floor(index / 8) as 0 | 1 | 2 | 3
    const primary = direction === 1 ? 7 - (index % 8) : index % 8
    const x = isPri[direction] ? primary : sec[direction]
    const y = isPri[direction] ? sec[direction] : primary
    arrow.spawn(x, y, direction, delay)
  }

  spawnNextWave = (attack: IAttack) => {
    if (this.sceneRef.data.get('paused') === 1) return

    this.sceneRef.playSound('arrow-spawn')
    this.sceneRef.data.set('play-arrow-launch', true)

    const direction = attack.direction ?? Phaser.Math.RND.integerInRange(0, 3)
    const indexes = this.addToEach(
      this.getArrayWithRandomGap({
        size: attack.size ?? 3,
        random: !!attack.random,
        gap: attack.gap,
        start: attack.index,
      }),
      direction * 8,
    )
    this.spawnMany(indexes, {
      baseDelay: attack.baseDelay,
      delay: attack.delay ?? 0,
    })
  }

  getArrayWithRandomGap({
    size = 3,
    random = false,
    gap = 0,
    start,
  }: {
    size?: number
    start?: number
    random?: boolean
    gap?: number
  }): number[] {
    const _size = Math.abs(size)
    const arr = Array.from({ length: 8 }, (_, i) => i)
    if (_size <= 0 || _size >= arr.length) return arr
    if (gap) {
      const arrowIndices = []
      for (let n = 0; n < _size; n++) {
        const idx = (start ?? 0) + n * (gap + 1)
        if (idx < arr.length) arrowIndices.push(idx)
      }
      for (let i = 0; i < arr.length; i++) {
        if (!arrowIndices.includes(i)) arr[i] = -1
      }
      return arr
    }
    if (random) {
      const gapIndices = Phaser.Utils.Array.Shuffle([...arr]).slice(
        0,
        size < 0 ? _size : 8 - _size,
      )
      for (const i of gapIndices) arr[i] = -1
      return arr
    }
    const maxStart = arr.length - _size
    const _start = start ?? Math.floor(Math.random() * (maxStart + 1))
    if (size < 0) {
      for (let i = _start; i < _start + _size; i++) {
        arr[i] = -1
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (i < _start || i >= _start + _size) {
          arr[i] = -1
        }
      }
    }
    return arr
  }
}
