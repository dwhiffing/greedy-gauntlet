import { Cameras, Physics, Scene } from 'phaser'
import { Floor } from '../entities/Floor'
import { Player } from '../entities/Player'
import { Arrow } from '../entities/Arrow'
import { ArrowSpawner } from '../entities/ArrowSpawner'
import { SpikeSpawner } from '../entities/SpikeSpawner'
import { Spike } from '../entities/Spike'
import { Coin } from '../entities/Coin'
import { CoinSpawner } from '../entities/CoinSpawner'

export class Game extends Scene {
  public camera!: Cameras.Scene2D.Camera
  public floor!: Floor
  public player!: Player
  public arrows!: Physics.Arcade.Group
  public spikes!: Physics.Arcade.Group
  public coins!: Physics.Arcade.Group
  public arrowSpawner!: ArrowSpawner
  public spikeSpawner!: SpikeSpawner
  public coinSpawner!: CoinSpawner
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

    this.coins = this.physics.add.group({
      classType: Coin,
      runChildUpdate: true,
    })

    this.arrowSpawner = new ArrowSpawner(this)
    this.spikeSpawner = new SpikeSpawner(this)
    this.coinSpawner = new CoinSpawner(this)

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
            this.coinSpawner.tick()
          },
        })
        this.time.addEvent({
          repeat: -1,
          delay: 50,
          callback: () => {
            this.arrows.children.each(
              (arrow: Phaser.GameObjects.GameObject) => {
                const a = arrow as Arrow
                if (a.active) a.move()
                return null
              },
            )
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
    this.physics.overlap(this.player, this.coins, (_player, _coin) => {
      const player = _player as Player
      const coin = _coin as Coin
      if (this.player.active && coin.active) {
        coin.pickup()
        player.grabCoin()
      }
    })
  }

  gameover = () => {
    const onUpdate = (_: any, p: number) => p === 1 && this.scene.start('Menu')
    this.time.delayedCall(250, () => {
      this.cameras.main.fade(500, 0, 0, 0, true, onUpdate)
    })
  }

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus()) this.sound.play(key, extra)
  }
}
