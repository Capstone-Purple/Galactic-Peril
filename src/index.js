const Phaser = require('phaser');
import MainMenu from './MainMenu';
import Scene1 from './Scene1';
import Example2 from './Example2';
import endingScene from "./endingScene";

let config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 1000,
  physics: {
    default: "arcade",
  },
  scene: [ MainMenu, Scene1, Example2, endingScene ]
};

let game = new Phaser.Game(config);