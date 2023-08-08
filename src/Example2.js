let player;
let player2;
let cameras;
let panel1, panel2;
let platform;
// let interaction1;
const Phaser = require('phaser');
const Player = require('./player.js').default;

class Example2 extends Phaser.Scene {
    constructor() {
        super({ key: "Example2" });
    }

    preload() {
        this.load.image('ship2', '/images/Starship-Map.png');
        this.load.image('space', '/images/Background.png')
        this.load.image('alien', '/images/Aliens.png')
        this.load.image('closedpanel', '/images/ClosedPanel.png')
        this.load.image('openpanel', '/images/OpenPanel.png')
        this.load.image('door', '/images/ShipDoor.png')
        this.load.spritesheet('captain', '/images/YappinToTheCaptain.png', { frameWidth: 80, frameHeight: 80 });
    }

    create() {
        // this.add.image(800,600,'space')
        this.add.image(400, 500, 'ship2')//this.image = this.add.image(400,300, 'player')

        player = new Player(this, 300, 500);
        player2 = this.physics.add.sprite(600, 500, 'alien')
        player.sprite.setCollideWorldBounds(true)
        this.cameras.main.setSize(1000, 1000);
        this.cameras.main.startFollow(player.sprite, false, 0.1, 0.1)
        platform = this.physics.add.staticGroup();
        panel1 = platform.create(220, 30, 'closedpanel');
        let panel3 = platform.create(300, 30, 'closedpanel');
        // let door = platform.create(150,20,'door');

        // let thatThis = this;
        this.physics.add.collider(player.sprite, panel1, function () {
            this.input.keyboard.on('keyup-SPACE', (event) => {
                console.log('event => ', event)
                panel1.disableBody(true, true);
                panel2 = platform.create(250, 30, 'openpanel');
            }, this)
        }, null, this);

        this.physics.add.collider(player.sprite, panel3, function () {
            this.input.keyboard.on('keyup-SPACE', (event) => {
                console.log('event => ', event)
                panel1.disableBody(true, true);
                panel2 = platform.create(250, 30, 'openpanel');
            }, this)
        }, null, this);

    }

    update() {
        player.update();
    }

}

module.exports = Example2;