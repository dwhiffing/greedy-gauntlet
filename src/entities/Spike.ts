import { Physics, Tweens } from 'phaser'
import { Game } from '../scenes/Game'
import { TimerBorder } from './TimerBorder'
import { SPIKE_EXTRA_FRAMES, TICK_DURATION } from '../constants'

export class Spike extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  public lifetime = 20
  private age = 0
  public timerBorder: TimerBorder
  public _isTangible = false
  private tween: Tweens.Tween | null = null

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 5)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0, 0).setSize(3, 3).setOffset(3, 2).setDepth(1)
    this.timerBorder = new TimerBorder(scene)

    this.sceneRef.time.addEvent({
      delay: TICK_DURATION,
      repeat: -1,
      callback: () => {
        if (!this.active) return

        if (this.age === this.lifetime) {
          if (this.sceneRef.data.get('play-arrow-launch')) {
            this.sceneRef.playSound('arrow-launch')
            this.sceneRef.data.set('play-arrow-launch', false)
            this.sceneRef.time.delayedCall(100, () =>
              this.sceneRef.data.set('play-arrow-launch', true),
            )
          }

          this._isTangible = true
          this.setFrame(5)
          this.setAlpha(1)
        }
        if (this.age === this.lifetime + SPIKE_EXTRA_FRAMES) {
          this._isTangible = false
          this.fadeOut()
        }
        this.age++
      },
    })
  }

  public spawn(x: number, y: number, delay: number): void {
    this.setPosition(x * 8, y * 8).setVelocity(0, 0)
    this.setVisible(true).setActive(true).setFrame(4).setAlpha(0)
    this.tween?.pause()

    this.lifetime = delay / TICK_DURATION
    this.age = 0
    this.sceneRef.tweens.add({ targets: this, alpha: 0.7, duration: 250 })
    this.timerBorder.reset(x, y, this.lifetime * TICK_DURATION)
  }

  public takeDamage(): void {
    this._isTangible = false
  }

  public getIsTangible = () => this._isTangible

  private fadeOut = () => {
    this.tween = this.sceneRef.tweens.add({
      targets: this,
      alpha: 0,
      delay: 0,
      duration: 300,
      onComplete: () => {
        this.setActive(false)
        this.setVisible(false)
        this.timerBorder.setVisible(false).setActive(false)
      },
    })
  }
}
