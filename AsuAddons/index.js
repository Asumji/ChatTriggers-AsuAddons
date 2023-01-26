/// <reference types="../CTAutocomplete" />

import PogObject from "PogData";

const data = new PogObject("AsuAddons", {
  FRAGnames: ["weeklies"],
  FRAGowner: "Party > [MVP+] weeklies",
  FRAGbot: "RPZ2",
  FRAGenabled: true,
  apiKey: "",
  DPUrelevantItems: ["scylla", "hyperion", "astraea", "valkyrie", "terminator", "juju", "axe of the shredded", "livid dagger", "spirit bow", "last breath"],
  DPUenabled: true
});
data.save();

const File = Java.type("java.io.File")
const f = new File("config/ChatTriggers/modules/AsuAddons/", "mods")
const modPrefix = "&6AU > &r"

export { data, modPrefix }

if (f.exists()) {
    const fileArray = f.listFiles()
    for (const i in fileArray) {
        const f1 = new File(fileArray[i])
        if (f1.isFile())
            require("./mods/" + f1.getName())
    }
}
