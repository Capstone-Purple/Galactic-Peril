const Phaser = require("phaser");

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


class Enemy {
  constructor(scene, posX, posY) {
    // console.log('In Player constructor.');
    this.scene = scene;

    this.healthBar = new HealthBar(scene, posX - 36, posY - 58);

    const anims = scene.anims;
    anims.create({
      key: "chaseLeft",
      frames: anims.generateFrameNumbers("alien", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "chaseRight",
      frames: anims.generateFrameNumbers("alien", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "chaseUp",
      frames: anims.generateFrameNumbers("alien", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "chaseDown",
      frames: anims.generateFrameNumbers("alien", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite = scene.physics.add.sprite(posX, posY, "alien");
  }

  update(playerInfo) {
    const vector = this.trackPlayer(playerInfo, this.sprite);
    this.pickAnimation(vector);

  //health connected to top of enemy
  this.healthBar.x = this.sprite.x - 36;
  this.healthBar.y = this.sprite.y - 58;

  //damage amount
  const damageAmount = 0.0;
  this.healthBar.decrease(damageAmount);
  }

  trackPlayer(player, enemy) {
    const speed = 0.5;
    let velocityX = 0;
    let velocityY = 0;
    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      player.x,
      player.y
    );
    let distanceX = player.sprite.x - enemy.x;
    let distanceY = player.sprite.y - enemy.y;

    if (
      (Math.abs(distanceX) < 200 && Math.abs(distanceX) > 80) ||
      (Math.abs(distanceY) < 200 && Math.abs(distanceY) > 80)
    ) {
      velocityX = (player.sprite.x - enemy.x) * speed;
      velocityY = (player.sprite.y - enemy.y) * speed;

      enemy.setVelocityX(velocityX); 
      enemy.setVelocityY(velocityY);
    }
    return [velocityX, velocityY];
  }
  
  pickAnimation(vector) {
    const { sprite } = this;
    const [velocityX, velocityY] = vector;
    if (velocityX === 0 & velocityY === 0) {
      // Enemey is not in motion.
      sprite.anims.stop();
    } else if (Math.abs(velocityX) > Math.abs(velocityY)) {
      // Enemy will move horizontally.
      if (velocityX > 0) {
        sprite.anims.play("chaseRight", true);
      } else {
        sprite.anims.play("chaseLeft", true);
      }
    } else {
      // Enemy will move vertically.
      if (velocityY > 0) {
        sprite.anims.play("chaseDown", true);
      } else {
        sprite.anims.play("chaseUp", true);
      }
    }

  }
}

export default Enemy;
