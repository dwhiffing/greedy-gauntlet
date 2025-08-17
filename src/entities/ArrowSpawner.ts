import { Game, ISpawn } from '../scenes/Game'
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

  spawnNextWave = (spawn: ISpawn) => {
    if (this.sceneRef.data.get('paused') === 1) return

    this.sceneRef.playSound('arrow-spawn')
    this.sceneRef.data.set('play-arrow-launch', true)

    const direction = Phaser.Math.RND.integerInRange(0, 3)
    const indexes = this.addToEach(
      this.getArrayWithRandomGap(spawn.size, spawn.variant === 'volley'),
      direction * 8,
    )
    this.spawnMany(indexes, { delay: 0 })
  }

  getArrayWithRandomGap(gapSize = 3, inverse = false): number[] {
    const arr = Array.from({ length: 8 }, (_, i) => i)
    if (gapSize <= 0 || gapSize >= arr.length) return arr
    const maxStart = arr.length - gapSize
    const start = Math.floor(Math.random() * (maxStart + 1))
    if (!inverse) {
      for (let i = start; i < start + gapSize; i++) {
        arr[i] = -1
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (i < start || i >= start + gapSize) {
          arr[i] = -1
        }
      }
    }
    return arr
  }
}
