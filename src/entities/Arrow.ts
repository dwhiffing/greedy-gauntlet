import { Physics } from 'phaser'
import { Game } from '../scenes/Game'

const speed = 32
const _vx = [0, 1, 0, -1]
const _vy = [-1, 0, 1, 0]

export class Arrow extends Physics.Arcade.Sprite {
  protected sceneRef: Game

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 2)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  public update(): void {}
  public spawn(x: number, y: number, direction: 0 | 1 | 2 | 3): void {
    const vx = _vx[direction]
    const vy = _vy[direction]
    this.setPosition(x * 8, y * 8).setVelocity(vx * speed, vy * speed)

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
