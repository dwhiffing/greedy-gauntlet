import { Physics, Math as PhaserMath, Input } from 'phaser'
import { Game } from '../scenes/Game'

export class Player extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  private keyW: Input.Keyboard.Key
  private keyA: Input.Keyboard.Key
  private keyS: Input.Keyboard.Key
  private keyD: Input.Keyboard.Key

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 0)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setSize(5, 6)
    this.setOffsets(false)

    if (!scene.input || !scene.input.keyboard) {
      throw new Error('Keyboard input system is not available.')
    }
    this.keyW = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.UP)
    this.keyA = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.LEFT)
    this.keyS = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.DOWN)
    this.keyD = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.RIGHT)
  }

  public update(): void {
    this.handlePlayerInput()
  }

  public takeDamage() {
    this.setActive(false)
    if (`${this.frame.name}` === '1') {
      this.onDeath()
    } else {
      this.setAlpha(0.5)
      this.setFrame(1)
      this.sceneRef.time.addEvent({
        delay: 500,
        callback: () => {
          this.setAlpha(1)
          this.setActive(true)
        },
      })
      this.sceneRef.time.addEvent({
        delay: 3000,
        callback: () => this.setFrame(0),
      })
    }
  }

  public onDeath = () => {
    const s = this.sceneRef
    this.setImmovable(true)
    const onUpdate = (_: any, p: number) => p === 1 && s.scene.start('Menu')
    s.tweens.add({
      targets: this,
      alpha: 0,
      duration: 500,
      onComplete: () => s.cameras.main.fade(500, 0, 0, 0, true, onUpdate),
    })
  }

  public setOffsets(flip = false) {
    this.setFlipX(flip)
    this.setOrigin(flip ? -0.1 : 0.2, 0.2).setOffset(flip ? 1 : 3, 2)
  }

  private isTweening: boolean = false

  private handlePlayerInput(): void {
    if (!this.body || this.isTweening) return

    const m: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0)

    if (this.keyW.isDown) m.y = -1
    else if (this.keyS.isDown) m.y = 1

    if (this.keyA.isDown) m.x = -1
    else if (this.keyD.isDown) m.x = 1

    if (m.length() > 0) {
      const targetX = PhaserMath.Clamp(this.x + m.x * 8, 0, 56)
      const targetY = PhaserMath.Clamp(this.y + m.y * 8, 0, 56)
      this.tweenTo(targetX, targetY, m.x)
    }
  }

  private tweenTo(targetX: number, targetY: number, dirX: number) {
    this.isTweening = true
    if (dirX !== 0) {
      this.setOffsets(dirX < 0)
    }
    this.sceneRef.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: 150,
      onComplete: () => {
        this.isTweening = false
        // Immediately check for held keys and move again if needed
        this.handlePlayerInput()
      },
    })
  }
}
