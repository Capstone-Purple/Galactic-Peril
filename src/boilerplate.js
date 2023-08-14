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

export default placeMenus;