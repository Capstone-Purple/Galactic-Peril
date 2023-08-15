const Phaser = require("phaser");
const Player = require("./player.js").default;

let player;
let platform;

class endingScene extends Phaser.Scene {
  constructor() {
    super({ key: "endingScene" });
  }

  preload() {
    this.load.image("background-tiles", "tilesets/Starfield_1.png");
    this.load.image("floor-tiles", "tilesets/A5_SciFi.png");
    this.load.image("door-tiles", "tilesets/!$Objects_1.png");
    this.load.image("door-frame-tiles", "tilesets/SciFi_Deco_4.png");
    this.load.image("ship-tiles", "tilesets/!$ViewScreen_1.png");
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
    const map = this.make.tilemap({ key: "endSceneShip" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );
    const floorTileset = map.addTilesetImage("floor", "floor-tiles");
    const doorTileset = map.addTilesetImage("door", "door-tiles");
    const doorFrameTileset = map.addTilesetImage(
      "door-frame",
      "door-frame-tiles"
    );
    const shipTileset = map.addTilesetImage("ship", "ship-tiles");

    map.createLayer("Background", backgroundTileset, 0, 0);
    const floorLayer = map.createLayer("Floor", floorTileset, 0, 0);
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
    map.createLayer("Ship", shipTileset, 0, 0);

    player = new Player(this, 560, 150);
    this.physics.add.collider(player.sprite, [
      floorLayer,
      doorFrameLayer,
      //   doorLayer,
    ]);

    platform = this.physics.add.staticGroup();
    let door = platform.create(560, 450, "door").setAlpha(100);
    this.physics.add.collider(
      player.sprite,
      doorLayer,
      function () {
        this.scene.start("Scene1");
      },
      null,
      this
    );

    this.physics.add.collider(
      player.sprite,
      door,
      function () {
        this.scene.start("endingSpaceShip");
      },
      null,
      this
    );

    //new scene text and duration
    let enterSceneText = "An escape pod! This might be my way out of here.";
    const displayTime = 7000;
    
    player.enterNewScene(this, enterSceneText, displayTime);
  }

  update() {
    player.update();
  }
}

module.exports = endingScene;
