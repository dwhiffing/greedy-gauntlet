import { Physics } from 'phaser'
import { Game } from '../scenes/Game'
import { COIN_LIFETIME, COIN_LIFETIME_DECREASE } from '../constants'

export class Coin extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  public lifetime = COIN_LIFETIME
  private fadeTween?: Phaser.Tweens.Tween
  particles: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 3)
    this.sceneRef = scene
    scene.add.existing(this)
    this.setDepth(1)

    this.particles = scene.add
      .particles(4, 4, 'sheet', {
        frame: 3,
        lifespan: 300,
        speed: 40,
        alpha: { start: 0.4, end: 0 },
      })
      .stop()
      .setDepth(2)

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
    this.particles.setConfig({
      frame: 3,
      lifespan: 300,
      speed: 40,
      alpha: { start: 0.4, end: 0 },
      angle: { start: 0, end: 360, steps: 6 },
      tint: 0xffaa00,
      scale: 1,
    })
    this.particles.setPosition(this.x + 4, this.y + 4).explode(6)
    this.fadeTween?.remove()
  }

  private fadeOut = () => {
    const m = this.sceneRef.player.multiIndex
    this.fadeTween = this.sceneRef.tweens.add({
      targets: this,
      alpha: -0.15,
      delay: (COIN_LIFETIME / 2) * 100 - COIN_LIFETIME_DECREASE * 100 * m,
      duration: (COIN_LIFETIME / 2) * 100 - COIN_LIFETIME_DECREASE * 100 * m,
      onComplete: () => {
        this.sceneRef.player.resetMulti()
        this.particles.setConfig({
          frame: 3,
          lifespan: 300,
          speed: 40,
          alpha: { start: 0.4, end: 0 },
          scale: 0.65,
          tint: 0xffffff,
          angle: { start: 0, end: 360, steps: 3 },
        })
        this.particles.setPosition(this.x + 4, this.y + 4).explode(3)
        this.setVisible(false)
        this.setActive(false)
      },
    })
  }
}
