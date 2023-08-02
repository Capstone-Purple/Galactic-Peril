const Phaser = require("phaser");

console.log("We are accessing the JS.");

var config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 576,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("background", "/Starship-Map.png");
  this.load.image("character", "/CharDown.png");
}

function create() {
  this.background = this.add.image(490, 250, "background");
  this.character = this.add.image(
    config.width / 2,
    config.height / 2,
    "character"
  );
  this.character.setScale(1.5);
}

function update() {
  moveCharacter(this.character, 1);
}

function moveCharacter(character, speed) {
  character.y += speed;
  if (character.y > config.height) {
    resetCharacterPosition(character);
  }
}

function resetCharacterPosition(character) {
  character.y = 0;
  // var randomX = Phaser.Math.Between(0, config.width);
  // character.x = randomX;
}
