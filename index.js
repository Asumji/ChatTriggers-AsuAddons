import PogObject from "PogData";
import { isInArrayIdx } from "./utils";
import request from "requestV2"
const File = Java.type("java.io.File")
const UUID = Java.type("java.util.UUID")
const Minecraft = Java.type("net.minecraft.client.Minecraft")

const data = new PogObject("AsuAddons", {
  ursa: {
    ursaToken: "",
    ursaTokenExpires: 0
  },
  frag: {
    names: [],
    owner: "",
    bot: "",
    enabled: false,
  },
  dpu: {
    relevantItems: ["scylla", "hyperion", "astraea", "valkyrie", "terminator", "juju", "axe of the shredded", "livid dagger", "spirit bow", "last breath"],
    enabled: false,
    kuudra: false
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
    whitelist: [],
    blacklist: [],
    msgEnabled: false,
    customBlacklist: [],
    customEnabled: false,
    commands: []
  }
});

if (data.partycmd.customBlacklist == undefined) {
  data.partycmd.customBlacklist = []
}
if (data.partycmd.customEnabled == undefined) {
  data.partycmd.customEnabled = false
}
if (data.partycmd.commands == undefined) {
  const f = new File("config/ChatTriggers/modules/AsuAddons/mods", "custompcmds")
  const fileArray = f.listFiles()
  data.partycmd.commands = []
  for (let i = 0; i < fileArray.length; i++) {
    data.partycmd.commands.push([fileArray[i].toString().split("\\")[6].split(".")[0],true])
  }
} else {
  const f = new File("config/ChatTriggers/modules/AsuAddons/mods", "custompcmds")
  const fileArray = f.listFiles()
  for (let i = 0; i < fileArray.length; i++) {
    if (!isInArrayIdx(fileArray[i].toString().split("\\")[6].split(".")[0],data.partycmd.commands,0))
      data.partycmd.commands.push([fileArray[i].toString().split("\\")[6].split(".")[0],true])
  }
}
if (data.ursa.ursaTokenExpires == undefined) {
  data.ursa.ursaToken = ""
  data.ursa.ursaTokenExpires = 0
}

data.save();

const f = new File("config/ChatTriggers/modules/AsuAddons/", "mods")
const modPrefix = "&6AU >&r"

register('Chat', (event) => {
  // let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
  // unformattedMessage = unformattedMessage.replace(/ /g, "").replace("YournewAPIkeyis", "")
  // ChatLib.chat(modPrefix + " §aYour key has been set to §6" + unformattedMessage)
  // data.apiKey = unformattedMessage
  // data.save()
  ChatLib.chat(modPrefix + " Since hypixel is now api banning for dev keys in multiple mods you do not need to create your own anymore!")
}).setChatCriteria("Your new API key is ").setContains()

//https://github.com/NotEnoughUpdates/ursa-minor/
function authorizedRequest(url,_callback) {
  if (Date.now() >= data.ursa.ursaTokenExpires || data.ursa.ursaToken == "") {
      console.log("AU > Invalid Ursa Token! Starting joinServer Authentication")

      // let output = new Message(`Generating new Ursa Token\n§aTime: §c${new Date(Date.now())}\n§aExpires: §c${new Date(data.ursa.ursaTokenExpires)}\n`)
      // output.addTextComponent(new TextComponent("§cOld Token").setHover("show_text", data.ursa.ursaToken))
      // ChatLib.chat(output)

      let serverId = UUID.randomUUID().toString()
      let session = Minecraft.func_71410_x().func_110432_I()
      let name = session.func_111285_a()
      Minecraft.func_71410_x().func_152347_ac().joinServer(session.func_148256_e(), session.func_148254_d(), serverId)
      request({
          url: url,
          headers: {
              'User-Agent': 'Mozilla/5.0 (ChatTriggers)',
              "x-ursa-username": name,
              "x-ursa-serverid": serverId
          },
          json: true,
          resolveWithFullResponse: true
      }).then(response => {
          data.ursa.ursaToken = response.headers["X-Ursa-Token"]
          data.ursa.ursaTokenExpires = Number(response.headers["X-Ursa-Expires"])
          data.save()

          // output = new Message(`Generated new Ursa Token\n§aTime: §c${new Date(Date.now())}\n§aExpires: §c${new Date(data.ursa.ursaTokenExpires)}\n`)
          // output.addTextComponent(new TextComponent("§cNew Token").setHover("show_text", data.ursa.ursaToken))
          // ChatLib.chat(output)

          _callback(response.body)
          console.log("AU > Finished Authentication")
          return true
      });
  } else {
      request({
          url: url,
          headers: {
              'User-Agent': 'Mozilla/5.0 (ChatTriggers)',
              "x-ursa-token": data.ursa.ursaToken
          },
          json: true,
      }).then(response => {
          _callback(response)
          return true
      });
  }
}

export { data, modPrefix, File, authorizedRequest }

if (f.exists()) {
    const fileArray = f.listFiles()
    for (const i in fileArray) {
        const f1 = new File(fileArray[i])
        if (f1.isFile())
          require("./mods/" + f1.getName())
    }
}