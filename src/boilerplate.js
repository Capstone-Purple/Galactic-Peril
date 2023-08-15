/**
 * boilerplate.js: Stuff we're going to want in every scene.
 */

function placeMenus(scene, player, enemy = null) {
    const mainMenu = scene.add.text(600, 600, "Main Menu", {
        fontFamily: "Comic Sans MS",
        font: "30px Impact",
    });
    mainMenu.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        scene.scene.start("MainMenu");
    });

    const saveAndQuit = scene.add.text(300, 600, "Save & Quit", {
        fontFamily: "Comic Sans MS",
        font: "30px Impact",
    });
    saveAndQuit.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        localStorage.setItem("scene", scene.scene.key);
        localStorage.setItem(
            "player",
            JSON.stringify({ x: player.sprite.x, y: player.sprite.y })
        );
        if (enemy) {
            localStorage.setItem(
                "enemy",
                JSON.stringify({ x: enemy.sprite.x, y: enemy.sprite.y })
            );
        }
        localStorage.setItem("healthBar", JSON.stringify(player.healthBar.value)); //{x: player.healthBar.x, y: player.healthBar.y}))

        //SAVE PLAYER INVENTORY
        //WILL ITEMS COLLECTED REMAIN COLLECTED??
        // console.log(player)
        scene.scene.start("MainMenu");
    });
}

function loadAssets(scene) {
    scene.load.image("background-tiles", "tilesets/Starfield_1.png");
    scene.load.image("floor-tiles", "tilesets/A5_SciFi.png");
    scene.load.image("wall-tiles", "tilesets/Ship2_Bottom.png");
    scene.load.image("machinary1-tiles", "tilesets/SciFi_Computers_1.png");
    scene.load.image("machinary2-tiles", "tilesets/SciFi_Computers_2.png");
    scene.load.image("medical1-tiles", "tilesets/SciFi_Medical.png");
    scene.load.image("medical2-tiles", "tilesets/SciFi_Deco_1.png");
    scene.load.image("screens-tiles", "tilesets/!$ViewScreen_7.png");
    scene.load.image("door-tiles", "/tilesets/!$Objects_1.png");
    scene.load.image("laser", "/weapons/Laser.png");
    scene.load.image("pistol", "/images/alienPistol.png");
    scene.load.image("empty-inv", "/images/inventoryIcon.png");
    scene.load.spritesheet("captain", "/images/YappinToTheCaptain.png", {
      frameWidth: 80,
      frameHeight: 80,
    });
    scene.load.spritesheet("alien", "/images/Alien1.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    scene.load.audio("background-music", ["music/background-music.mp3"]);
    scene.load.audio("laser-sound", ["/music/laser-sound.mp3"]);
}

export default {loadAssets, placeMenus};