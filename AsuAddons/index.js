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
  apiKey: "",
  frag: {
    names: [],
    owner: "Party > [MVP+] OwnerIGN",
    bot: "BotIGN",
    enabled: true,
  },
  dpu: {
    relevantItems: ["scylla", "hyperion", "astraea", "valkyrie", "terminator", "juju", "axe of the shredded", "livid dagger", "spirit bow", "last breath"],
    enabled: true,
  },
  rghost: {
    names: [],
    replace: "and skillissued too much",
    enabled: true
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
  }
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

register("command", () => {
  ChatLib.chat(
  `§2All Commands:

  §6§lCarryHelper
    &a/register <ign> <runs> §eRegisters a new client with the amount of runs they ordered.
    §a/edit <ign> <runs> §eEdits the amount of ordered runs.
    §a/clear [ign] §eRemoves a specific player or all off the carry list.
    §a/add [ign] §eAdds 1 run to a specific player or all players. (Runs will automatically be added upon completion but for safety this exists)
    §a/sub [ign] §eRemoves 1 run from a specific player or all players.

  §6§lFragBot
    §a/frag §eTo toggle the mod on the bots account.
  §2In party chat:
    §a#togglemode §eToggles between the bot leaving or staying in the party when joining a dungeon.
    §a#toggleperms §eToggles between wether only you or everyone can execute commands.
    §a#addplayer <ign> §eAdds a new player to the players that can invite the bot.
    §a#removeplayer <ign> §eRemoves a player from the player that can invite the bot.
    §a#settings §eDisplay an overview of the above mentioned settings.

  §6§lDungeon Party Utils
    §a/dpu key <API key> §eAdds your API key (although it also gets automatically added with /api new)
    §a/dpu add <item> §eAdds an item to check for in a players inventory
    §a/dpu remove <item> §eRemoves and item to check for
    §a/dpu list §eLists all items that are being checked for
    §a/dpu toggle §eToggles the mod

  §6§lReplaceGhost
    §a/rghost add <ign> §eAdds a player to check for.
    §a/rghost remove <ign> §eRemoves a player that is being checked for.
    §a/rghost list §eLists all players which are being checked for.
    §a/rghost set <msg> §eSets the msg to replace "and became a ghost" with.
    §a/rghost toggle §eToggles the mod

  §6§lCustomCommands
    §a/addcommand <new command> <command to run> §eAdds a command.
    §a/removecommand <command> §eRemoves a command.

  §6§lAlias
    §a/addalias <alias> <ign> §eAdds an alias.
    §a/removealias <alias> §e Removes an alias.
    
  §6§lTrophyFish
    §a/trophy Toggles the mod.`
  )
}).setName("au")
