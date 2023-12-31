const Phaser = require("phaser");
const Player = require("./player.js").default;
const Enemy = require("./enemy.js").default;
const { loadAssets, placeMenus } = require("./boilerplate.js").default;
const TextBox = require("./player.js").default;

let player;
let enemy;
let platform;

class escapeRoomScene extends Phaser.Scene {
  constructor() {
    super({ key: "escapeRoomScene" });
  }

  preload() {
    loadAssets(this);
    this.load.tilemapTiledJSON("escapeRoom", "tilesets/Escape-Room2.json");
  }

  create() {
    const map = this.make.tilemap({ key: "escapeRoom" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );
    const floorTileset = map.addTilesetImage("floor", "floor-tiles");
    const wallTileset = map.addTilesetImage("wall1", "wall-tiles");
    const wall2Tileset = map.addTilesetImage("wall", "wall2-tiles");
    const doorTileset = map.addTilesetImage("door", "door-tiles");
    const wall3Tileset = map.addTilesetImage("wall3", "wall3-tiles");
    const furnitureTileset = map.addTilesetImage("wall1", "furni-tiles")

    map.createLayer("Background", backgroundTileset, 0, 0);
    map.createLayer("Floor", floorTileset, 0, 0);
    const wallsLayer = map.createLayer(
      "Walls",
      [wallTileset, wall2Tileset, wall3Tileset],
      0,
      0
    );
    const doorLayer = map.createLayer("Door", doorTileset, 0, 0);
    const furnitureLayer = map.createLayer("Furniture", furnitureTileset, 0, 0);


    wallsLayer.setCollisionByProperty({ collides: true });
    doorLayer.setCollisionByProperty({ collides: true });
    furnitureLayer.setCollisionByProperty({ collides: true });

    const prevRoom = this.registry.get("prevRoom");
    console.log(prevRoom);
    if (prevRoom === "Cafeteria") {
      player = new Player(this, 900, 315);
    } else {
      player = new Player(this, 200, 300);
      //new scene text and duration
      let enterSceneText = "Hold on, what... who are you? What's going on? Stop chasing me...";
      const displayTime = 7000;
      player.enterNewScene(this, enterSceneText, displayTime);
    }
    this.registry.set("prevRoom", "Hall");
    player.inventory.display();

    this.physics.add.collider(player.sprite, [wallsLayer]);
    this.physics.add.collider(player.sprite, furnitureLayer);

    platform = this.physics.add.staticGroup();
    let door1 = platform.create(95, 325, "door").setAlpha(0);
    this.physics.add.collider(
      player.sprite,
      door1,
      function () {
        this.registry.set("health", player.healthBar.value);
        this.scene.start("beginningScene");
      },
      null,
      this
    );
    let door2 = platform.create(1025, 325, "door").setAlpha(0);
    this.physics.add.collider(
      player.sprite,
      door2,
      function () {
        this.registry.set("health", player.healthBar.value);
        this.scene.start("Cafeteria");
      },
      null,
      this
    );
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

    player.healthBar.bar.setDepth(1);
    player.sprite.setDepth(1);
    player.laser.setDepth(1);
    platform = this.physics.add.staticGroup();

    enemy = new Enemy(this, 755, 160)
    enemy.sprite.setActive(true)
    enemy.sprite.setImmovable(true);
    this.physics.add.collider(enemy.sprite, [wallsLayer]);

    if (!prevRoom) {
      let loadedEnemy = localStorage.getItem("enemy");
      if (loadedEnemy) {
        let location = JSON.parse(loadedEnemy);
        enemy.sprite.setPosition(location.x, location.y);
      }
    }
    let saveAndQuit = placeMenus(this, player, enemy);

    this.physics.add.collider(
      player.sprite,
      enemy.sprite,
      function () {
        const damageAmount = 0.5;
        player.healthBar.decrease(damageAmount);

        this.registry.set("health", player.healthBar.value);
        if (player.healthBar.value === 0) {
          let gameOver = this.add.text(360, 240, "Game Over", {
            fontFamily: "Comic Sans MS",
            font: "20px Impact",
            color: "black",
          });
          this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 3000,
            onUpdate: (tween) => {
              const v = tween.getValue();
              const c = 255 * v;
              gameOver.setFontSize(40 + v * 64);
              gameOver.setColor(`rgb(${c}, 0,0)`);
            },
          });
          player.sprite.disableBody(true, true);
          saveAndQuit.destroy();
          const restartBtn = this.add.text(300, 600, "Restart", {
            fontFamily: "Comic Sans MS",
            font: "30px Impact",
          });
          restartBtn
            .setInteractive({ cursor: "pointer" })
            .on("pointerdown", () => this.scene.start("escapeRoomScene"));
        }
      },
      null,
      this
    );

    // this enables collisions between lasers and enemies
    this.physics.add.collider(
      enemy.sprite,
      player.laser,

      function () {
        player.laser.setActive(false);
        player.laser.setVisible(false);
        const damageAmount = 25;
        enemy.healthBar.decrease(damageAmount);

        if (enemy.healthBar.value === 0) {
          enemy.sprite.body.setEnable(false);
          enemy.sprite.disableBody(true, true);
          enemy.healthBar.bar.setVisible(false);
        }
      },
      null,
      this
    );
  }

  update() {
    player.update();
    enemy.update(player);
  }
}

module.exports = escapeRoomScene;
