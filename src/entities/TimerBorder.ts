import Phaser from 'phaser'

export class TimerBorder extends Phaser.GameObjects.Graphics {
  public progress: number = 0
  public durationMs: number = 1000
  public size: number = 7
  public alpha: number = 1

  constructor(scene: Phaser.Scene) {
    super(scene)
    scene.add.existing(this)
    this.reset(0, 0, 1000)
    this.redraw()
  }

  preUpdate(_time: number, delta: number) {
    if (this.progress > 1) {
      this.progress = 1
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        delay: 50,
        duration: 550,
      })
    } else if (this.progress < 1) {
      this.progress += delta / this.durationMs
    }
    this.redraw()
  }

  private redraw() {
    this.clear()
    const size = this.size - 1
    const centerX = size / 2 + 1
    const centerY = size / 2 + 1
    const radius = size / 2
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + this.progress * Math.PI * 2
    this.moveTo(centerX, centerY)
    this.arc(centerX, centerY, radius, startAngle, endAngle, false)
    this.fillStyle(0x000102, this.alpha)
    this.fillPath()
  }

  reset(x: number, y: number, durationMs: number) {
    this.progress = 0
    this.setPosition(this.x, this.y)
    this.x = x * 8
    this.y = y * 8
    this.alpha = 0.5
    this.durationMs = durationMs
    this.redraw()
  }
}
