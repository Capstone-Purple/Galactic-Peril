const Phaser = require('phaser');
const Player = require('./player.js').default;
const Enemy = require('./enemy.js').default;

let player;
let enemy;
let platform;
let item1;

class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: "Scene1" });
    }
    
    preload() {
        this.load.image("floor-tiles", "tilesets/A5_SciFi.png");
  this.load.image("wall-tiles", "tilesets/Ship2_Bottom.png");
  this.load.image("machinary1-tiles", "tilesets/SciFi_Computers_1.png");
  this.load.image("machinary2-tiles", "tilesets/SciFi_Computers_2.png");
  this.load.image("screens-tiles", "tilesets/!$ViewScreen_7.png");
  this.load.image("door-tiles", "/tilesets/!$Objects_1.png");
  this.load.tilemapTiledJSON("starship", "tilesets/Starship-Map.json");
  this.load.image("item1", "/images/alienPistol.png")
  // this.load.image('ship', '/images/Ship3_Bottom.png');
  // this.load.image('space', '/images/Background.png');
  // this.load.image('alien', '/images/Aliens.png');
  // this.load.image('door', '/images/ShipDoor.png');
  // this.load.image('background', '/Starship-Map.png');
  this.load.spritesheet("captain", "/images/YappinToTheCaptain.png", {
    frameWidth: 80,
    frameHeight: 80,
  });
  this.load.spritesheet("alien", "/images/Alien1.png", {
    frameWidth: 80,
    frameHeight: 80,
  });
    }
    
    create() {
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
        this.physics.add.collider(player.sprite, [wallsLayer, machinaryAndScreensLayer]);
        // player.sprite.setImmovable(true)
        let loadedPlayer = localStorage.getItem('player');
        if (loadedPlayer) {
            let location = JSON.parse(loadedPlayer);
            player.sprite.setPosition(location.x, location.y)
        }

        this.physics.add.collider(
            player.sprite,
            doorLayer,
            function () {
              this.scene.start("endingScene");
            },
            null,
            this
          );
    
        enemy = new Enemy(this, 800, 300);
        enemy.sprite.setImmovable(true)
        this.physics.add.collider(enemy.sprite, [wallsLayer, machinaryAndScreensLayer]);
        let loadedEnemy = localStorage.getItem('enemy');
        if (loadedEnemy) {
            let location = JSON.parse(loadedEnemy);
            enemy.sprite.setPosition(location.x, location.y)
        }
    
        this.physics.add.collider(player.sprite, enemy.sprite, function () {
            player.sprite.setTint(0xff0000);
            const damageAmount = 0.5;
            player.healthBar.decrease(damageAmount);
        });

        platform = this.physics.add.staticGroup();
        let door = platform.create(160, 0, "door").setAlpha(0);
        this.physics.add.collider(
            player.sprite,
            door,
            function () {
            this.scene.start("Example2");
            },
            null,
            this
        );

        //alienPistol
        item1 = this.physics.add.sprite(200, 200, "item1");
        this.physics.add.overlap(player.sprite, item1, this.collectItem, null, this);

        const mainMenu = this.add.text(600,600, "Main Menu", { fontFamily: "Comic Sans MS", font: "30px Impact", })
        mainMenu.setInteractive().on('pointerdown', () => { 
            this.scene.start('MainMenu') 
        });
        
        const saveAndQuit = this.add.text(300,600, "Save & Quit", { fontFamily: "Comic Sans MS", font: "30px Impact", })
        saveAndQuit.setInteractive().on('pointerdown', () => { 
            localStorage.setItem('scene', this.scene.key)
            localStorage.setItem('player', JSON.stringify({ x: player.sprite.x, y: player.sprite.y}))
            localStorage.setItem('enemy', JSON.stringify({x: enemy.sprite.x, y: enemy.sprite.y}))
            //SAVE PLAYER INVENTORY
            //WILL ITEMS COLLECTED REMAIN COLLECTED??
            this.scene.start('MainMenu') 
        });
    }

    //removes item1 from this scene
    collectItem(player, item1) {
        item1.destroy();
        player.inventory.addItem(item1.texture.key);
}
    update() {
        player.update();
        enemy.update(player);
   }
}

module.exports = Scene1;