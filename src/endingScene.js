const Phaser = require("phaser");
const Player = require("./player.js").default;

let player;

class endingScene extends Phaser.Scene {
  constructor() {
    super({ key: "endingScene" });
  }

  preload() {
    this.load.image("floor-tiles", "tilesets/A5_SciFi.png");
    this.load.image("door-tiles", "tilesets/!$Objects_1.png");
    this.load.image("door-frame-tiles", "tilesets/SciFi_Deco_4.png");
    this.load.tilemapTiledJSON(
      "endSceneShip",
      "tilesets/Starship-Map-Ending-Scene.json"
    );
    this.load.spritesheet("captain", "/images/YappinToTheCaptain.png", {
      frameWidth: 80,
      frameHeight: 80,
    });
  }

  create() {
    const map = this.make.tilemap({ key: "endSceneShip " });
    const floorTileset = map.addTilesetImage("floor", "floor-tiles");
    const doorTileset = map.addTilesetImage("door", "door-tiles");
    const doorFrameTileset = map.addTilesetImage("door", "door-frame-tiles");

    const floorLayer = map.createLayer("Ground", floorTileset, 0, 0);
    const doorLayer = map.createLayer("Door", doorTileset, 0, 0);
    const doorFrameLayer = map.createLayer(
      "Door-Frame",
      doorFrameTileset,
      0,
      0
    );

    floorLayer.setCollisionByProperty({ collides: true });
    doorLayer.setCollisionByProperty({ collides: true });
    doorFrameLayer.setCollisionByProperty({ collides: true });

    player = new Player(this, 400, 200);
    this.physics.add.collider(player.sprite, [
      floorLayer,
      doorLayer,
      doorFrameLayer,
    ]);
  }

  update() {
    player.update();
  }
}

module.exports = endingScene;
