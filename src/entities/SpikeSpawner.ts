import { IAttack } from '../constants'
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

  spawnNextWave = (attack: IAttack) => {
    if (this.sceneRef.data.get('paused') === 1) return

    this.sceneRef.playSound('arrow-spawn', { volume: 0.85 })

    const type = attack.variant
    const repeat = attack.repeat ?? 1
    if (type === 'arc') {
      for (let k = 0; k < repeat; k++) {
        const div = this.sceneRef.data.get('waveRate')
        const j = 360 / div

        for (let i = 0; i < div; i++) {
          this.spawnArc(i * j, j + i * j, {
            baseDelay:
              Math.floor(k * (div / repeat)) +
              (attack.direction === 0 ? i : div - i),
          })
        }
      }
    } else {
      this.spawnWave(attack)
    }
  }

  private spawnWave(attack: IAttack) {
    let k = 0
    const size1 = attack.size ?? 1
    const size2 = attack.size2 ?? 1
    const repeat = attack.repeat ?? 1
    const possibleIndex1 = []
    const possibleIndex2 = []
    for (let idx = 0; idx <= 8 - size1; idx++) possibleIndex1.push(idx)
    for (let idx = 0; idx <= 8 - size2; idx++) possibleIndex2.push(idx)
    const shuffledIndex1 = Phaser.Utils.Array.Shuffle(possibleIndex1)
    const shuffledIndex2 = Phaser.Utils.Array.Shuffle(possibleIndex2)

    for (let m = 0; m < repeat; m++) {
      const RND = Phaser.Math.RND
      const direction = attack.direction ?? RND.between(0, 1)
      const index1 = attack.index ?? shuffledIndex1[m % shuffledIndex1.length]
      const index2 = attack.index2 ?? shuffledIndex2[m % shuffledIndex2.length]

      for (let i = index1; i < index1 + size1; i += 1) {
        const indexes: number[] = []
        for (let j = index2; j < index2 + size2; j += 1) {
          if (typeof attack.gap === 'number' && (i + j) % 2 !== attack.gap)
            continue
          if (direction === 0) {
            indexes.push(i * 8 + j)
          } else {
            indexes.push(j * 8 + i)
          }
        }
        this.spawnMany(indexes, {
          ...attack,
          baseDelay: attack.baseDelay ?? k++,
        })
      }
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
