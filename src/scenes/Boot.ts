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
    // this.load.multiatlas('sheet', 'sheet.json')
    // this.load.spritesheet('tiles', 'tiles.png', {
    //   frameWidth: 16,
    //   frameHeight: 16,
    // })
  }

  create() {
    // this.scene.start('Game')
    // this.sound.play('music', { loop: true, volume: 0.5 })
    this.scene.start('Menu')
  }
}
