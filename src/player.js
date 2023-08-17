const Phaser = require("phaser");
const Inventory = require("./inventory.js").default;

class TextBox {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.textBox = scene.add.text(x, y, "", {
      fontFamily: "Arial",
      fontSize: 20,
      color: "#ffffff",
    });
    this.textBox.setOrigin(0.5, 1);
    this.textBox.setDepth(1);
    this.textBox.setVisible(false);
  }

  showText(text) {
    this.textBox.setText(text);
    this.textBox.setVisible(true);
  }

  hideText() {
    this.textBox.setVisible(false);
  }
}

class HealthBar {
  constructor(scene, x, y) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 76 / 100;

    //render health bar
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

    //black background
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, 80, 16);

    //health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

    //setting color to red when it gets below 30 health otherwise its green
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

    this.inventory = new Inventory(scene, 320, 530, 1, 3, 70);

    this.textBox = new TextBox(scene, posX - 50, posY + 530);
    this.textTimer = null;

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
      repeat: -1,
    });
    anims.create({
      key: "down",
      frames: anims.generateFrameNumbers("captain", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite = scene.physics.add.sprite(posX, posY, "captain");
    this.cursors = scene.input.keyboard.createCursorKeys();

    // creating laser sprite
    this.laser = scene.physics.add.sprite(0, 0, "laser");
    this.laser.setVisible(false);
    this.laser.setActive(false);
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

    // check for space bar input to shoot
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.shootLaser();
      if (this.inventory.checkForItem("pistol")) {
        this.shootLaser();
      } else {
        let weaponText =
          "                                               There should be an armory somewhere on this ship... Hopefully...";
        this.textBox.showText(weaponText);
      }
    }

    //health connected to top of player
    this.healthBar.x = sprite.x - 41;
    this.healthBar.y = sprite.y - 58;

    //damage amount
    const damageAmount = 0.0;
    this.healthBar.decrease(damageAmount);
  }

  acquireItem(itemKey) {
    console.log("In acquireItem function");
    this.inventory.addItem(itemKey);
  }

  enterNewScene(scene, text, displayTime) {
    this.textBox.showText(text);

    if (this.textTimer) {
      clearTimeout(this.textTimer);
    }

    this.textTimer = setTimeout(() => {
      this.textBox.hideText();
      this.textTimer = null;
    }, displayTime);
  }

  shootLaser() {
    // speed
    const laserSpeed = 300;

    // slightly in front
    this.laser.setPosition(this.sprite.x, this.sprite.y - 20);
    this.laser.setScale(0.15);
    this.laser.setTint(0x800000);
    this.scene.sound.play("laser-sound", {
      volume: 0.15,
      loop: false,
    });

    let velocityX = 0;
    let velocityY = 0;

    if (this.sprite.anims.currentAnim) {
      if (this.sprite.anims.currentAnim.key === "left") {
        velocityX = -laserSpeed;
      } else if (this.sprite.anims.currentAnim.key === "right") {
        velocityX = laserSpeed;
      } else if (this.sprite.anims.currentAnim.key === "up") {
        velocityY = -laserSpeed;
      } else if (this.sprite.anims.currentAnim.key === "down") {
        velocityY = laserSpeed;
      }
    }

    // set the lasers velocity based on determined direction
    this.laser.setVelocity(velocityX, velocityY);
    this.laser.setVisible(true);
    this.laser.setActive(true);
  }
}

export default Player;
