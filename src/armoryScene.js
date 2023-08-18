const Phaser = require("phaser");
const Player = require("./player.js").default;
const { loadAssets, placeMenus } = require("./boilerplate.js").default;

let player;
let platform;

class armoryScene extends Phaser.Scene {
  constructor() {
    super({ key: "armoryScene" });
  }

  preload() {
    loadAssets(this);
    this.load.tilemapTiledJSON("armory", "tilesets/Armory.json");
  }

  create() {
    const map = this.make.tilemap({ key: "armory" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );
    const floorTileset = map.addTilesetImage("floor", "floor-tiles");
    const wallTileset = map.addTilesetImage("wall1", "wall-tiles");

    const doorTileset = map.addTilesetImage("door", "door-tiles");
    const armoryTileset = map.addTilesetImage("armory", "armory-tiles");
    const gunsTileset = map.addTilesetImage("armory", "armory-tiles");

    map.createLayer("Background", backgroundTileset, 0, 0);
    map.createLayer("Floor", floorTileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", wallTileset, 0, 0);

    const doorLayer = map.createLayer("Door", doorTileset, 0, 0);

    const armoryLayer = map.createLayer("Armory", armoryTileset, 0, 0);
    const gunsLayer = map.createLayer("Guns", gunsTileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collides: true });
    doorLayer.setCollisionByProperty({ collides: true });
    armoryLayer.setCollisionByProperty({ collides: true });
    gunsLayer.setCollisionByProperty({ collides: true });

    const prevRoom = this.registry.get("prevRoom");
    console.log(prevRoom);
    player = new Player(this, 200, 430);
    this.registry.set("prevRoom", "Cafeteria");

    platform = this.physics.add.staticGroup();
    let door = platform.create(100, 430, "door").setAlpha(100);
    this.physics.add.collider(
      player.sprite,
      door,
      function () {
        this.scene.start("Cafeteria");
      },
      null,
      this
    );

    player.inventory.display();

    this.physics.add.collider(player.sprite, [
      wallsLayer,
      doorLayer,
      armoryLayer,
      gunsLayer,
    ]);
    // player.sprite.setImmovable(true)
    let loadedPlayer = localStorage.getItem("player");
    if (loadedPlayer) {
      let location = JSON.parse(loadedPlayer);
      player.sprite.setPosition(location.x, location.y);
      let loadHealth = localStorage.getItem("healthBar");
      let hBar = JSON.parse(loadHealth);
      player.healthBar.value = hBar;
    }

    player.healthBar.bar.setDepth(1);
    player.sprite.setDepth(1);
    player.laser.setDepth(1);

    const mainMenu = this.add.text(600, 600, "Main Menu", {
      fontFamily: "Comic Sans MS",
      font: "30px Impact",
    });
    mainMenu.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    const saveAndQuit = this.add.text(300, 600, "Save & Quit", {
      fontFamily: "Comic Sans MS",
      font: "30px Impact",
    });
    saveAndQuit.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      localStorage.setItem("scene", this.scene.key);
      localStorage.setItem(
        "player",
        JSON.stringify({ x: player.sprite.x, y: player.sprite.y })
      );
      localStorage.setItem("healthBar", JSON.stringify(player.healthBar.value)); //{x: player.healthBar.x, y: player.healthBar.y}))

      //SAVE PLAYER INVENTORY
      //WILL ITEMS COLLECTED REMAIN COLLECTED??
      // console.log(player)
      this.scene.start("MainMenu");
    });

    const displayTime = 7000;

    placeMenus(this, player);
  }

  update() {
    player.update();
  }
}

module.exports = armoryScene;
