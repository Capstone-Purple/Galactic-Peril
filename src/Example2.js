let player;
let player2;
let cursors;
let cameras;
let panel1, panel2;
let platform;
// let interaction1;
const Phaser = require('phaser');

class Example2 extends Phaser.Scene {
    constructor() {
        super({key:"Example2"});
    }
    
    preload () {
    this.load.image('ship2', '/images/Starship-Map.png');
    this.load.image('space', '/images/Background.png')
    this.load.image('captain', '/images/CaptainMale.png')
    this.load.image('alien', '/images/Aliens.png')
    this.load.image('closedpanel', '/images/ClosedPanel.png')
    this.load.image('openpanel', '/images/OpenPanel.png')
    this.load.image('door', '/images/ShipDoor.png')

    }
    
    create() {
        // this.add.image(800,600,'space')
        this.add.image(400,500, 'ship2')//this.image = this.add.image(400,300, 'player')

        player = this.physics.add.sprite(300, 500, 'captain');
        player2 = this.physics.add.sprite(600,500, 'alien')
        player.setCollideWorldBounds(true)
        cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setSize(1000,1000);
        this.cameras.main.startFollow(player,false,0.1,0.1)
        platform = this.physics.add.staticGroup();
        panel1 = platform.create(220, 30, 'closedpanel');
        let panel3 = platform.create(300, 30, 'closedpanel');
        // let door = platform.create(150,20,'door');

        // let thatThis = this;
        this.physics.add.collider(player,panel1, function() {
            this.input.keyboard.on('keyup-SPACE', (event) => {
                console.log('event => ', event)
                panel1.disableBody(true,true);
                panel2 = platform.create(250, 30, 'openpanel');
            },this)
        },null,this);

        this.physics.add.collider(player,panel3, function() {
            this.input.keyboard.on('keyup-SPACE', (event) => {
                console.log('event => ', event)
                panel1.disableBody(true,true);
                panel2 = platform.create(250, 30, 'openpanel');
            },this)
        },null,this);
               
    }

    update() {
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
        }
        else
        {
            player.setVelocityX(0);
        }

        if (cursors.up.isDown /*&& player.body.touching.down*/)
        {
            player.setVelocityY(-160);
        }
        else if(cursors.down.isDown)
        {
            player.setVelocityY(160);
        }
    }
    
}



module.exports = Example2;