import Phaser from 'phaser'

export class TimerBorder extends Phaser.GameObjects.Graphics {
  public progress: number = 0 // 0 to 1
  public durationMs: number = 1000
  public size: number
  private fadeAlpha: number = 1
  private fading: boolean = false
  private fadeSpeed: number = 0.8 // seconds to fade out
  public flip = false

  constructor(scene: Phaser.Scene) {
    super(scene)
    this.size = 7
    this.durationMs = 1000
    this.setPosition(0, 0)
    scene.add.existing(this)
    this.redraw()
  }

  preUpdate(_time: number, delta: number) {
    if (!this.fading) {
      this.progress += delta / this.durationMs
      if (this.progress >= 1) {
        this.progress = 1
        this.fading = true
      }
    } else {
      this.fadeAlpha -= delta / 1000 / this.fadeSpeed
      if (this.fadeAlpha < 0) this.fadeAlpha = 0
    }
    this.redraw()
  }

  private redraw() {
    this.clear()
    const size = this.size + 1
    const fillWidth = Math.floor(size * this.progress)
    this.fillStyle(0xbb6633, this.fadeAlpha / 3)
    if (this.flip) {
      this.fillRect(0, size, size, -fillWidth)
    } else {
      this.fillRect(0, 0, fillWidth, size)
    }
  }

  reset(x: number, y: number, speed: number, flip: boolean) {
    this.progress = 0
    this.fadeAlpha = 1
    this.fading = false
    this.redraw()
    this.x = x * 8
    this.y = y * 8
    this.durationMs = speed // for compatibility, but should pass durationMs
    this.flip = flip
    // For clarity, you may want to rename 'speed' to 'durationMs' in all usages
  }
}
