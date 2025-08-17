import { Physics } from 'phaser'
import { Game } from '../scenes/Game'

export class Coin extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  public lifetime = 20
  private fadeTween?: Phaser.Tweens.Tween
  particles: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 3)
    this.sceneRef = scene
    scene.add.existing(this)

    this.particles = scene.add
      .particles(4, 4, 'sheet', {
        frame: 3,
        lifespan: 300,
        speed: 40,
        scale: 0.7,
        alpha: { start: 0.4, end: 0 },
        tint: 0xffaa00,
        angle: { start: 0, end: 360, steps: 6 },
      })
      .stop()
    scene.physics.add.existing(this)

    this.setOrigin(0).setSize(3, 3).setOffset(3, 2).setTint(0xffaa00)
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
    this.particles.setPosition(this.x + 4, this.y + 4).explode(6)
    this.fadeTween?.remove()
  }

  private fadeOut = () => {
    const m = this.sceneRef.player.multiIndex
    this.fadeTween = this.sceneRef.tweens.add({
      targets: this,
      alpha: 0,
      delay: 1500 - 250 * m,
      duration: 2000 - 250 * m,
      onComplete: () => {
        this.sceneRef.player.resetMulti()
        this.setVisible(false)
        this.setActive(false)
      },
    })
  }
}
