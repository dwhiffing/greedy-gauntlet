import { Physics } from 'phaser'
import { Game } from '../scenes/Game'
import { TimerBorder } from './TimerBorder'

const _vx = [0, 1, 0, -1]
const _vy = [-1, 0, 1, 0]

export class Arrow extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  public timerBorder: TimerBorder
  public isMoving = false
  public direction: 0 | 1 | 2 | 3 = 0

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 2)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setDepth(1)
    this.timerBorder = new TimerBorder(this.sceneRef)
  }

  public move() {
    if (!this.isMoving) return
    this.x += _vx[this.direction]
    this.y += _vy[this.direction]
  }

  public takeDamage(): void {
    this.setActive(false)
    this.setVisible(false)
  }

  public spawn(
    x: number,
    y: number,
    direction: 0 | 1 | 2 | 3,
    delay: number,
  ): void {
    this.direction = direction
    this.setPosition(x * 8, y * 8)
      .setVelocity(0, 0)
      .setActive(true)
      .setVisible(true)

    this.isMoving = false
    this.sceneRef.time.addEvent({
      delay: delay,
      callback: () => {
        if (this.sceneRef.data.get('play-arrow-launch')) {
          this.sceneRef.playSound('arrow-launch')
          this.sceneRef.data.set('play-arrow-launch', false)
        }
        this.isMoving = true
      },
    })

    if (direction === 0) {
      this.timerBorder.reset(x, y - 2, delay)
    } else if (direction === 1) {
      this.timerBorder.reset(x + 1, y, delay)
    } else if (direction === 2) {
      this.timerBorder.reset(x, y + 1, delay)
    } else if (direction === 3) {
      this.timerBorder.reset(x - 2, y, delay)
    }

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

  public getIsTangible = () => this.active
}
