/**
 * Arena.js: A scene to test combat functionality.
 */
const Player = require('../player.js').default;
const Enemy = require('../enemy.js').default;

let player;
let enemy;
let item1;

class Arena extends Phaser.Scene {
    constructor() {
        super({ key: 'Arena' });
    }

    preload() {
        this.load.image("floor-tiles", "tilesets/A5_SciFi.png");
        this.load.image("wall-tiles", "tilesets/Ship2_Bottom.png");
        this.load.tilemapTiledJSON("starship", "tilesets/Starship-Map.json");
        this.load.image("item1", "/images/alienPistol.png");
        this.load.spritesheet("captain", "/images/YappinToTheCaptain.png", {
            frameWidth: 80,
            frameHeight: 80,
        });
        this.load.spritesheet("alien", "/images/Alien1.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
    }

    create() {
        const map = this.make.tilemap({ key: "starship" });
        const floorTileset = map.addTilesetImage("floor", "floor-tiles");
        const wallTileset = map.addTilesetImage("wall1", "wall-tiles");

        map.createLayer("Ground", floorTileset, 0, 0);
        const wallsLayer = map.createLayer("Walls", wallTileset, 0, 0);

        wallsLayer.setCollisionByProperty({ collides: true });
    
        player = new Player(this, 400, 300);
        this.physics.add.collider(player.sprite, wallsLayer);
        player.sprite.setImmovable(true)
    
        // enemy = new Enemy(this, 800, 300);
        // enemy.sprite.setImmovable(true)
        // this.physics.add.collider(enemy.sprite, wallsLayer);

        // this.physics.add.collider(player.sprite, enemy.sprite, function () {
        //     player.sprite.setTint(0xff0000);
        //     const damageAmount = 0.5;
        //     player.healthBar.decrease(damageAmount);
        // });

        item1 = this.physics.add.sprite(200, 200, "item1");
        this.physics.add.overlap(player.sprite, item1, function() {
            player.acquireItem(item1.texture.key);
        });
    }

    update() {
        player.update();
        // enemy.update(player);
    }
}

module.exports = Arena;