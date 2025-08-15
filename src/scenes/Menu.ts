import { Scene, GameObjects } from 'phaser'

export class Menu extends Scene {
  background: GameObjects.Image
  logo: GameObjects.Image
  title: GameObjects.BitmapText

  constructor() {
    super('Menu')
  }

  create() {
    const { width, height } = this.cameras.main
    this.title = this.add
      .bitmapText(width / 2, height, 'pixel-dan', 'PRESS Z TO START')
      .setTintFill(0x000000)
      .setFontSize(5)
      .setOrigin(0.5, 1)

    // this.add.image(width / 2, height / 2.5, 'title').setScale(2)

    this.cameras.main.fadeFrom(500, 0, 0, 0)
    this.input.keyboard!.on('keydown-M', () => {
      this.game.sound.setMute(!this.game.sound.mute)
    })
    this.input.keyboard!.once('keydown-Z', () => {
      // this.game.sound.play('player-attack')
      this.cameras.main.fade(500, 0, 0, 0, true, (_: any, p: number) => {
        if (p === 1) this.scene.start('Game')
      })
    })
  }
}
