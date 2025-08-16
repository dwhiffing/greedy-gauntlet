import { Game } from '../scenes/Game'
import { BaseSpawner, SpawnParams } from './BaseSpawner'
import { Spike } from './Spike'

export class SpikeSpawner extends BaseSpawner {
  constructor(sceneRef: Game) {
    super(sceneRef)
  }

  spawn = (index: number, delay: number): void => {
    if (index === -1) return

    const x = index % 8
    const y = Math.floor(index / 8)
    const activeSpikes = this.sceneRef.spikes.getChildren() as Spike[]
    for (const s of activeSpikes) {
      if (s.active && Math.round(s.x / 8) === x && Math.round(s.y / 8) === y) {
        return
      }
    }

    const spike = this.sceneRef.spikes.get() as Spike | null
    if (!spike) return
    spike.spawn(x, y, delay)
  }

  spawnNextWave = () => {
    if (this.sceneRef.data.get('paused') === 1) return

    const RND = Phaser.Math.RND
    const type = RND.pick(['box'])
    if (type === 'row') {
      this.spawnWave(RND.between(0, 7), 1, 0, 8, 'row')
    } else if (type === 'wave') {
      this.spawnWave(RND.between(0, 4), 3, 0, 8, RND.pick(['row', 'column']))
    } else if (type === 'column') {
      this.spawnWave(RND.between(0, 7), 1, 0, 8, 'column')
    } else if (type === 'box') {
      const width = 3
      const height = 3
      const x = RND.between(0, 8 - width)
      const y = RND.between(0, 8 - height)
      this.spawnWave(x, width, y, height, 'column')
    }
  }

  private spawnWave(
    index1: number,
    size1: number,
    index2: number,
    size2: number,
    type: 'row' | 'column',
    params?: SpawnParams,
  ) {
    let k = 0

    for (let i = index1; i < index1 + size1; i++) {
      const indexes: number[] = []
      for (let j = index2; j < index2 + size2; j++) {
        if (type === 'row') {
          indexes.push(i * 8 + j)
        } else {
          indexes.push(j * 8 + i)
        }
      }
      this.spawnMany(indexes, { ...params, delay: 1, baseDelay: k++ })
    }
  }
}
