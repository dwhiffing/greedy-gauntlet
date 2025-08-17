import { Physics, Math as PhaserMath, Input, GameObjects } from 'phaser'
import { Game } from '../scenes/Game'

const MULTIPLIERS = [1, 2, 3, 5, 10, 20, 50]
const COMBO_AMOUNTS = [4, 10, 18, 28, 40, 54]
const COLORS = [
  0xaa00ff, 0x0099ee, 0x00aa44, 0xffcc00, 0xff8800, 0xcc3300, 0xff00aa,
]
const HAT_COLORS = [
  0x00aa44, 0xaa00ff, 0xcc3300, 0xff00aa, 0x0099ee, 0xffcc00, 0xff8800,
]

export class Player extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  private keyW: Input.Keyboard.Key
  private keyA: Input.Keyboard.Key
  private keyS: Input.Keyboard.Key
  private keyD: Input.Keyboard.Key
  private lastMoveKey: 'up' | 'down' | 'left' | 'right' | null = null
  public multiIndex = 0
  public coinCombo = 0
  public isTangible = true
  public hat: GameObjects.Sprite
  private isTweening: boolean = false
  private _wasMoving: boolean = false

  constructor(scene: Game) {
    super(scene, 3 * 8, 3 * 8, 'sheet', 1)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.hat = scene.add
      .sprite(3 * 8, 3 * 8, 'sheet', 0)
      .setOrigin(0.2, 0.2)
      .setDepth(3)
      .setAlpha(0)

    this.resetTint()
    this.setSize(5, 6).setDepth(2).setAlpha(0)
    this.setOffsets(false)

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

  public resetTint() {
    this.setTint(COLORS.at(this.multiIndex))
    this.hat.setTint(HAT_COLORS.at(this.multiIndex))
  }

  public update(): void {
    this.handlePlayerInput()
  }

  public async takeDamage() {
    this.isTangible = false
    this.sceneRef.camera.shake(200, 0.02, true)
    if (this.hat.alpha === 0) {
      this.onDeath()
    } else {
      this.sceneRef.playSound('player-hit')

      this.setTintFill(0xffffff)
      this.hat.setAlpha(0)

      await this.sceneRef.sleep(250)
      this.resetTint()

      await this.sceneRef.sleep(250)
      this.isTangible = true

      await this.sceneRef.sleep(5000)
      if (this.active) {
        this.sceneRef.playSound('player-regen')
        this.hat.setAlpha(1)
      }
    }
  }

  public setTintFill(color = 0xffffff): this {
    super.setTintFill(color)
    this.hat.setTintFill(color)
    return this
  }

  public async grabCoin() {
    this.updateMulti()
    this.sceneRef.playSound('grab-coin')
    await this.sceneRef.sleep(150)
  }

  public async updateMulti() {
    if (!this.active) return

    this.coinCombo++
    this.sceneRef.data.inc('score', MULTIPLIERS[this.multiIndex])

    if (this.coinCombo >= COMBO_AMOUNTS[this.multiIndex]) {
      if (this.multiIndex < 6) {
        this.sceneRef.playSound('multi-up')
        this.multiIndex++
        this.sceneRef.text.spawn(`${MULTIPLIERS[this.multiIndex]}X`, 0x00ff00)
      }
    } else {
      this.sceneRef.text.spawn(`${this.sceneRef.data.get('score')}`)
    }
    this.resetTint()
  }

  public async resetMulti() {
    if (!this.active) return

    if (this.multiIndex > 0) {
      this.multiIndex--
      this.coinCombo = COMBO_AMOUNTS[this.multiIndex - 1] ?? 0
      this.sceneRef.text.spawn(`${MULTIPLIERS[this.multiIndex]}X`, 0xff0000)
      this.sceneRef.playSound('multi-down')
      this.resetTint()
    }
  }

  public onRevive = () => {
    this.setImmovable(false).setActive(true)
    this.isTangible = true

    this.multiIndex = 0
    this.coinCombo = 0
    this.isTweening = false
    this._wasMoving = false
    this.resetTint()
    this.sceneRef.tweens.add({
      targets: [this, this.hat],
      alpha: 1,
      duration: 500,
    })
  }

  private onDeath = () => {
    const s = this.sceneRef
    this.setImmovable(true)
    this.setAlpha(0)
    this.hat.setAlpha(0)
    this.setActive(false)

    this.sceneRef.playSound('gameover')

    s.add
      .particles(4, 4, 'sheet', {
        frame: 3,
        lifespan: 400,
        speed: 30,
        scale: 1,
        alpha: { start: 1, end: 0 },
        tint: COLORS.at(this.multiIndex),
        angle: { start: 0, end: 360, steps: 6 },
      })
      .explode(6, this.x, this.y)
    s.gameover()
  }

  private setOffsets(flip = false) {
    this.setFlipX(flip)
    this.hat.setFlipX(flip).setOrigin(flip ? -0.1 : 0.2, 0.2)
    this.setOrigin(flip ? -0.1 : 0.2, 0.2).setOffset(flip ? 1 : 3, 2)
  }

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
      this._wasMoving = true
    } else if (this._wasMoving) {
      this.play('player-idle', true)
      this._wasMoving = false
    }
  }

  private tweenTo(targetX: number, targetY: number, dirX: number) {
    this.isTweening = true
    this.play('player-walk', true)

    if (dirX !== 0) {
      this.setOffsets(dirX < 0)
    }
    this.sceneRef.tweens.add({
      targets: [this, this.hat],
      x: targetX,
      y: targetY,
      duration: this.hat.alpha === 0 ? 220 : 170,
      onComplete: () => {
        this.isTweening = false
        // Immediately check for held keys and move again if needed
        this.handlePlayerInput()
      },
    })
  }
}
