const Phaser = require('phaser');

class Player {
    constructor(scene, posX, posY) {
        // console.log('In Player constructor.');
        this.scene = scene;

        const anims = scene.anims;
        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers('captain', {start: 3, end: 5}),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers('captain', {start: 6, end: 8}),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers('captain', {start: 9, end: 11}),
            frameRate: 10,
            repeeat: -1
        });
        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers('captain', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        this.sprite = scene.physics.add.sprite(posX, posY, 'captain');
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        const { cursors, sprite } = this;
        if (cursors.left.isDown) {
            sprite.setVelocityX(-160);
            sprite.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            sprite.setVelocityX(160);
            sprite.anims.play('right', true);
        }
        else if (cursors.up.isDown) {
            sprite.setVelocityY(-160);
            sprite.anims.play('up', true);
        }
        else if (cursors.down.isDown) {
            sprite.setVelocityY(160);
            sprite.anims.play('down', true);
        }
        else {
            sprite.anims.stop();
            sprite.setVelocityX(0);
            sprite.setVelocityY(0);
        }       
    }
}

export default Player;