/// <reference types="../CTAutocomplete" />

import PogObject from "PogData";

const data = new PogObject("AsuAddons", {
  names: ["weeklies"],
  owner: "Party > [MVP+] weeklies",
  bot: "RPZ2"
});
data.save();

export { data }

const File = Java.type("java.io.File")
const f = new File("config/ChatTriggers/modules/AsuAddons/", "mods")

if (f.exists()) {
    const fileArray = f.listFiles()
    for (const i in fileArray) {
        const f1 = new File(fileArray[i])
        if (f1.isFile())
            require("./mods/" + f1.getName())
    }
}