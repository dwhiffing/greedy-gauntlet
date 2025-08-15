import { Arrow } from './Arrow'
import { Game } from '../scenes/Game'

const isPri = [true, false, true, false]
const sec = [9, -1, -1, 9]

export class ArrowSpawner {
  private timer: number
  protected sceneRef: Game
  private scheduledSpawns: { tick: number; index: number }[] = []
  private globalTick: number = 0

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
    this.timer = 0
  }

  spawnArrow = (index: number): void => {
    if (index === -1) return

    const arrow = this.sceneRef.arrows.get() as Arrow | null
    if (!arrow) return
    const direction = Math.floor(index / 8) as 0 | 1 | 2 | 3
    const primary = direction === 1 ? 7 - (index % 8) : index % 8
    const x = isPri[direction] ? primary : sec[direction]
    const y = isPri[direction] ? sec[direction] : primary
    arrow.spawn(x, y, direction)
  }

  spawnArrows = () => {
    const direction = Phaser.Math.RND.integerInRange(0, 3)
    const gapSize = 3
    const delay = 1
    const indexes = this.addToEach(
      this.getArrayWithRandomGap(gapSize),
      direction * 8,
    )
    indexes.forEach((i, idx) => {
      this.scheduledSpawns.push({
        tick: this.globalTick + idx * delay,
        index: i,
      })
    })
  }

  tick = () => {
    this.globalTick++
    if (this.timer-- === 0) {
      this.timer = 20
      this.spawnArrows()
    }
    this.scheduledSpawns = this.scheduledSpawns.filter((spawn) => {
      if (spawn.index > -1 && spawn.tick === this.globalTick) {
        this.spawnArrow(spawn.index)
        return false
      }
      return true
    })
  }

  getArrayWithRandomGap(gapSize: number): number[] {
    const arr = Array.from({ length: 8 }, (_, i) => i)
    if (gapSize <= 0 || gapSize >= arr.length) return arr
    const maxStart = arr.length - gapSize
    const start = Math.floor(Math.random() * (maxStart + 1))
    for (let i = start; i < start + gapSize; i++) {
      arr[i] = -1
    }
    return arr
  }

  addToEach = (arr: number[], value = 0) =>
    arr.map((n) => (n === -1 ? -1 : n + value))
}
