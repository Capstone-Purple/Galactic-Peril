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
}

function create() {
  this.add.image(525, 300, "background");
}

function update() {}
