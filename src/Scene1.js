const Phaser = require("phaser");
const Player = require("./player.js").default;
const Enemy = require("./enemy.js").default;
const { loadAssets, placeMenus } = require("./boilerplate.js").default;
const TextBox = require("./player.js").default;

let player;
let enemy;
let platform;
let item1;

class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene1" });
  }

  preload() {
    loadAssets(this);
    this.load.tilemapTiledJSON("starship", "tilesets/Starship-Map.json");
  }

  create() {
    const map = this.make.tilemap({ key: "starship" });
    const backgroundTileset = map.addTilesetImage(
      "background",
      "background-tiles"
    );
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
    const door1Tileset = map.addTilesetImage("door", "door1-tiles");
    const door2Tileset = map.addTilesetImage("door", "door2-tiles");

    map.createLayer("Background", backgroundTileset, 0, 0);
    map.createLayer("Ground", floorTileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", wallTileset, 0, 0);

    const machinaryAndScreensLayer = map.createLayer(
      "Machinary-and-Screens",
      [machinary1Tileset, machinary2Tileset, screensTileset],
      0,
      0
    );

    const door1Layer = map.createLayer("Door1", door1Tileset, 0, 0);
    const door2Layer = map.createLayer("Door2", door2Tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collides: true });
    machinaryAndScreensLayer.setCollisionByProperty({ collides: true });
    door1Layer.setCollisionByProperty({ collides: true });
    door2Layer.setCollisionByProperty({ collides: false });

    const prevRoom = this.registry.get("prevRoom");
    console.log(prevRoom);
    player = new Player(this, 400, 300);
    this.registry.set("prevRoom", "Scene1");
    player.inventory.display();

    this.physics.add.collider(player.sprite, [
      wallsLayer,
      machinaryAndScreensLayer,
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

    let textcount = 0;
    this.physics.add.collider(
      player.sprite,
      door1Layer,
      function () {
        if (blackscreen.active === false) {
          this.scene.start("endingScene");
        } else {
          if (textcount === 0) {
            textcount++;
            let lockedDoorText =
              "Locked! Hmmmm... I wonder what these consoles can do...";
            player.enterNewScene(this, lockedDoorText, displayTime);
            setTimeout(() => {
              textcount--;
            }, 4000);
          }
        }
      },
      null,
      this
    );

    this.physics.add.collider(
      player.sprite,
      door2Layer,
      function () {
        this.scene.start("Cafeteria");
      },
      null,
      this
    );
    player.healthBar.bar.setDepth(1);
    player.sprite.setDepth(1);
    player.laser.setDepth(1);
    platform = this.physics.add.staticGroup();
    let blackscreen = platform.create(575, 279, "blackscreen");
    blackscreen.setScale(0.8).setDepth(0);
    let collision;
    this.physics.add.overlap(
      player.sprite,
      blackscreen,
      function () {
        collision = blackscreen;
        setTimeout(() => {
          collision = null;
        }, 100);
      },
      null,
      this
    );
    this.input.keyboard.on(
      "keyup-SHIFT",
      function () {
        if (collision) {
          if (collision === blackscreen) {
            blackscreen.setActive(false).setVisible(false);
          }
        }
      },
      this
    );

    enemy = new Enemy(this, 800, 300);
    enemy.sprite.setImmovable(true);
    this.physics.add.collider(enemy.sprite, [
      wallsLayer,
      machinaryAndScreensLayer,
    ]);
    let loadedEnemy = localStorage.getItem("enemy");
    if (loadedEnemy) {
      let location = JSON.parse(loadedEnemy);
      enemy.sprite.setPosition(location.x, location.y);
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
              gameOver.setColor(`rgb(${c}, 0,0)`); //${c}, ${c})`);
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
            .on("pointerdown", () => this.scene.start("Scene1"));
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
          this.registry.set("aliendDefeated", true);
        }
      },
      null,
      this
    );

    const alienDefeated = this.registry.get("aliendDefeated");
    if (alienDefeated) {
      enemy.sprite.body.setEnable(false);
      enemy.sprite.disableBody(true, true);
      enemy.healthBar.bar.setVisible(false);
    }

    //new scene text and duration
    let enterSceneText =
      "Hold on, what... who are you? This isn't exactly how I imagined my day going.";
    const displayTime = 7000;

    player.enterNewScene(this, enterSceneText, displayTime);
  }

  update() {
    player.update();
    enemy.update(player);
  }
}

module.exports = Scene1;
