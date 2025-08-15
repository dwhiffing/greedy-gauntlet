import { Cameras, Scene } from 'phaser'
import { Floor } from '../entities/Floor'
import { Player } from '../entities/Player'

export class Game extends Scene {
  public camera!: Cameras.Scene2D.Camera
  public floor!: Floor
  public player!: Player
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

    this.floor = new Floor(this)
    this.player = new Player(this)
  }

  update(_time: number, _delta: number): void {
    this.player.update()
  }

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus()) this.sound.play(key, extra)
  }
}
