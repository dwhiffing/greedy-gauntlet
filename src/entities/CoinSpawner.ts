import { Game } from '../scenes/Game'
import { BaseSpawner } from './BaseSpawner'
import { Coin } from './Coin'

export class CoinSpawner extends BaseSpawner {
  constructor(sceneRef: Game) {
    super(sceneRef)
    this.spawnRate = 1
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
    const coins = this.sceneRef.coins.getChildren() as Coin[]
    const activeCoins = coins.filter((c) => c.active)
    if (activeCoins.length > 0) return
    for (let tries = 0; tries < 20; tries++) {
      const index = Phaser.Math.RND.between(0, 63)
      const x = index % 8
      const y = Math.floor(index / 8)
      const px = Math.round(this.sceneRef.player.x / 8)
      const py = Math.round(this.sceneRef.player.y / 8)
      const isOnCoin = activeCoins.some(
        (c) => Math.round(c.x / 8) === x && Math.round(c.y / 8) === y,
      )
      const isNearPlayer = Math.abs(x - px) <= 1 && Math.abs(y - py) <= 1
      if (!isNearPlayer && !isOnCoin) {
        this.spawnMany([index], delay)
        break
      }
    }
  }
}
