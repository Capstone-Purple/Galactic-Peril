const Phaser = require("phaser");
const Player = require("./player.js").default;
const { placeMenus, loadAssets } = require("./boilerplate.js").default;

let player;
let platform;
let vending1, plate1, plate2;

class Cafeteria extends Phaser.Scene {
  constructor() {
    super({ key: "Cafeteria" });
  }

  preload() {
    loadAssets(this);
    this.load.image("floorTiles", "tilesets/A5_SciFi.png");
    this.load.image("wallTiles", "tilesets/A4_SciFi.png");
    this.load.tilemapTiledJSON(
      "cafeteriaScene",
      "tilesets/cafeteriaScene.json"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "cafeteriaScene" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );

    const floorTileSet = map.addTilesetImage("floor", "floorTiles");
    const wallTileSet = map.addTilesetImage("wall", "wallTiles");
    const furnitureTileSet = map.addTilesetImage("furniture", "furnitureTiles");
    const door1TileSet = map.addTilesetImage("door", "door1Tile");
    const door2TileSet = map.addTilesetImage("door", "door2Tile");
    const door3TileSet = map.addTilesetImage("door", "door3Tile");

    map.createLayer("Background", backgroundTileset, 0, 0);

    const floorLayer = map.createLayer("Floors", floorTileSet, 0, 0);
    const wallLayer = map.createLayer("Walls", wallTileSet, 0, 0);
    const furnitureLayer = map.createLayer("Furniture", furnitureTileSet, 0, 0);
    const door1Layer = map.createLayer("Door1", door1TileSet, 0, 0);
    const door2Layer = map.createLayer("Door2", door2TileSet, 0, 0);
    const door3Layer = map.createLayer("Door3", door3TileSet, 0, 0);

    wallLayer.setCollisionByProperty({ collides: true });
    furnitureLayer.setCollisionByProperty({ collides: true });
    door1Layer.setCollisionByProperty({ collides: true });
    door2Layer.setCollisionByProperty({ collides: true });
    door3Layer.setCollisionByProperty({ collides: true });

      const prevRoom = this.registry.get("prevRoom");
      console.log(prevRoom);
      if (prevRoom === "Armory") {
        player = new Player(this, 850, 150);
      } else if (prevRoom === "Scene1") {
        player = new Player(this, 850, 525);
      } else {
        player = new Player(this, 175, 300);
        //new scene text and duration
        let enterSceneText = "Great, the cafeteria! This looks like a good place to get something to eat.";
        const displayTime = 7000;
        player.enterNewScene(this, enterSceneText, displayTime);
      }
      this.physics.add.collider(player.sprite, [
        wallLayer,
        furnitureLayer
      ]);
      player.inventory.display();
      this.registry.set("prevRoom", "Cafeteria");

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

    this.physics.add.collider(
      player.sprite,
      door1Layer,
      function () {
        this.registry.set("health", player.healthBar.value);
        this.scene.start("escapeRoomScene");
      },
      null,
      this
    );

    this.physics.add.collider(
      player.sprite,
      door2Layer,
      function () {
        this.registry.set("health", player.healthBar.value);
        this.scene.start("Scene1");
      },
      null,
      this
    );

    this.physics.add.collider(
      player.sprite,
      door3Layer,
      function () {
        this.registry.set("health", player.healthBar.value);
        this.scene.start("armoryScene");
      },
      null,
      this
    );

    player.sprite.setDepth(1);
    player.healthBar.bar.setDepth(10);
    this.add.image(705, 113, "smallText");

    platform = this.physics.add.staticGroup();
    vending1 = platform.create(570, 97, "vendingM");
    plate1 = platform.create(660, 85, "plate1");
    let collision;

    this.physics.add.overlap(
      player.sprite,
      vending1,
      function () {
        collision = vending1;
        setTimeout(() => {
          collision = null;
        }, 50);
      },
      null,
      this
    );

    this.physics.add.overlap(
      player.sprite,
      plate1,
      function () {
        collision = plate1;
        setTimeout(() => {
          collision = null;
        }, 50);
      },
      null,
      this
    );

    this.input.keyboard.on(
      "keyup-SHIFT",
      function () {
        if (collision) {
          if (collision === vending1) {
            player.acquireItem(collision.texture.key);
            this.registry.set("drinkCollected", true);
            collision.destroy();
          } else if (collision === plate1) {
            player.acquireItem(collision.texture.key);
            this.registry.set("foodCollected", true);
            collision.destroy();
          } else {
            collision = null;
          }
        }
      },
      this
    );

    const drinkCollected = this.registry.get("drinkCollected");
    if (drinkCollected) {
      vending1.disableBody(true, true);
    }

    const foodCollected = this.registry.get("drinkCollected");
    if (foodCollected) {
      plate1.disableBody(true, true);
    }

    placeMenus(this, player);
  }

  update() {
    player.update();
  }
}

module.exports = Cafeteria;
