import { data } from "./index.js";

export class Overlay {
    constructor(category, command, fileName) {
        this.category = category
        this.gui = new Gui();
        this.fileName = fileName

        register("command", () => {
            this.gui.open();
        }).setName(command);

        register("dragged", (dx, dy, x, y) => {
            if (this.gui.isOpen()) {
                data[this.category].location = [x,y]
                data.save()
                require("./mods/"+this.fileName).display.setRenderLoc(x,y)
            }
        });
    }
}