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
import { ISpawn, LEVELS } from '../constants'

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
  private spawnPool: ISpawn[]
  public titleTextTween?: Phaser.Tweens.Tween

  constructor() {
    super('Game')
  }

  create(): void {
    this.camera = this.cameras.main
    this.camera.fadeFrom(500, 0, 0, 0)
    this.input.keyboard!.on('keydown-M', () => {
      this.game.sound.setMute(!this.game.sound.mute)
    })
    this.input.keyboard!.on('keydown', this.startGame)

    this.floor = new Floor(this)
    this.player = new Player(this)
    this.text = new FadingBitmapText(this)

    this.title = this.add.image(32, 28, 'title').setDepth(10)

    this.spawnPool = []
    this.titleText = this.add
      .bitmapText(32, 64, 'pixel-dan', 'PRESS ARROW KEY')
      .setTintFill(0xffffff)
      .setFontSize(5)
      .setOrigin(0.5, 1)
      .setDepth(10)

    this.titleTextTween = this.tweens.add({
      targets: this.titleText,
      alpha: { from: 1, to: 0.4 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

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
    this.data.set('gameover', 1)

    this.time.addEvent({ repeat: -1, delay: 100, callback: this.tick })
    this.time.addEvent({ repeat: -1, delay: 5, callback: this.arrowTick })
  }

  startGame = (e: any) => {
    if (!e.key.includes('Arrow') || this.data.get('gameover') === 0) return

    this.data.set('gameover', 0)
    this.data.set('score', 0)
    this.playSound('game-start')

    this.titleTextTween?.pause()
    this.player.onRevive()
    this.tweens.add({
      targets: [this.titleText, this.scoreText, this.title],
      alpha: 0,
      duration: 500,
      onComplete: () => {
        this.data.set('paused', 0)
        this.data.set('waveTimer', 0)
        this.data.set('arrowTick', 0)
        this.updateDifficulty(0)
      },
    })
  }

  gameover = () => {
    this.title.y = 14
    this.data.set('paused', 1)
    this.scoreText.setText(`SCORE\n${this.data.get('score') ?? 0}`)
    this.tweens.add({
      targets: [this.scoreText, this.title, this.titleText],
      alpha: 1,
      duration: 1500,
      onComplete: () => {
        this.titleTextTween?.restart()
        this.data.set('gameover', 1)
      },
    })
  }

  updateDifficulty(n: number) {
    this.data.set('difficulty', n)
    const d = this.data.get('difficulty')
    this.data.set('waveRate', LEVELS[d].waveRate)
    this.data.set('arrowSpeed', LEVELS[d].arrowSpeed)
    this.data.set('attackDelay', LEVELS[d].attackDelay)
  }

  tick = () => {
    for (let i = 1; i < LEVELS.length; i++) {
      if (this.data.get('score') >= LEVELS[i].milestone)
        this.updateDifficulty(i)
    }

    this.arrowSpawner.tick()
    this.spikeSpawner.tick()
    this.coinSpawner.tick()
    this.coinSpawner.spawnNextWave()

    if (this.data.get('waveTimer') === 0) {
      this.data.set('waveTimer', this.data.get('waveRate'))
      if (this.spawnPool.length === 0) {
        this.spawnPool = Phaser.Math.RND.shuffle([
          ...LEVELS[this.data.get('difficulty')].pool,
        ])
      }

      const spawn = this.spawnPool.shift()!
      if (spawn.type === 'arrow') {
        this.arrowSpawner.spawnNextWave(spawn)
      } else if (spawn.type === 'spike') {
        this.spikeSpawner.spawnNextWave(spawn)
      }
    }

    this.data.inc('waveTimer', -1)
  }

  arrowTick = () => {
    if (this.data.get('arrowTick') <= 0) {
      this.data.set('arrowTick', this.data.get('arrowSpeed'))
      this.arrows.children.each((arrow: Phaser.GameObjects.GameObject) => {
        const a = arrow as Arrow
        if (a.active) a.move()
        return null
      })
    }

    this.data.inc('arrowTick', -1)
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
        if (this.player.isTangible && enemy.getIsTangible()) {
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
