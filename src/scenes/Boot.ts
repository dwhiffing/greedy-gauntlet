import { Scene } from 'phaser'
import { ANIMATIONS } from '../constants'

export class Boot extends Scene {
  constructor() {
    super('Boot')
  }

  init() {
    const bar = this.add.rectangle(0, 0, 0, 64, 0xffffff).setOrigin(0, 0)
    this.load.on('progress', (progress: number) => {
      bar.width = 64 * progress
    })
  }

  preload() {
    this.load.setPath('assets')
    this.load.bitmapFont('pixel-dan', 'pixel-dan.png', 'pixel-dan.xml')
    this.load.image('title', 'title.png')
    this.load.spritesheet('sheet', 'sheet.png', {
      frameWidth: 9,
      frameHeight: 9,
    })
    this.load.spritesheet('tiles', 'tiles.png', {
      frameWidth: 8,
      frameHeight: 8,
    })

    this.load.setPath('assets/audio')
    this.load.audio('player-hit', 'player-hit.mp3')
    this.load.audio('player-regen', 'player-regen.mp3')
    this.load.audio('gameover', 'game-over.mp3')
    this.load.audio('arrow-spawn', 'attack-spawn.mp3')
    this.load.audio('arrow-launch', 'attack-launch.mp3')
    this.load.audio('grab-coin', 'coin-hit.mp3')
    this.load.audio('multi-down', 'multi-down.mp3')
    this.load.audio('multi-up', 'multi-up.mp3')
    this.load.audio('music', 'music-crispy.mp3')
  }

  create() {
    ANIMATIONS.forEach((a) => this.anims.create(a))
    this.scene.start('Game')
  }
}
