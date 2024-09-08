import { data } from "./index.js";

export class Overlay {
    constructor(category, value, command, fileName, placeholderExample) {
        this.category = category
        this.value = value
        this.gui = new Gui();
        this.fileName = fileName
        this.placeholderExample = placeholderExample

        let placeholderRender = register("renderOverlay", () => {
            Renderer.drawString(this.placeholderExample,data[this.category][this.value][0],data[this.category][this.value][1],true)
        })
        placeholderRender.unregister()

        register("command", () => {
            this.gui.open();
        }).setName(command);

        this.gui.registerMouseDragged((x,y) => {
            data[this.category][this.value] = [x,y]
        })

        this.gui.registerOpened(() => {
            placeholderRender.register()
        })

        this.gui.registerClosed(() => {
            require("./mods/"+this.fileName).display.setRenderLoc(data[this.category][this.value][0],data[this.category][this.value][1])
            data.save()
            placeholderRender.unregister()
        })
    }
}