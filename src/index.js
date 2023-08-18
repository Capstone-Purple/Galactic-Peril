const Phaser = require("phaser");
// const Player = require('./player.js').default;
// const Enemy = require('./enemy.js').default;

const sceneArr = [
  MainMenu,
  beginningScene,
  escapeRoomScene,
  Cafeteria,
  armoryScene,
  Scene1,
  endingScene,
  endingSpaceShip,
  Arena,
];

const path = window.location.pathname;
if (path.length > 1) {
  const targetIndex = Number(path.substring(1));
  sceneArr.unshift(sceneArr.splice(targetIndex, 1)[0]);
}

let player;
let enemy;
let platform;
import MainMenu from "./MainMenu";
import beginningScene from "./beginningScene";
import Scene1 from "./Scene1";
import endingScene from "./endingScene";
import Arena from "./scenes/Arena.js";
import Cafeteria from "./Cafeteria";
import endingSpaceShip from "./endingSpaceShipScene";
import armoryScene from "./armoryScene";
import escapeRoomScene from "./escapeRoomScene";

let config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 1000,
  physics: {
    default: "arcade",
  },
  scene: sceneArr,
};

let game = new Phaser.Game(config);
