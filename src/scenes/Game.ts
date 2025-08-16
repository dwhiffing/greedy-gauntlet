import { Cameras, GameObjects, Physics, Scene } from 'phaser'
import { Floor } from '../entities/Floor'
import { Player } from '../entities/Player'
import { Arrow } from '../entities/Arrow'
import { ArrowSpawner } from '../entities/ArrowSpawner'
import { SpikeSpawner } from '../entities/SpikeSpawner'
import { Spike } from '../entities/Spike'
import { Coin } from '../entities/Coin'
import { CoinSpawner } from '../entities/CoinSpawner'
import { FadingBitmapText } from '../entities/FadingBitmapText'

export class Game extends Scene {
  public camera!: Cameras.Scene2D.Camera
  public floor!: Floor
  public player!: Player
  public arrows!: Physics.Arcade.Group
  public spikes!: Physics.Arcade.Group
  public coins!: Physics.Arcade.Group
  public text!: FadingBitmapText
  public arrowSpawner!: ArrowSpawner
  public spikeSpawner!: SpikeSpawner
  public coinSpawner!: CoinSpawner
  public titleText!: GameObjects.BitmapText
  public scoreText!: GameObjects.BitmapText
  public title!: GameObjects.Image

  constructor() {
    super('Game')
  }

  create(): void {
    this.camera = this.cameras.main
    this.camera.fadeFrom(500, 0, 0, 0)
    this.input.keyboard!.on('keydown-M', () => {
      this.game.sound.setMute(!this.game.sound.mute)
    })
    this.input.keyboard!.once('keydown', this.startGame)

    this.floor = new Floor(this)
    this.player = new Player(this)
    this.text = new FadingBitmapText(this)

    this.title = this.add.image(32, 28, 'title').setDepth(10)

    this.titleText = this.add
      .bitmapText(32, 64, 'pixel-dan', 'PRESS ANY KEY')
      .setTintFill(0xffffff)
      .setFontSize(5)
      .setOrigin(0.5, 1)
      .setDepth(10)

    this.scoreText = this.add
      .bitmapText(32, 42, 'pixel-dan', '')
      .setCenterAlign()
      .setTintFill(0xffffff)
      .setFontSize(5)
      .setOrigin(0.5, 0.5)
      .setDepth(10)

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

    this.data.set('paused', 1)
    this.updateDifficulty(0)

    this.time.addEvent({ repeat: -1, delay: 100, callback: this.tick })
    this.time.addEvent({ repeat: -1, delay: 5, callback: this.arrowTick })
  }

  startGame = () => {
    this.data.set('paused', 0)
    this.data.set('score', 0)
    this.data.set('waveTimer', 0)
    this.data.set('arrowTick', 0)

    this.player.onRevive()
    this.tweens.add({
      targets: [this.titleText, this.scoreText, this.title],
      alpha: 0,
      duration: 500,
    })
  }

  gameover = () => {
    this.data.set('paused', 1)

    this.scoreText.setText(`SCORE\n${this.data.get('score') ?? 0}`)
    this.tweens.add({
      targets: [this.scoreText, this.title],
      alpha: 1,
      duration: 500,
    })
    this.title.y = 14
    this.time.delayedCall(2000, () => {
      this.tweens.add({ targets: [this.titleText], alpha: 1, duration: 500 })
      this.input.keyboard!.once('keydown', this.startGame)
    })
  }

  updateDifficulty(n: number) {
    this.data.set('difficulty', n)
    const d = this.data.get('difficulty')
    if (d === 0) {
      this.data.set('waveRate', 35)
      this.data.set('attackDelay', 20)
      this.data.set('arrowSpeed', 5)
    } else if (d === 1) {
      this.data.set('waveRate', 20)
      this.data.set('attackDelay', 15)
      this.data.set('arrowSpeed', 4)
    } else if (d === 2) {
      this.data.set('waveRate', 15)
      this.data.set('attackDelay', 10)
      this.data.set('arrowSpeed', 3)
    } else if (d === 3) {
      this.data.set('waveRate', 10)
      this.data.set('attackDelay', 5)
      this.data.set('arrowSpeed', 2)
    }
  }

  tick = () => {
    if (this.data.get('score') >= 25) this.updateDifficulty(1)
    if (this.data.get('score') >= 100) this.updateDifficulty(2)
    if (this.data.get('score') === 250) this.updateDifficulty(3)

    this.arrowSpawner.tick()
    this.spikeSpawner.tick()
    this.coinSpawner.tick()
    this.coinSpawner.spawnNextWave()

    if (this.data.get('waveTimer') === 0) {
      this.data.set('waveTimer', this.data.get('waveRate'))
      const d = this.data.get('difficulty')
      if (d === 0) {
        this.arrowSpawner.spawnNextWave()
      } else if (d === 3) {
        this.arrowSpawner.spawnNextWave()
        this.spikeSpawner.spawnNextWave()
      } else {
        if (Phaser.Math.RND.between(0, 1) === 0) {
          this.arrowSpawner.spawnNextWave()
        } else {
          this.spikeSpawner.spawnNextWave()
        }
      }
    }

    this.data.inc('waveTimer', -1)
  }

  arrowTick = () => {
    this.data.inc('arrowTick', -1)
    if (this.data.get('arrowTick') > 0) return
    this.data.set('arrowTick', this.data.get('arrowSpeed'))
    this.arrows.children.each((arrow: Phaser.GameObjects.GameObject) => {
      const a = arrow as Arrow
      if (a.active) a.move()
      return null
    })
  }

  update(_time: number, _delta: number): void {
    this.player.update()
    this.text.update()
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

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus()) this.sound.play(key, extra)
  }

  async sleep(ms: number) {
    return new Promise((resolve) => {
      this.time.addEvent({ callback: resolve, delay: ms })
    })
  }
}
