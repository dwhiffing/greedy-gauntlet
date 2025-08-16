import { Game } from '../scenes/Game'

export class BaseSpawner {
  private timer: number
  protected sceneRef: Game
  private scheduledSpawns: { tick: number; index: number }[] = []
  private globalTick: number = 0
  public spawnRate = 20

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
    this.timer = 0
  }

  spawn = (index: number): void => {}
  spawnNextWave = () => {}

  spawnMany = (indexes: number[], delay = 0) => {
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
      this.timer = this.spawnRate
      this.spawnNextWave()
    }

    this.scheduledSpawns = this.scheduledSpawns.filter((spawn) => {
      if (spawn.index > -1 && spawn.tick === this.globalTick) {
        this.spawn(spawn.index)
        return false
      }
      return true
    })
  }

  addToEach = (arr: number[], value = 0) =>
    arr.map((n) => (n === -1 ? -1 : n + value))
}
