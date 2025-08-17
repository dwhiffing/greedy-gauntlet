import { Game, ISpawn } from '../scenes/Game'

export type SpawnParams = { delay?: number; baseDelay?: number }
export class BaseSpawner {
  protected sceneRef: Game
  private scheduledSpawns: { tick: number; index: number }[] = []
  public globalTick: number = 0

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
  }

  spawn = (_index: number, _delay: number): void => {}
  spawnNextWave = (_variant: ISpawn) => {}

  spawnMany = (indexes: number[], params?: SpawnParams) => {
    indexes.forEach((i, idx) => {
      this.scheduleSpawn(
        this.globalTick + idx * (params?.delay ?? 0) + (params?.baseDelay ?? 0),
        i,
      )
    })
  }

  protected scheduleSpawn(tick: number, index: number) {
    this.scheduledSpawns.push({ tick, index })
  }

  tick = () => {
    this.scheduledSpawns = this.scheduledSpawns.filter((spawn) => {
      if (spawn.index > -1 && spawn.tick === this.globalTick) {
        this.spawn(spawn.index, this.sceneRef.data.get('attackDelay') * 100)
        return false
      }
      return true
    })
    this.globalTick++
  }

  addToEach = (arr: number[], value = 0) =>
    arr.map((n) => (n === -1 ? -1 : n + value))
}
