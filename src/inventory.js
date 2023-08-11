class InventorySlot {
    constructor(scene, x, y, width, height, imageTexture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // ui for inventory slots
        this.slotImage = scene.add.sprite(x, y, imageTexture);
        this.slotImage.setOrigin(0, 0);
        this.slotImage.setDisplaySize(50, 50);
    }
}

class Inventory {
    constructor(scene) {
        this.scene = scene;
        this.x = 320;
        this.y = 530;
        this.rows = 1;
        this.cols = 3;
        this.slotSize = 70;
        this.slots = ["empty-inv", "empty-inv", "empty-inv"];

        //grid of inventory slots
        // for (let row = 0; row < this.rows; row++) {
        //     for (let col = 0; col < this.cols; col++) {
        //         const slotX = this.x + col * this.slotSize;
        //         const slotY = this.y + row * this.slotSize;

        //         // const imageTexture = "/images/inventoryIcon.png";

        //         // const slot = new InventorySlot(scene, slotX, slotY, slotSize, slotSize, imageTexture);
        //         const slot = new InventorySlot(scene, slotX, slotY, this.slotSize, this.slotSize, "empty-inv");
        //         this.slots.push(slot);
        //     }
        // }
        this.display();
    }

    // Show inventory contents in scene.
    display() {
        const { scene } = this;
        for (let slot in this.slots) {
            const slotX = this.x + slot * this.slotSize;
            const slotY = this.y;
            let currSlot = scene.add.sprite(slotX, slotY, this.slots[slot]);
            currSlot.setOrigin(0, 0);
            currSlot.setDisplaySize(50, 50);
            // console.log('tried to add', slotX, slotY, this.slots[slot]);
        }
    }

    //updates the inventory slot with a new item
    addItem(itemTextureKey) {
        //find the first empty slot and update its image
        for (const slot of this.slots) {
            if (!slot.slotImage.texture.key) {
                slot.slotImage.setTexture(itemTextureKey);
                break; //exit the loop after setting the image
            }
        }
    }
}

export default Inventory;