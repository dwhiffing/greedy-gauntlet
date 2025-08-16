import { Game } from '../scenes/Game'
import { BaseSpawner } from './BaseSpawner'
import { Coin } from './Coin'

export class CoinSpawner extends BaseSpawner {
  constructor(sceneRef: Game) {
    super(sceneRef)
    this.spawnRate = 20
  }

  spawn = (index: number): void => {
    if (index === -1) return

    const coin = this.sceneRef.coins.get() as Coin | null
    if (!coin) return

    const x = index % 8
    const y = Math.floor(index / 8)
    coin.spawn(x, y)
  }

  spawnNextWave = () => {
    const delay = 0

    const index = Phaser.Math.RND.between(0, 63)
    this.spawnMany([index], delay)
  }
}
