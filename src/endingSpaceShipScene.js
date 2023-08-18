const Phaser = require("phaser");

let shipLayer;
const moveSpeed = 4;

class endingSpaceShip extends Phaser.Scene {
  constructor() {
    super({ key: "endingSpaceShip" });
  }

  preload() {
    this.load.image("background-tiles", "tilesets/Starfield_1.png");
    this.load.image("ship-tiles", "tilesets/!$ViewScreen_1.png");
    this.load.tilemapTiledJSON(
      "endingShip",
      "tilesets/Ending-Space-Ship-Scene.json"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "endingShip" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );

    const shipTileset = map.addTilesetImage("ship", "ship-tiles");

    map.createLayer("Background", backgroundTileset, 0, 0);

    shipLayer = map.createLayer("Ship", shipTileset, 0, 0);
    shipLayer.x = -shipLayer.width;
    this.events.on("update", this.updateShipLayer, this);
  }

  updateShipLayer() {
    if (shipLayer.x < this.game.config.width) {
      shipLayer.x += moveSpeed;
    }
  }

  update() {}
}

module.exports = endingSpaceShip;
