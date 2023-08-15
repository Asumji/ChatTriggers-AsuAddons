import { File } from "../../index.js"
export function execute(args) {
    const f = new File("config/ChatTriggers/modules/AsuAddons/mods/", "custompcmds")
    if (f.exists()) {
        let output = "Available Commands: "
        const fileArray = f.listFiles()
        for (let i = 0; i < fileArray.length; i++) {
            output += "!" + fileArray[i].toString().split("\\")[6].split(".")[0] + ", "
        }
        output = output.slice(0,-2)
        ChatLib.command("pc " + output)
    }
}