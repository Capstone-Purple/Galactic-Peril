/**
 * inventory.js: Track objects held by player.
 */

class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.x = 320;
        this.y = 530;
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

    // Show inventory contents in scene.
    // display() {
    //     const { scene } = this;
    //     for (let slot in this.slots) {
    //         const slotX = this.x + slot * this.slotSize;
    //         const slotY = this.y;
    //         let currSlot = scene.add.sprite(slotX, slotY, this.slots[slot]);
    //         currSlot.setOrigin(0, 0);
    //         currSlot.setDisplaySize(50, 50);
    //         // console.log('tried to add', slotX, slotY, this.slots[slot]);
    //     }
    // }
    display() {
        const { scene } = this;
        for (let slotIndex = 0; slotIndex < this.slots.length; slotIndex++) {
            const slotX = this.x + slotIndex * this.slotSize;
            const slotY = this.y;
            
            if (this.slots[slotIndex] !== "empty-inv") {
                let currSlot = scene.add.sprite(slotX, slotY, this.slots[slotIndex]);
                currSlot.setOrigin(0, 0);
                currSlot.setDisplaySize(50, 50);
            }
        }
    }
    //updates the inventory slot with a new item
    addItem(key) {
        console.log(key);
        const firstEmpty = this.slots.findIndex((slot) => slot === "empty-inv");
        this.slots[firstEmpty] = key;
        this.scene.registry.set("inventory", this.slots);
        this.display();
    }

    // Check to see if the player is holding a specific item
    checkForItem(key) {
        return this.slots.includes(key);
    }
}

export default Inventory;