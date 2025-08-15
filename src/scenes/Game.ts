import { Cameras, Physics, Scene } from 'phaser'
import { Floor } from '../entities/Floor'
import { Player } from '../entities/Player'
import { Arrow } from '../entities/Arrow'
import { ArrowSpawner } from '../entities/ArrowSpawner'

export class Game extends Scene {
  public camera!: Cameras.Scene2D.Camera
  public floor!: Floor
  public player!: Player
  public arrows!: Physics.Arcade.Group
  public arrowSpawner!: ArrowSpawner
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

    this.arrows = this.physics.add.group({
      classType: Arrow,
      runChildUpdate: false,
    })
    this.arrowSpawner = new ArrowSpawner(this)

    this.time.addEvent({
      repeat: -1,
      delay: 1000,
      callback: this.arrowSpawner.spawnArrow,
      callbackScope: this.arrowSpawner,
    })
    this.arrowSpawner.spawnArrow()
  }

  update(_time: number, _delta: number): void {
    this.player.update()
    this.physics.overlap(this.player, this.arrows, (_player, _arrow) => {
      const player = _player as Player
      const arrow = _arrow as Arrow
      if (this.player.active) {
        arrow.destroy()
        player.takeDamage()
      }
    })
  }

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus()) this.sound.play(key, extra)
  }
}
