import { Scene } from 'phaser'

export class Floor {
  public sceneRef: Scene

  constructor(scene: Scene) {
    this.sceneRef = scene

    const map = this.sceneRef.make.tilemap({
      data: getFloorData(),
      tileWidth: 8,
      tileHeight: 8,
    })
    const tiles = map.addTilesetImage('tilesv1', 'tiles', 8, 8)!
    map.createLayer(0, tiles, 0, 0)
  }
}

const getFloorData = () =>
  Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => (row + col) % 2),
  )
