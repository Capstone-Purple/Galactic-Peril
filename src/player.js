const Phaser = require("phaser");

class HealthBar {
  constructor(scene, x, y) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 76 / 100;

    this.draw();

    scene.add.existing(this.bar);
  }

  decrease(amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return this.value === 0;
  }

  draw() {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, 80, 16);

    //  Health

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

    if (this.value < 30) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);

    this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}

class Player {
  constructor(scene, posX, posY) {
    // console.log('In Player constructor.');
    this.scene = scene;

    this.healthBar = new HealthBar(scene, posX - 41, posY - 58);

    const anims = scene.anims;
    anims.create({
      key: "left",
      frames: anims.generateFrameNumbers("captain", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "right",
      frames: anims.generateFrameNumbers("captain", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "up",
      frames: anims.generateFrameNumbers("captain", { start: 9, end: 11 }),
      frameRate: 10,
      repeeat: -1,
    });
    anims.create({
      key: "down",
      frames: anims.generateFrameNumbers("captain", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite = scene.physics.add.sprite(posX, posY, "captain");
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    const { cursors, sprite } = this;
    if (cursors.left.isDown) {
      sprite.setVelocityX(-160);
      sprite.anims.play("left", true);
    } else if (cursors.right.isDown) {
      sprite.setVelocityX(160);
      sprite.anims.play("right", true);
    } else if (cursors.up.isDown) {
      sprite.setVelocityY(-160);
      sprite.anims.play("up", true);
    } else if (cursors.down.isDown) {
      sprite.setVelocityY(160);
      sprite.anims.play("down", true);
    } else {
      sprite.anims.stop();
      sprite.setVelocityX(0);
      sprite.setVelocityY(0);
    }
  }
}

export default Player;