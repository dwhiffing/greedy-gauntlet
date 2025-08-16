import { Cameras, Physics, Scene } from 'phaser'
import { Floor } from '../entities/Floor'
import { Player } from '../entities/Player'
import { Arrow } from '../entities/Arrow'
import { ArrowSpawner } from '../entities/ArrowSpawner'
import { SpikeSpawner } from '../entities/SpikeSpawner'
import { Spike } from '../entities/Spike'

export class Game extends Scene {
  public camera!: Cameras.Scene2D.Camera
  public floor!: Floor
  public player!: Player
  public arrows!: Physics.Arcade.Group
  public spikes!: Physics.Arcade.Group
  public arrowSpawner!: ArrowSpawner
  public spikeSpawner!: SpikeSpawner
  public globalTick!: number

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
      runChildUpdate: true,
    })

    this.spikes = this.physics.add.group({
      classType: Spike,
      runChildUpdate: true,
    })

    this.arrowSpawner = new ArrowSpawner(this)
    this.spikeSpawner = new SpikeSpawner(this)

    this.globalTick = 0
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.time.addEvent({
          repeat: -1,
          delay: 100,
          callback: () => {
            this.arrowSpawner.tick()
            this.spikeSpawner.tick()
          },
        })
      },
    })
  }

  update(_time: number, _delta: number): void {
    this.globalTick++
    this.player.update()
    this.physics.overlap(
      this.player,
      [this.arrows, this.spikes],
      (_player, _enemy) => {
        const player = _player as Player
        const enemy = _enemy as Arrow | Spike
        if (this.player.active && enemy.isTangible()) {
          enemy.takeDamage()
          player.takeDamage()
        }
      },
    )
  }

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus()) this.sound.play(key, extra)
  }
}
