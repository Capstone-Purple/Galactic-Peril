const Phaser = require("phaser");
const Player = require("./player.js").default;
const Enemy = require("./enemy.js").default;
const {loadAssets, placeMenus} = require ("./boilerplate.js").default;
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
    player.inventory.display()

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

    this.physics.add.collider(
      player.sprite,
      door1Layer,
      function () {
        if (blackscreen.active === false) {
          this.scene.start("endingScene");
        } else {
          let enterSceneText = this.add.text(player.sprite.x -200, player.sprite.y - 50, "Hmmmm... I wonder what these consoles can do...", {
            fontFamily: "Arial",
            font: "20px",
            color: "black"})
          // let enterSceneText = "Hmmmm... I wonder what these consoles can do...";
          // const displayTime = 7000;
          // player.enterNewScene(this, enterSceneText, displayTime);

          setTimeout(() => {
            enterSceneText.destroy()
          }, 4000);

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
    let blackscreen = platform.create(575,279,"blackscreen")
    blackscreen.setScale(0.80).setDepth(0)
    this.physics.add.overlap(
      player.sprite,
      blackscreen,
      function () {
        this.input.keyboard.on("keyup-SPACE", function() {
          blackscreen.setActive(false).setVisible(false)
        }, this);
      },
      null,
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

    this.physics.add.collider(
      player.sprite,
      enemy.sprite,
      function () {
        // console.log("player location => ", Math.floor(player.sprite.x), Math.floor(player.sprite.y))
        // console.log("enemy location => ", Math.floor(enemy.sprite.x), Math.floor(enemy.sprite.y))

        // player.sprite.setTint(0xff0000);
        const damageAmount = 0.5;
        player.healthBar.decrease(damageAmount);
        if (player.healthBar.value === 0) {
          let gameOver = this.add.text(360, 240, "Game Over", {
            fontFamily: "Comic Sans MS",
            font: "20px Impact",
            color: "black",
          }); //, stroke: '#ffff00', strokeThickness: 2})
          this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 3000,
            //yoyo: true,
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
      }
      },
      null,
      this
    );

    // platform = this.physics.add.staticGroup();
    // let door = platform.create(0, 325, "door").setAlpha(50);
    // this.physics.add.collider(
    //   player.sprite,
    //   door,
    //   function () {
    //     this.scene.start("Cafeteria");
    //   },
    //   null,
    //   this
    // );

    // this.physics.add.collider(
    //   player.sprite,
    //   doorLayer,
    //   function () {
    //     this.scene.start("endingScene");
    //   },
    //   null,
    //   this
    // );

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
      localStorage.setItem(
        "enemy",
        JSON.stringify({ x: enemy.sprite.x, y: enemy.sprite.y })
      );
      localStorage.setItem("healthBar", JSON.stringify(player.healthBar.value)); //{x: player.healthBar.x, y: player.healthBar.y}))

      //SAVE PLAYER INVENTORY
      //WILL ITEMS COLLECTED REMAIN COLLECTED??
      // console.log(player)
      this.scene.start("MainMenu");
    });

    //new scene text and duration
    let enterSceneText = "Hold on, what... who are you? This isn't exactly how I imagined my day going.";
    const displayTime = 7000;

    player.enterNewScene(this, enterSceneText, displayTime);
    
    placeMenus(this, player, enemy);
  }

  update() {
    player.update();
    enemy.update(player);
}
}

module.exports = Scene1;
