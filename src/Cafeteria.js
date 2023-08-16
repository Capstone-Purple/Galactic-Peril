const Phaser = require("phaser");
const Player = require("./player.js").default;
const {placeMenus, loadAssets} = require("./boilerplate.js").default;

let player;
let platform;
let vending1,plate1,plate2;

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

      const floorTileSet = map.addTilesetImage('floor', 'floorTiles');
      const wallTileSet = map.addTilesetImage('wall', 'wallTiles');
      const furnitureTileSet = map.addTilesetImage('furniture', 'furnitureTiles');
      const door1TileSet = map.addTilesetImage('door', 'door1Tile');
      const door2TileSet = map.addTilesetImage('door', 'door2Tile');

      map.createLayer("Background", backgroundTileset, 0, 0);
      
      const floorLayer = map.createLayer("Floors", floorTileSet, 0, 0);
      const wallLayer = map.createLayer("Walls", wallTileSet, 0, 0);
      const furnitureLayer = map.createLayer("Furniture", furnitureTileSet, 0, 0);
      const door1Layer = map.createLayer("Door1", door1TileSet, 0, 0);
      const door2Layer = map.createLayer("Door2", door2TileSet, 0, 0);

      wallLayer.setCollisionByProperty({ collides: true });
      furnitureLayer.setCollisionByProperty({ collides: true });
      door1Layer.setCollisionByProperty({ collides: true });
      door2Layer.setCollisionByProperty({ collides: true });


      
      player = new Player(this, 260, 250);
      this.physics.add.collider(player.sprite, [
        wallLayer,
        furnitureLayer
      ]);
      player.inventory.display();

      this.physics.add.collider(player.sprite,door1Layer, function () {
        this.scene.start("beginningScene")
      },null,this);

      this.physics.add.collider(player.sprite,door2Layer, function () {
        this.scene.start("Scene1")
      },null,this);

      player.sprite.setDepth(1)
      player.healthBar.bar.setDepth(10)
      this.add.image(705,113, "smallText")

      platform = this.physics.add.staticGroup();
      vending1 = platform.create(570, 97, "vendingM");
      plate1 = platform.create(660, 85, "plate1")
      plate2 = platform.create(752, 80, "plate2")
      let collision;

      this.physics.add.overlap(player.sprite, vending1, function() {
        collision = vending1;
      }, null, this);

      this.physics.add.overlap(player.sprite, plate1, function() {
        collision = plate1;
      }, null, this);

      this.physics.add.overlap(player.sprite, plate2, function() {
        collision = plate2;
      }, null, this);

      this.input.keyboard.on("keyup-SPACE", function() {
        if (collision) {
          if (collision === vending1) {
            player.acquireItem(collision.texture.key);
            collision.destroy()
            // vending1.destroy();
            // collision = false;
            setTimeout(() => {
              collision = null;
              vending1 = platform.create(570, 97, "vendingM");
              this.physics.add.overlap(player.sprite, vending1, function() {
                collision = vending1;
              }, null, this);
            }, 3000);
          } else if (collision === plate1) {
            player.acquireItem(collision.texture.key);
            collision.destroy();
            setTimeout(() => {
              collision = null;
              plate1 = platform.create(660, 85, "plate1")
              this.physics.add.overlap(player.sprite, plate1, function() {
                collision = plate1;
              }, null, this);
            }, 3000);
          } else if (collision === plate2) {
            player.acquireItem(collision.texture.key);
            collision.destroy();
            setTimeout(() => {
              collision = null;
              plate2 = platform.create(752, 80, "plate2")
              this.physics.add.overlap(player.sprite, plate2, function() {
                collision = plate2;
              }, null, this);
            }, 3000);
          } else { collision = null }
        }
      }, this);

    placeMenus(this, player);

    //new scene text and duration
    let enterSceneText = "                                                     Great, the cafeteria! This looks like a good place to get something to eat.";
    const displayTime = 7000;

    player.enterNewScene(this, enterSceneText, displayTime);
      this.input.keyboard.on("keyup-ENTER", function() {
        if (collision) {
          plate1.destroy();
          // plate1.setVisible(true);
          collision = false;
          setTimeout(() => {
            // plate1.setVisible(false);
            plate1 = platform.create(660, 85, "plate1")
            this.physics.add.overlap(player.sprite, plate1, function() {
              collision = true;
            }, null, this);
          }, 3000);
        }
      }, this);

      plate2 = platform.create(752, 80, "plate2")
      // plate2.setVisible(false)
      this.physics.add.overlap(player.sprite, plate2, function() {
        collision = true;
      }, null, this);

      this.input.keyboard.on("keyup-ENTER", function() {
        if (collision) {
          // plate2.setVisible(true);
          player.acquireItem(plate2.texture.key);
          plate2.destroy()
          collision = false;
          setTimeout(() => {
            // plate2.setVisible(false)
            plate2 = platform.create(752, 80, "plate2")
            this.physics.add.overlap(player.sprite, plate2, function() {
              collision = true;
            }, null, this);
          }, 3000);
        }
      }, this);
      placeMenus(this);
    }

    update() {
      player.update()
    }
  }

  module.exports =  Cafeteria;