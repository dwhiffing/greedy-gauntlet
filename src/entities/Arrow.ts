import { Physics } from 'phaser'
import { Game } from '../scenes/Game'

const _vx = [0, 1, 0, -1]
const _vy = [-1, 0, 1, 0]

export class Arrow extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  static globalTick = 0

  private lastMoveTick = 0
  public direction: 0 | 1 | 2 | 3 = 0
  public speed = 3

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 2)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  public update(): void {
    if (
      Arrow.globalTick % this.speed === 0 &&
      Arrow.globalTick !== this.lastMoveTick
    ) {
      this.lastMoveTick = Arrow.globalTick
      this.x += _vx[this.direction]
      this.y += _vy[this.direction]
    }
  }

  public spawn(x: number, y: number, direction: 0 | 1 | 2 | 3): void {
    this.direction = direction
    this.lastMoveTick = Arrow.globalTick
    this.setPosition(x * 8, y * 8).setVelocity(0, 0)

    this.setFlipX(direction === 3)
    if (direction === 0) {
      this.setSize(2, 4).setOrigin(0.1, 0.1).setOffset(3, -6).setAngle(270)
    } else if (direction === 1) {
      this.setSize(4, 2).setOrigin(0.2, 0.1).setOffset(3, 3).setAngle(0)
    } else if (direction === 2) {
      this.setSize(2, 4).setOrigin(0.2, 0.9).setOffset(4, 9).setAngle(90)
    } else if (direction === 3) {
      this.setSize(4, 2).setOrigin(0.9, 0.1).setOffset(1, 3).setAngle(0)
    }
  }
}
