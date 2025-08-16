import { Physics } from 'phaser'
import { Game } from '../scenes/Game'
import { TimerBorder } from './TimerBorder'

export class Spike extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  public lifetime = 20
  private age = 0
  public timerBorder: TimerBorder
  public _isTangible = false

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 5)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0, 0).setSize(3, 3).setOffset(3, 2)
    this.timerBorder = new TimerBorder(scene)

    this.sceneRef.time.addEvent({
      delay: 100,
      repeat: -1,
      callback: () => {
        if (!this.active) return

        if (this.age === this.lifetime) {
          this._isTangible = true
          this.setFrame(5)
        }
        if (this.age === this.lifetime * 1.2) {
          this._isTangible = false
          this.fadeOut()
        }
        this.age++
      },
    })
  }

  public spawn(x: number, y: number): void {
    this.setPosition(x * 8, y * 8).setVelocity(0, 0)
    this.setVisible(true).setActive(true).setFrame(4).setAlpha(0)

    this.age = 0
    this.sceneRef.tweens.add({ targets: this, alpha: 1, duration: 150 })
    this.timerBorder.reset(x, y, this.lifetime * 100)
  }

  public takeDamage(): void {
    this._isTangible = false
  }

  public isTangible = () => this._isTangible

  private fadeOut = () =>
    this.sceneRef.tweens.add({
      targets: this,
      alpha: 0,
      delay: 100,
      duration: 250,
      onComplete: () => {
        this.setVisible(false)
        this.setActive(false)
      },
    })
}
