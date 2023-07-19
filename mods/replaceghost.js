import { data, modPrefix } from "../index.js"

register("Chat", function(event) {
  if (data.rghost.enabled == true) {
    let msg = ChatLib.getChatMessage(event, true)
    if (data.rghost.names.length != 0) {
      for (let i = 0; i < data.rghost.names.length; i++) {
        if (msg.toLowerCase().includes(data.rghost.names[i])) {
          msgReplaced = msg.replace("and became a ghost", data.rghost.replace)
          cancel(event)
          ChatLib.chat(msgReplaced)
          break;
        }
      }
    } else {
      msgReplaced = msg.replace("and became a ghost", data.rghost.replace)
      cancel(event)
      ChatLib.chat(msgReplaced)
    }
  }
}).setChatCriteria("became a ghost&r&7.&r").setContains();

register("command", (...args) => {
  if (args[0] == "add") {
    if (args[1]) {
      if (!data.rghost.names.includes(args.slice(1).join(" ").toLowerCase())) {
        data.rghost.names.push(args.slice(1).join(" ").toLowerCase())
        data.save()
        ChatLib.chat("§aThe mod now checks for " + args.slice(1).join(" ") + ".")
      } else {
        ChatLib.chat("§cName is already being checked.")
      }
    } else {
      ChatLib.chat("§cDidn't provide a Name.")
    }
  } else if (args[0] == "remove") {
    if (args[1]) {
      if (data.rghost.names.includes(args.slice(1).join(" ").toLowerCase())) {
        data.rghost.names.splice(data.rghost.names.indexOf(args.slice(1).join(" ").toLowerCase()),1)
        data.save()
        ChatLib.chat("§aThe mod no longer checks for " + args.slice(1).join(" ") + ".")
      } else {
        ChatLib.chat("§cName isn't being checked.")
      }
    } else {
      ChatLib.chat("§cDidn't provide a Name.")
    }
  } else if (args[0] == "list") {
    string = "§2Mod currently checks for:\n"
    for (let i = 0; i < data.rghost.names.length; i++) {
      if (i != data.rghost.names.length - 1) {
        string = string + "§a" + data.rghost.names[i] + ", "
      } else {
        string = string + "§a" + data.rghost.names[i]
      }
    }
    ChatLib.chat(string)
  } else if (args[0] == "toggle") {
      data.rghost.enabled ? data.rghost.enabled = false : data.rghost.enabled = true
      data.save()
      data.rghost.enabled ? ChatLib.chat(modPrefix + " Enabled Replace Ghost.") : ChatLib.chat(modPrefix + " Disabled Replace Ghost.")
  } else if (args[0] == "set") {
    if (args[1]) {
        data.rghost.replace = args.slice(1).join(" ")
        data.save()
        ChatLib.chat(modPrefix + " §aThe mod will now replace \"and became a ghost\" with \"" + args.slice(1).join(" ") + "\".\n§6Example:\n&r&r&c ☠ &r&7You were killed by Crypt Dreadlord&r&7 and became a ghost&r&7.&r&r\n    §6-> &r&r&c ☠ &r&7You were killed by Crypt Dreadlord&r&7 " + args.slice(1).join(" ") + "&r&7.&r&r")
    } else {
        ChatLib.chat(modPrefix + " §cDidn't provide a sentence to replace \"and became a ghost\" with.")
    }
  } else {
    ChatLib.chat("§cUsage: /rghost add/remove/list/set/toggle")
  }
}).setName("rghost")