const Phaser = require("phaser");
const Player = require("./player.js").default;
import Example2 from "./Example2";

let player;
let platform;

let config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 1000,
  physics: {
    default: "arcade",
  },
  scene: [
    {
      preload: preload,
      create: create,
      update: update,
    },
    Example2,
  ],
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image("floor-tiles", "tilesets/A5_SciFi.png");
  this.load.image("wall-tiles", "tilesets/Ship2_Bottom.png");
  this.load.image("machinary1-tiles", "tilesets/SciFi_Computers_1.png");
  this.load.image("machinary2-tiles", "tilesets/SciFi_Computers_2.png");
  this.load.image("screens-tiles", "tilesets/!$ViewScreen_7.png");
  this.load.image("door-tiles", "/tilesets/!$Objects_1.png");
  this.load.tilemapTiledJSON("starship", "tilesets/Starship-Map.json");
  // this.load.image('ship', '/images/Ship3_Bottom.png');
  // this.load.image('space', '/images/Background.png');
  // this.load.image('alien', '/images/Aliens.png');
  // this.load.image('door', '/images/ShipDoor.png');
  // this.load.image('background', '/Starship-Map.png');
  this.load.spritesheet("captain", "/images/YappinToTheCaptain.png", {
    frameWidth: 80,
    frameHeight: 80,
  });
}

function create() {
  const map = this.make.tilemap({ key: "starship" });
  const floorTileset = map.addTilesetImage("floor", "floor-tiles");
  const wallTileset = map.addTilesetImage("wall1", "wall-tiles");
  const machinary1Tileset = map.addTilesetImage(
    "machinary1",
    "machinary1-tiles"
  );
  const machinary2Tileset = map.addTilesetImage(
    "machinary2",
    "machinary2-tiles"
  );
  const screensTileset = map.addTilesetImage("screens", "screens-tiles");
  const doorTileset = map.addTilesetImage("door", "door-tiles");

  map.createLayer("Ground", floorTileset, 0, 0);
  const wallsLayer = map.createLayer("Walls", wallTileset, 0, 0);

  const machinaryAndScreensLayer = map.createLayer(
    "Machinary-and-Screens",
    [machinary1Tileset, machinary2Tileset, screensTileset],
    0,
    0
  );

  const doorLayer = map.createLayer("Door", doorTileset, 0, 0);

  wallsLayer.setCollisionByProperty({ collides: true });
  machinaryAndScreensLayer.setCollisionByProperty({ collides: true });
  doorLayer.setCollisionByProperty({ collides: true });

  player = new Player(this, 400, 300);
  this.physics.add.collider(player.sprite, [
    wallsLayer,
    machinaryAndScreensLayer,
    doorLayer,
  ]);

  // platform = this.physics.add.staticGroup();
  // let door = platform.create(160, 0, 'door').setAlpha(0);
  // this.physics.add.collider(player.sprite, door, function () {
  //     this.scene.start('Example2')
  // }, null, this);
}

function update() {
  player.update();
}
