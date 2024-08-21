import PogObject from "PogData";

const metadata = JSON.parse(FileLib.read("AsuAddons", "metadata.json"))
const File = Java.type("java.io.File")

const data = new PogObject("AsuAddons", {
  firstLoad: true,
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
    i4: false,
    i4Msg: "",
    i4failMsg: "",
    compMsg: "",
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
    bridgeMessage: "&2Bridge > &6<1>: &r<2>",
    officerMessage: "&3Bridge > &6<1>: &r<2>"
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
  },
  petrules: {
    notif:false
  },
  spring: {
    enabled: false,
    checkpoints: [],
    location: [
      0,
      420
    ]
  },
  vamp: {
    enabled: false,
    debug: false
  }
});

if (data.vamp.debug == null) data.vamp.debug = false

if (data.firstLoad) {
  data.firstLoad = false

  ChatLib.chat("§a"+ChatLib.getChatBreak("="))
  ChatLib.chat(ChatLib.getCenteredText("§9§lAsuAddons "+metadata.version))
  ChatLib.chat(ChatLib.getCenteredText("§bThis seems to be your first time loading the module"))
  ChatLib.chat(ChatLib.getCenteredText("§bUse §6\"/au\"§b to open the config menu"))
  ChatLib.chat(ChatLib.getCenteredText("§bUse §6\"/au help\"§b for more help on commands"))
  ChatLib.chat(ChatLib.getCenteredText("§cIf any issues arise contact asumji on discord"))
  ChatLib.chat("§a"+ChatLib.getChatBreak("="))
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