import { Physics } from 'phaser'
import { Game } from '../scenes/Game'

const speed = 32
const _vx = [0, 1, 0, -1]
const _vy = [-1, 0, 1, 0]

export class Arrow extends Physics.Arcade.Sprite {
  protected sceneRef: Game

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 1)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setSize(1, 1)
  }

  public update(): void {}
  public spawn(x: number, y: number, direction: 0 | 1 | 2 | 3): void {
    const vx = _vx[direction]
    const vy = _vy[direction]
    this.setPosition(x * 8, y * 8).setVelocity(vx * speed, vy * speed)

    if (direction === 0) {
      this.setOrigin(0.1, 0.1).setOffset(4, -7).setAngle(270).setFlipX(false)
    } else if (direction === 1) {
      this.setOrigin(0.2, 0.1).setOffset(7, 4).setAngle(0).setFlipX(false)
    } else if (direction === 2) {
      this.setOrigin(0.2, 0.9).setOffset(5, 14).setAngle(90).setFlipX(false)
    } else if (direction === 3) {
      this.setOrigin(0.9, 0.1).setOffset(1, 4).setAngle(0).setFlipX(true)
    }
  }
}
