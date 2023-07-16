/// <reference types="../CTAutocomplete" />

import PogObject from "PogData";

if (FileLib.exists("config/ChatTriggers/modules/AsuAddons/.data.json")) {
  const oldData = JSON.parse(FileLib.read("config/ChatTriggers/modules/AsuAddons/.data.json"))
  if (oldData["FRAGnames"]) {
    console.log("AU > Bad Data File Found!")
    FileLib.append("config/ChatTriggers/modules/AsuAddons/.newdata.json", JSON.stringify({apiKey: oldData["apiKey"],frag: {names: oldData["FRAGnames"],owner: oldData["FRAGowner"],bot: oldData["FRAGbot"],enabled: oldData["FRAGenabled"],},dpu: {relevantItems: oldData["DPUrelevantItems"],enabled: oldData["DPUenabled"],},rghost: {names: oldData["RGHOSTnames"],replace: oldData["RGHOSTreplace"],enabled: oldData["RGHOSTenabled"]},cc: {commands: oldData["CCcommands"]},alias: {names: oldData["ALIASnames"]}},null,4))
    FileLib.write("config/ChatTriggers/modules/AsuAddons/.data.json",JSON.stringify(JSON.parse(FileLib.read("config/ChatTriggers/modules/AsuAddons/.newdata.json")),null,4))
    setTimeout(() => {
      FileLib.delete("config/ChatTriggers/modules/AsuAddons/.newdata.json")
    }, 1000);
    console.log("AU > Data File Fixed!")
  }
}


const data = new PogObject("AsuAddons", {
  frag: {
    names: [],
    owner: "",
    bot: "",
    enabled: false,
  },
  dpu: {
    relevantItems: ["scylla", "hyperion", "astraea", "valkyrie", "terminator", "juju", "axe of the shredded", "livid dagger", "spirit bow", "last breath"],
    enabled: false,
  },
  rghost: {
    names: [],
    replace: "and skillissued too much",
    enabled: false
  },
  cc: {
    commands: []
  },
  alias: {
    names: []
  },
  trophy: {
    collected: {
      blobfish: [0,0,0,0],
      vanille: [0,0,0,0],
      sulphur_skitter: [0,0,0,0],
      obfuscated_fish_1: [0,0,0,0],
      gusher: [0,0,0,0],
      steaming_hot_flounder: [0,0,0,0],
      lava_horse: [0,0,0,0],
      golden_fish: [0,0,0,0],
      mana_ray: [0,0,0,0],
      flyfish: [0,0,0,0],
      volcanic_stonefish: [0,0,0,0],
      obfuscated_fish_2: [0,0,0,0],
      slugfish: [0,0,0,0],
      moldfin: [0,0,0,0],
      skeleton_fish: [0,0,0,0],
      karate_fish: [0,0,0,0],
      soul_fish: [0,0,0,0],
      obfuscated_fish_3: [0,0,0,0]
    },
    firstUse: true,
    enabled: false
  },
  bridge: {
    botIGN: "bridgebot",
    bridgeMessage: "§2Bridge: §6<1>: §r<2>"
  },
  rp: {
    autojoin: false,
    cooldown: 15000
  },
  partycmd: {
    whitelist: []
  }
});
data.save();

const File = Java.type("java.io.File")
const f = new File("config/ChatTriggers/modules/AsuAddons/", "mods")
const modPrefix = "&6AU >&r"
const apiKey = "e3e84d2e-d571-4027-9d12-6a4f39e38ae8"

export { data, modPrefix, apiKey }

if (f.exists()) {
    const fileArray = f.listFiles()
    for (const i in fileArray) {
        const f1 = new File(fileArray[i])
        if (f1.isFile())
            require("./mods/" + f1.getName())
    }
}