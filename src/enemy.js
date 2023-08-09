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
    this.trackPlayer(playerInfo, this.sprite);
  }

  trackPlayer(player, enemy) {
    const speed = 0.5;
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
      let velocityX = (player.sprite.x - enemy.x) * speed;
      let velocityY = (player.sprite.y - enemy.y) * speed;

      enemy.setVelocityX(velocityX); // - 100); // adding this in will kind of give you a chance to escape
      enemy.setVelocityY(velocityY);

      if (velocityX > 0) {
        enemy.anims.play("chaseRight", true);
      }
      if (velocityX < 0) {
        enemy.anims.play("chaseLeft", true);
      }
      if (velocityY < 0) {
        enemy.anims.play("chaseUp", true);
      }
      if (velocityY > 0) {
        enemy.anims.play("chaseDown", true);
      }
    } else {
      enemy.anims.stop();
      enemy.setVelocityX(0);
      enemy.setVelocityY(0);
    }
  }
}

export default Enemy;
