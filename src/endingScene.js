const Phaser = require("phaser");
const Player = require("./player.js").default;
const { placeMenus, loadAssets } = require("./boilerplate.js").default;

let player;
let platform;

class endingScene extends Phaser.Scene {
  constructor() {
    super({ key: "endingScene" });
  }

  preload() {
    loadAssets(this);
    this.load.tilemapTiledJSON(
      "ending",
      "tilesets/Starship-Map-Ending-Scene.json"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "ending" });
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

    const prevRoom = this.registry.get("prevRoom");
    console.log(prevRoom);
    player = new Player(this, 560, 150);
    this.physics.add.collider(player.sprite, [
      floorLayer,
      doorFrameLayer,
      //   doorLayer,
    ]);
    this.registry.set("prevRoom", "endingScene");

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
    placeMenus(this, player);
  }

  update() {
    player.update();
  }
}

module.exports = endingScene;
