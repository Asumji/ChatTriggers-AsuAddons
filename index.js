import PogObject from "PogData";
const File = Java.type("java.io.File")

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
    kuudra: false,
    termwaypoints: false,
    termsummary: false,
    termbeacon: false,
    showEquipment: true,
    showEdrag: false
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
    enabled: false,
    location: [
      0,
      50
    ]
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
    whitelist: [],
    blacklist: [],
    msgEnabled: false,
    customBlacklist: [],
    customEnabled: false,
    commands: []
  },
  carry: {
    location: [
      0,
      250
    ]
  },
  lowball: {
    items: []
  }
});

if (data.dpu.showEdrag == null) {
  data.dpu.showEdrag = false
}

data.save();

const f = new File("config/ChatTriggers/modules/AsuAddons/", "mods")
const modPrefix = "§6AU >§r"

register('Chat', (event) => {
  // let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
  // unformattedMessage = unformattedMessage.replace(/ /g, "").replace("YournewAPIkeyis", "")
  // ChatLib.chat(modPrefix + " §aYour key has been set to §6" + unformattedMessage)
  // data.apiKey = unformattedMessage
  // data.save()
  ChatLib.chat(modPrefix + " Since hypixel is now api banning for dev keys in multiple mods you do not need to create your own anymore!")
}).setChatCriteria("Your new API key is ").setContains()

export { data, modPrefix, File }

if (f.exists()) {
    const fileArray = f.listFiles()
    for (const i in fileArray) {
        const f1 = new File(fileArray[i])
        if (f1.isFile())
          require("./mods/" + f1.getName())
    }
}