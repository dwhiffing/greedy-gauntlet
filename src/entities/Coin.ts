import { Physics } from 'phaser'
import { Game } from '../scenes/Game'

export class Coin extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  public lifetime = 20
  private fadeTween?: Phaser.Tweens.Tween

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 3)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0).setSize(3, 3).setOffset(3, 2)
  }

  public spawn(x: number, y: number): void {
    this.setPosition(x * 8, y * 8).setVelocity(0, 0)
    this.setVisible(true).setActive(true).setAlpha(0)
    this.fadeTween = this.sceneRef.tweens.add({
      targets: this,
      alpha: 1,
      duration: 150,
      onComplete: this.fadeOut,
    })
  }

  public pickup() {
    this.setActive(false).setVisible(false)
    this.fadeTween?.remove()
  }

  private fadeOut = () => {
    this.fadeTween = this.sceneRef.tweens.add({
      targets: this,
      alpha: 0,
      delay: 2000,
      duration: 3000,
      onComplete: () => {
        this.setVisible(false)
        this.setActive(false)
      },
    })
  }
}
