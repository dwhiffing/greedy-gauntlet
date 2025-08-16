import { Game } from '../scenes/Game'
import { BaseSpawner } from './BaseSpawner'
import { Spike } from './Spike'

export class SpikeSpawner extends BaseSpawner {
  constructor(sceneRef: Game) {
    super(sceneRef)
    this.spawnRate = 50
  }

  spawn = (index: number): void => {
    if (index === -1) return

    const spike = this.sceneRef.spikes.get() as Spike | null
    if (!spike) return

    const x = index % 8
    const y = Math.floor(index / 8)
    spike.spawn(x, y)
  }

  spawnNextWave = () => {
    const delay = 0
    let indexes: number[]
    if (Phaser.Math.RND.between(0, 1) === 0) {
      indexes = this.addToEach(
        [0, 1, 2, 3, 4, 5, 6, 7],
        Phaser.Math.RND.between(0, 7) * 8,
      )
    } else {
      indexes = this.addToEach(
        [0, 8, 16, 24, 32, 40, 48, 56],
        Phaser.Math.RND.between(0, 7),
      )
    }
    this.spawnMany(indexes, delay)
  }
}
