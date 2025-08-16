import { Physics } from 'phaser'
import { Game } from '../scenes/Game'

export class Spike extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  public lifetime = 300
  private age = 0
  public _isTangible = false

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 5)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setOrigin(0, 0).setSize(3, 3).setOffset(3, 2)
    this._isTangible = false
  }

  public takeDamage(): void {
    this._isTangible = false
  }

  public isTangible = () => {
    return this._isTangible
  }

  public update(): void {
    if (!this.active) return
    if (this.age === Math.floor(this.lifetime * 0.85)) {
      this._isTangible = true
      this.setFrame(5)
    }
    if (this.age === this.lifetime) {
      this._isTangible = false
      // this.setFrame(4)
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
    this.age++
  }

  public spawn(x: number, y: number): void {
    this.setPosition(x * 8, y * 8).setVelocity(0, 0)
    this.setVisible(true).setActive(true)
    this.setFrame(4)
    this.age = 0
    this.setAlpha(0)
    this.sceneRef.tweens.add({
      targets: this,
      alpha: 1,
      duration: 250,
    })
  }
}
