import { Scene } from 'phaser'

export class Boot extends Scene {
  constructor() {
    super('Boot')
  }

  init() {
    this.add
      .rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        468,
        32,
      )
      .setStrokeStyle(1, 0xffffff)
    const bar = this.add.rectangle(
      this.cameras.main.width / 2 - 230,
      this.cameras.main.height / 2,
      4,
      28,
      0xffffff,
    )
    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')
    this.load.bitmapFont('pixel-dan', 'pixel-dan.png', 'pixel-dan.xml')
    this.load.spritesheet('sheet', 'sheet.png', {
      frameWidth: 9,
      frameHeight: 9,
    })
    this.load.spritesheet('tiles', 'tiles.png', {
      frameWidth: 8,
      frameHeight: 8,
    })
  }

  create() {
    this.anims.create({
      key: 'player-walk',
      frames: [
        { key: 'sheet', frame: 6 },
        { key: 'sheet', frame: 7 },
      ],
      frameRate: 8,
      repeat: -1,
    })
    this.anims.create({
      key: 'player-idle',
      frames: [{ key: 'sheet', frame: 1 }],
      frameRate: 10,
      repeat: -1,
    })
    // this.scene.start('Game')
    // this.sound.play('music', { loop: true, volume: 0.5 })
    this.scene.start('Menu')
  }
}
