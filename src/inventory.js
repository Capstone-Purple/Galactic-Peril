/**
 * inventory.js: Track objects held by player.
 */

class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.x = 370;
        this.y = 600;
        this.rows = 1;
        this.cols = 3;
        this.slotSize = 70;
        // If the player picked up items in a previous room, add them to inventory.
        const currInventory = this.scene.registry.get("inventory");
        if (currInventory) {
            this.slots = currInventory;
        } else {
            this.slots = ["empty-inv", "empty-inv", "empty-inv"];
        }

        this.display();
    }

    display() {
        const { scene } = this;
        for (let slotIndex = 0; slotIndex < this.slots.length; slotIndex++) {
            const slotX = this.x + slotIndex * this.slotSize;
            const slotY = this.y;
            
            // if (this.slots[slotIndex] !== "empty-inv") {
                let currSlot = scene.add.sprite(slotX, slotY, this.slots[slotIndex]);
                currSlot.setOrigin(0, 0);
                currSlot.setDisplaySize(50, 50);
            // }
        }
    }
    
    //updates the inventory slot with a new item
    addItem(key) {
        const firstEmpty = this.slots.findIndex((slot) => slot === "empty-inv");
        this.slots[firstEmpty] = key;
        this.scene.registry.set("inventory", this.slots);
        this.display();
    }

    // Check to see if the player is holding a specific item
    checkForItem(key) {
      if (this.slots.includes(key) ){
        return key;
      }

        // return this.slots.includes(key);
    }

    useItem(num){
        let textureKey = this.slots[num]
        return textureKey;
    }

    removeItem(num) {
        this.slots[num] = "empty-inv";
        this.display()
    }
}

export default Inventory;