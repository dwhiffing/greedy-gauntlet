import { Cameras, Scene } from 'phaser'

export class Game extends Scene {
  public camera!: Cameras.Scene2D.Camera
  constructor() {
    super('Game')
  }

  create(): void {
    this.camera = this.cameras.main
    this.camera.fadeFrom(500, 0, 0, 0)
    // const { width: w, height: h } = this.camera
    this.input.keyboard!.on('keydown-M', () => {
      this.game.sound.setMute(!this.game.sound.mute)
    })
  }

  update(_time: number, _delta: number): void {}

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus()) this.sound.play(key, extra)
  }
}
