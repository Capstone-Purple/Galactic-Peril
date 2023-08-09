const Phaser = require('phaser');

let myTitle;
let fx;

class MainMenu extends Phaser.Scene {
    constructor() {
        super({key:"MainMenu"});
    }
    
    preload () {
        // this.load.image('bg', 'assets/bg.png')
        this.load.image('bg2', '/images/bg2.png')
    }
    
    create() {
        // this.add.image(400,500,'bg2').setScale(3)
        this.add.image(580,400,'bg2').setScale(0.75)

        // let line = 0;
        // const myMessage = ["Welcome To: ", "Galactic Peril ! !"]
        myTitle = this.add.text(380,100, "Welcome To", { fontFamily: "Comic Sans MS", font: "60px Impact", color: "red", stroke: '#ffff00', strokeThickness: 2})
        fx = myTitle.preFX.addReveal()
        this.tweens.add({
            targets: fx,
            progress: 1,
            hold: 500,
            duration: 3000,
            repeat: 0,
        });

        setTimeout(() => {
            myTitle.destroy()
            myTitle = this.add.text(380,100, "Galactic Peril ! !", { fontFamily: "Comic Sans MS", font: "60px Impact", color: "red", stroke: '#ffff00', strokeThickness: 2})
            fx = myTitle.preFX.addReveal()
            this.tweens.add({
                targets: fx,
                progress: 1,
                hold: 500,
                duration: 3000,
                repeat: 0,
            });
          }, 3500);

        // this.add.text(450,100, "Galactic Peril!", { fontFamily: "Comic Sans MS", font: "60px Impact", color: "red", stroke: '#ffff00', strokeThickness: 2})

        const startBtn = this.add.text(400,300, "New Game", { fontFamily: "Comic Sans MS", font: "30px Impact", })
        startBtn.setInteractive().on('pointerdown', () => { 
            localStorage.clear();
            this.scene.start('Scene1') });

        const continueBtn = this.add.text(400,400, "Continue Game", { fontFamily: "Comic Sans MS", font: "30px Impact"})
        continueBtn.setInteractive().on('pointerdown', () => { 
            let scene = localStorage.getItem('scene')
            if (scene) {
                this.scene.start(scene) 
            } //else { console.log('THE SCENE DID NOT SAVE')}
        });


    }

    update() {}
    
}

module.exports = MainMenu;