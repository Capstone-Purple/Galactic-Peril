const Phaser = require("phaser");
const Player = require("./player.js").default;
const { loadAssets, placeMenus } = require("./boilerplate.js").default;

let player;
let platform;
let backgroundLayer;
const moveSpeed = 1;

class beginningScene extends Phaser.Scene {
  constructor() {
    super({ key: "beginningScene" });
  }

  preload() {
    loadAssets(this);
    this.load.tilemapTiledJSON(
      "beginning",
      "tilesets/Starship-Map-Beginning-Scene.json"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "beginning" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );
    const floorTileset = map.addTilesetImage("floor", "floor-tiles");
    const wallTileset = map.addTilesetImage("wall1", "wall-tiles");
    const wall2Tileset = map.addTilesetImage("wall", "wall2-tiles");
    const doorTileset = map.addTilesetImage("door", "door-tiles");
    const medical1Tileset = map.addTilesetImage("medical1", "medical1-tiles");
    const medical2Tileset = map.addTilesetImage("medical2", "medical2-tiles");

    map.createLayer("Background", backgroundTileset, 0, 0);
    const floorLayer = map.createLayer("Ground", floorTileset, 0, 0);
    const wallsLayer = map.createLayer(
      "Walls",
      [wallTileset, wall2Tileset],
      0,
      0
    );
    const doorLayer = map.createLayer("Door", doorTileset, 0, 0);
    const medicalLayer = map.createLayer(
      "Medical",
      [medical1Tileset, medical2Tileset],
      0,
      0
    );

    wallsLayer.setCollisionByProperty({ collides: true });
    medicalLayer.setCollisionByProperty({ collides: true });
    // doorLayer.setCollisionByProperty({ collides: true });

    const prevRoom = this.registry.get("prevRoom");
    console.log(prevRoom);
    if (prevRoom === "Hall") {
      player = new Player(this, 900, 315);
    } else {
        player = new Player(this, 260, 250);
        //new scene text and duration
        let enterSceneText = "What's going on? Where is everyone!?";
        const displayTime = 7000;
        player.enterNewScene(this, enterSceneText, displayTime);
    }

    if(!prevRoom) {
      let loadedPlayer = localStorage.getItem("player");
      if (loadedPlayer) {
        let location = JSON.parse(loadedPlayer);
        player.sprite.setPosition(location.x, location.y);
        let loadHealth = localStorage.getItem("PlayerHealth");
        let hBar = JSON.parse(loadHealth);
        player.healthBar.value = hBar;
      }
    }

    this.physics.add.collider(player.sprite, [
      floorLayer,
      wallsLayer,
      medicalLayer,
    ]);
    this.registry.set("prevRoom", "beginningScene");

    platform = this.physics.add.staticGroup();
    let door = platform.create(985, 330, "door").setAlpha(0);
    this.physics.add.collider(
      player.sprite,
      door,
      function () {
        this.scene.start("escapeRoomScene");
      },
      null,
      this
    );

    placeMenus(this, player);
  }

  update() {
    player.update();
  }
}

module.exports = beginningScene;
