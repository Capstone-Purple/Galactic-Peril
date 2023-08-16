const Phaser = require("phaser");
const Player = require("./player.js").default;
const {loadAssets, placeMenus} = require("./boilerplate.js").default;

let player;
let platform;
let backgroundLayer;
const moveSpeed = 1;

class beginningScene extends Phaser.Scene {
  constructor() {
    super({ key: "beginningScene" });
    this.musicPlaying = false;
  }

  preload() {
    loadAssets(this);
    // this.load.image("background-tiles", "tilesets/Starfield_1.png");
    // this.load.image("floor-tiles", "tilesets/A5_SciFi.png");
    // this.load.image("wall-tiles", "tilesets/Ship2_Bottom.png");
    // this.load.image("medical1-tiles", "tilesets/SciFi_Medical.png");
    // this.load.image("medical2-tiles", "tilesets/SciFi_Deco_1.png");
    this.load.tilemapTiledJSON(
      "beginningSceneShip",
      "tilesets/Starship-Map-Beginning-Scene.json"
    );
    // this.load.spritesheet("captain", "/images/YappinToTheCaptain.png", {
    //   frameWidth: 80,
    //   frameHeight: 80,
    // });
    // this.load.audio("background-music", ["music/background-music.mp3"]);
    // this.load.audio("laser-sound", ["/music/laser-sound.mp3"]);
  }

  create() {
    const map = this.make.tilemap({ key: "beginningSceneShip" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );
    const floorTileset = map.addTilesetImage("floor", "floor-tiles");
    const wallTileset = map.addTilesetImage("wall1", "wall-tiles");

    const medical1Tileset = map.addTilesetImage("medical1", "medical1-tiles");
    const medical2Tileset = map.addTilesetImage("medical2", "medical2-tiles");

    if (!this.musicPlaying) {
      this.music = this.sound.add("background-music");
      const musicConfig = {
        mute: false,
        volume: 0.3,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0,
      };
      this.music.play(musicConfig);
      this.musicPlaying = true;
    }

    map.createLayer("Background", backgroundTileset, 0, 0);
    const floorLayer = map.createLayer("Ground", floorTileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", wallTileset, 0, 0);
    const medicalLayer = map.createLayer(
      "Medical",
      [medical1Tileset, medical2Tileset],
      0,
      0
    );

    wallsLayer.setCollisionByProperty({ collides: true });
    medicalLayer.setCollisionByProperty({ collides: true });

    const prevRoom = this.registry.get("prevRoom");
    console.log(prevRoom);
    player = new Player(this, 260, 250);
    this.physics.add.collider(player.sprite, [
      floorLayer,
      wallsLayer,
      medicalLayer,
    ]);
    this.registry.set("prevRoom", "beginningScene");

    platform = this.physics.add.staticGroup();
    let door = platform.create(1125, 325, "door").setAlpha(50);
    this.physics.add.collider(
      player.sprite,
      door,
      function () {
        this.scene.start("Cafeteria");
      },
      null,
      this
    );

    //new scene text and duration
    let enterSceneText = "What's going on? Where is everyone!?";
    const displayTime = 7000;
    
    player.enterNewScene(this, enterSceneText, displayTime);
    placeMenus(this, player);
  }

  update() {
    player.update();
  }
}

module.exports = beginningScene;
