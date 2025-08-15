import { Arrow } from './Arrow'
import { Game } from '../scenes/Game'

const isPri = [true, false, true, false]
const sec = [9, -1, -1, 9]

export class ArrowSpawner {
  protected sceneRef: Game

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
  }

  spawnArrow = (): void => {
    const arrow = this.sceneRef.arrows.get() as Arrow | null
    if (!arrow) return

    const direction = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3
    const primary = Math.floor(Math.random() * 8)
    const x = isPri[direction] ? primary : sec[direction]
    const y = isPri[direction] ? sec[direction] : primary
    arrow.spawn(x, y, direction)
  }

  update(): void {}
}
