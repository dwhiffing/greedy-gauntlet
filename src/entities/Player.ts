import { Physics, Math as PhaserMath, Input } from 'phaser'
import { Game } from '../scenes/Game'

export class Player extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  private keyW: Input.Keyboard.Key
  private keyA: Input.Keyboard.Key
  private keyS: Input.Keyboard.Key
  private keyD: Input.Keyboard.Key
  private lastMoveKey: 'up' | 'down' | 'left' | 'right' | null = null

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 0)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setSize(5, 6)
    this.setOffsets(false)
    this.setDepth(2)

    if (!scene.input || !scene.input.keyboard) {
      throw new Error('Keyboard input system is not available.')
    }
    this.keyW = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.UP)
    this.keyA = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.LEFT)
    this.keyS = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.DOWN)
    this.keyD = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.RIGHT)

    // Listen for keydown events to track last pressed movement key
    scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
          this.lastMoveKey = 'up'
          break
        case 'ArrowDown':
          this.lastMoveKey = 'down'
          break
        case 'ArrowLeft':
          this.lastMoveKey = 'left'
          break
        case 'ArrowRight':
          this.lastMoveKey = 'right'
          break
      }
    })
  }

  public update(): void {
    this.handlePlayerInput()
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => {
      this.sceneRef.time.addEvent({ callback: resolve, delay: ms })
    })
  }

  public async takeDamage() {
    this.setActive(false)
    if (`${this.frame.name}` === '1') {
      this.onDeath()
    } else {
      this.setTintFill(0xffffff)
      this.setFrame(1)

      await this.sleep(200)
      this.clearTint()

      await this.sleep(500)
      this.setAlpha(1)
      this.setActive(true)

      await this.sleep(3000)
      this.setFrame(0)
    }
  }

  public onDeath = () => {
    const s = this.sceneRef
    this.setImmovable(true)
    const onUpdate = (_: any, p: number) => p === 1 && s.scene.start('Menu')
    this.setVisible(false)

    s.add
      .particles(4, 4, 'sheet', {
        frame: 3,
        lifespan: 400,
        speed: 30,
        scale: 1,
        alpha: { start: 1, end: 0 },
        angle: { start: 0, end: 360, steps: 6 },
      })
      .explode(6, this.x, this.y)
    s.time.delayedCall(250, () => {
      s.cameras.main.fade(500, 0, 0, 0, true, onUpdate)
    })
  }

  public setOffsets(flip = false) {
    this.setFlipX(flip)
    this.setOrigin(flip ? -0.1 : 0.2, 0.2).setOffset(flip ? 1 : 3, 2)
  }

  private isTweening: boolean = false

  private handlePlayerInput(): void {
    if (!this.body || this.isTweening || this.body.immovable) return

    const m: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0)
    const keyMap: {
      key: Input.Keyboard.Key
      dir: 'up' | 'down' | 'left' | 'right'
      vec: [number, number]
    }[] = [
      { key: this.keyW, dir: 'up', vec: [0, -1] },
      { key: this.keyS, dir: 'down', vec: [0, 1] },
      { key: this.keyA, dir: 'left', vec: [-1, 0] },
      { key: this.keyD, dir: 'right', vec: [1, 0] },
    ]

    let found = false
    // Try lastMoveKey first
    if (this.lastMoveKey) {
      for (const { key, dir, vec } of keyMap) {
        if (dir === this.lastMoveKey && key.isDown) {
          m.x = vec[0]
          m.y = vec[1]
          found = true
          break
        }
      }
    }
    // If lastMoveKey is released, fall back to any held key (priority order)
    if (!found) {
      for (const { key, dir, vec } of keyMap) {
        if (key.isDown) {
          m.x = vec[0]
          m.y = vec[1]
          this.lastMoveKey = dir
          break
        }
      }
    }

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
