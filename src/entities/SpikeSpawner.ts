import { ISpawn } from '../constants'
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
    // const activeSpikes = this.sceneRef.spikes.getChildren() as Spike[]
    // for (const s of activeSpikes) {
    //   if (s.active && Math.round(s.x / 8) === x && Math.round(s.y / 8) === y) {
    //     return
    //   }
    // }

    const spike = this.sceneRef.spikes.get() as Spike | null
    if (!spike) return
    spike.spawn(x, y, delay)
  }

  spawnNextWave = (spawn: ISpawn) => {
    if (this.sceneRef.data.get('paused') === 1) return

    this.sceneRef.playSound('spike-spawn')
    this.sceneRef.data.set('play-arrow-launch', true)

    const RND = Phaser.Math.RND
    const type = spawn.variant
    if (type === 'row') {
      this.spawnWave(RND.between(0, 7), 1, 0, 8, 'row')
    } else if (type === 'wave') {
      this.spawnWave(RND.between(0, 4), 3, 0, 8, RND.pick(['row', 'column']))
    } else if (type === 'column') {
      this.spawnWave(RND.between(0, 7), 1, 0, 8, 'column')
    } else if (type === 'arc') {
      for (let i = 0; i < 10; i++) {
        const j = 360 / 10
        this.spawnArc(i * j, j + i * j, { baseDelay: i * 1 })
      }
    } else if (type === 'box') {
      const width = spawn.size ?? 3
      const height = spawn.size ?? 3
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
      this.spawnMany(indexes, { ...params, delay: 0, baseDelay: k++ })
    }
  }

  spawnArc(startAngle: number, endAngle: number, params?: SpawnParams) {
    const indexes: number[] = []
    const startRad = Phaser.Math.DegToRad(startAngle)
    const endRad = Phaser.Math.DegToRad(endAngle)
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const dx = x - 3.5
        const dy = y - 3.5
        let angle = Math.atan2(dy, dx)
        if (angle < 0) angle += Math.PI * 2
        if (angle >= startRad && angle <= endRad) {
          indexes.push(y * 8 + x)
        }
      }
    }
    this.spawnMany(indexes, params)
  }
}
