const Phaser = require("phaser");

class Enemy {
  constructor(scene, posX, posY) {
    // console.log('In Player constructor.');
    this.scene = scene;

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
