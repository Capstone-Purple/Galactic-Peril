const Phaser = require("phaser");
const Player = require("./player.js").default;

let player;
let platform;
let vending1,plate1,plate2;

class Cafeteria extends Phaser.Scene {
    constructor() {
      super({ key: "Cafeteria" });
    }

    preload() {
      this.load.image("vendingM", "/images/vendingmachine.png")
      // this.load.image("background-tiles", "tilesets/Starfield_1.png");
      this.load.image("floorTiles", "tilesets/A5_SciFi.png");
      this.load.image("wallTiles", "tilesets/A4_SciFi.png");
      this.load.image("furnitureTiles", "tilesets/SciFi_Deco_3.png");
      this.load.tilemapTiledJSON(
        "cafeteriaScene",
        "tilesets/cafeteriaScene.json"
      );
      this.load.spritesheet("captain", "/images/YappinToTheCaptain.png", {
        frameWidth: 80,
        frameHeight: 80,
      });
    }

    create() {
      const map = this.make.tilemap({ key: "cafeteriaScene" });
      // const backgroundTileset = map.addTilesetImage(
      //   "background",
      //   "background-tiles"
      // );

      const floorTileSet = map.addTilesetImage('floor', 'floorTiles');
      const wallTileSet = map.addTilesetImage('wall', 'wallTiles');
      const furnitureTileSet = map.addTilesetImage('furniture', 'furnitureTiles');

      const floorLayer = map.createLayer("Floors", floorTileSet, 0, 0);
      const wallLayer = map.createLayer("Walls", wallTileSet, 0, 0);
      const furnitureLayer = map.createLayer("Furniture", furnitureTileSet, 0, 0);

      wallLayer.setCollisionByProperty({ collides: true });
      furnitureLayer.setCollisionByProperty({ collides: true });

      player = new Player(this, 260, 250);
      this.physics.add.collider(player.sprite, [
        wallLayer,
        furnitureLayer
      ]);

      player.sprite.setDepth(1)
      player.healthBar.bar.setDepth(10)

      platform = this.physics.add.staticGroup();
      vending1 = platform.create(570, 97, "vendingM");

      this.physics.add.overlap(player.sprite, vending1, function () {
        this.input.keyboard.on(
          "keyup-ENTER",
          getItem,
          this
        );
      },
      null,
      this
      );

      function getItem(event) {
        this.input.keyboard.off("keyup-ENTER", getItem, this)
        // Vending1.setVisible(false);
        vending1.destroy();
        //code to add drink to inventory to restore health
        setTimeout(() => {
          // Vending1.setVisible(true)
          vending1 = platform.create(570, 97, "vendingM")
          
        }, 3000) //use60000 for 1 minute wait time 
      };

    }

    update() {
      player.update()
    }
  }

  module.exports =  Cafeteria;