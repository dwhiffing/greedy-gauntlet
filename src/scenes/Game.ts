import { Physics, Scene } from 'phaser'
import { Floor } from '../entities/Floor'
import { Player } from '../entities/Player'
import { Arrow } from '../entities/Arrow'
import { ArrowSpawner } from '../entities/ArrowSpawner'
import { SpikeSpawner } from '../entities/SpikeSpawner'
import { Spike } from '../entities/Spike'
import { Coin } from '../entities/Coin'
import { CoinSpawner } from '../entities/CoinSpawner'
import { FadingBitmapText } from '../entities/FadingBitmapText'
import { UI } from '../entities/UI'
import { ISpawn, LEVELS, TICK_DURATION } from '../constants'

export class Game extends Scene {
  public floor!: Floor
  public player!: Player
  public arrows!: Physics.Arcade.Group
  public spikes!: Physics.Arcade.Group
  public coins!: Physics.Arcade.Group
  public text!: FadingBitmapText
  public arrowSpawner!: ArrowSpawner
  public spikeSpawner!: SpikeSpawner
  public coinSpawner!: CoinSpawner
  private spawnPool: ISpawn[]
  public ui!: UI
  public music: Phaser.Sound.BaseSound

  constructor() {
    super('Game')
  }

  create(): void {
    this.cameras.main.fadeFrom(500, 0, 0, 0)
    this.music = this.sound.add('music', { loop: true, volume: 0.3 })

    this.floor = new Floor(this)
    this.player = new Player(this)
    this.text = new FadingBitmapText(this)
    this.ui = new UI(this)

    this.arrows = this.physics.add.group({ classType: Arrow })
    this.arrowSpawner = new ArrowSpawner(this)

    this.spikes = this.physics.add.group({ classType: Spike })
    this.spikeSpawner = new SpikeSpawner(this)

    this.coins = this.physics.add.group({ classType: Coin })
    this.coinSpawner = new CoinSpawner(this)

    this.spawnPool = []
    this.data.set('paused', 1)
    this.data.set('gameover', 1)
    const highScore = Number(localStorage.getItem('highScore') ?? '0')
    this.data.set('highScore', highScore)
    if (highScore > 0) {
      this.ui.scoreText.setText(`HIGH SCORE\n${highScore}`)
      this.ui.title.y = 14
    }

    this.time.addEvent({
      repeat: -1,
      delay: TICK_DURATION,
      callback: this.tick,
    })
    this.time.addEvent({ repeat: -1, delay: 5, callback: this.arrowTick })

    this.input.keyboard!.on('keydown-M', () => {
      const newMute = !this.game.sound.mute
      this.game.sound.setMute(newMute)
      localStorage.setItem('mute', String(newMute))
    })

    const muteStatus = localStorage.getItem('mute')
    if (muteStatus !== null) {
      this.game.sound.setMute(muteStatus === 'true')
    }

    this.input.keyboard!.on('keydown', (e: any) => {
      if (!e.key.includes('Arrow')) return
      this.startGame()
    })
    this.input.on('pointerdown', this.startGame)
    // this.startGame({ key: 'Arrow' })
  }

  startGame = () => {
    if (this.data.get('gameover') === 0) return

    this.data.set('gameover', 0)
    this.data.set('score', 0)
    this.data.set('play-arrow-launch', true)
    this.spawnPool = []
    this.music.play()

    this.ui.titleTextTween?.pause()
    this.player.onRevive()
    this.tweens.add({
      targets: [this.ui.titleText, this.ui.scoreText, this.ui.title],
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

  gameOver = () => {
    this.data.set('paused', 1)
    this.music.pause()
    this.spawnPool = []

    const score = this.data.get('score') ?? 0
    const prevHighScore = Number(localStorage.getItem('highScore') ?? '0')
    if (score > prevHighScore) {
      localStorage.setItem('highScore', String(score))
      this.data.set('highScore', score)
    }

    this.ui.title.y = 14
    this.ui.scoreText.setText(`HIGH SCORE\n${this.data.get('highScore') ?? 0}`)
    this.tweens.add({
      targets: [this.ui.scoreText, this.ui.title, this.ui.titleText],
      alpha: 1,
      duration: 1500,
      onComplete: () => {
        this.ui.titleTextTween?.restart()
        this.data.set('gameover', 1)
      },
    })
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
      spawn.attacks.forEach((spawn) => {
        if (spawn.type === 'arrow') {
          this.arrowSpawner.spawnNextWave(spawn)
        } else if (spawn.type === 'spike') {
          this.spikeSpawner.spawnNextWave(spawn)
        }
      })
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

  updateDifficulty(n: number) {
    this.data.set('difficulty', n)
    const d = this.data.get('difficulty')
    this.data.set('waveRate', LEVELS[d].waveRate)
    this.data.set('arrowSpeed', LEVELS[d].arrowSpeed)
    this.data.set('attackDelay', LEVELS[d].attackDelay)
  }

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus() && !this.sound.mute) this.sound.play(key, extra)
  }

  async sleep(ms: number) {
    return new Promise((resolve) => {
      this.time.addEvent({ callback: resolve, delay: ms })
    })
  }
}
