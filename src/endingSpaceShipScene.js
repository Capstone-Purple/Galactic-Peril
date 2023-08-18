const Phaser = require("phaser");
const { Tween, Easing } = Phaser.Tweens;

let shipLayer;
let congratsText;
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

    congratsText = this.add.text(200, 240, "Congratulations", {
      fontFamily: "Comic Sans MS",
      font: "20px Impact",
      color: "black",
    });
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 3500,
      onUpdate: (tween) => {
        const v = tween.getValue();
        const c = 255 * v;
        congratsText.setFontSize(40 + v * 64);
        congratsText.setColor(`rgb(${c}, 0, 0)`); // Adjust the color values as needed
      },
    });

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
