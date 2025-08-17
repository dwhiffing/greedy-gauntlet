import { GameObjects } from 'phaser'
import { Game } from '../scenes/Game'

export class FadingBitmapText extends GameObjects.BitmapText {
  sceneRef: Game
  private activeTweens: Phaser.Tweens.Tween[] = []
  constructor(scene: Game) {
    super(scene, 0, 0, 'pixel-dan', '')
    scene.add.existing(this)
    this.setOrigin(0.5, 0)
    this.sceneRef = scene
    this.setDepth(4)
  }

  update() {
    if (!this.active) return
    const p = this.sceneRef.player
    this.setPosition(p.x + 4, p.y < 5 ? p.y + 8 : p.y - 7)
  }

  spawn(text: string, color = 0xffffff) {
    if (this.text.includes('X') && this.alpha >= 0.5) return
    this.activeTweens.forEach((tween) => tween.remove())
    this.activeTweens = []

    this.setText(text).setTintFill(color)
    this.setAlpha(0)
    const fadeIn = this.scene.tweens.add({
      targets: this,
      alpha: text.includes('X') ? 0.6 : 0.3,
      duration: 150,
    })
    const fadeOut = this.scene.tweens.add({
      targets: this,
      alpha: 0,
      delay: text.includes('X') ? 1200 : 600,
      duration: 400,
      ease: 'Quad.easeOut',
    })
    this.activeTweens.push(fadeIn, fadeOut)
  }
}
