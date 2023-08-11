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
    constructor(scene, x, y, rows, cols, slotSize) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.slotSize = slotSize;
        this.slots = [];

        //grid of inventory slots
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const slotX = x + col * slotSize;
                const slotY = y + row * slotSize;

                // const imageTexture = "/images/inventoryIcon.png";

                // const slot = new InventorySlot(scene, slotX, slotY, slotSize, slotSize, imageTexture);
                const slot = new InventorySlot(scene, slotX, slotY, slotSize, slotSize, "empty-inv");
                this.slots.push(slot);
            }
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