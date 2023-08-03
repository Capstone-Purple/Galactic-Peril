const Phaser = require('phaser');
import Example2 from './Example2';
console.log('We are accessing the JS.');
let player;
let player2;
let cursors;
let platform;


let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
    physics: {
        default: 'arcade'
    },
    scene: [{preload: preload,
            create: create,
            update: update,
    }, Example2]
};

let game = new Phaser.Game(config);

function preload () {
  this.load.image('ship', '/images/Ship3_Bottom.png');
  this.load.image('space', '/images/Background.png')
  this.load.image('captain', '/images/CaptainMale.png')
  this.load.image('alien', '/images/Aliens.png')
  this.load.image('door', '/images/ShipDoor.png');
  this.load.image("background", "/Starship-Map.png");
  this.load.image("character", "/CharDown.png");
}
    
function create() {
    // this.add.image(800,600,'space')
    this.add.image(400,300, 'ship')//this.image = this.add.image(400,300, 'player')

    player = this.physics.add.sprite(400, 300, 'captain');
    player2 = this.physics.add.sprite(600,300, 'alien')
    player.setCollideWorldBounds(true)
    cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setSize(1000,1000);
    this.cameras.main.startFollow(player,false,0.1,0.1)
    platform = this.physics.add.staticGroup();
    let door = platform.create(160,0,'door').setAlpha(0);
    this.physics.add.collider(player, door, function() {
      this.scene.start('Example2')
    },null,this);
  }

function update() {
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
