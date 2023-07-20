import {
    data,
    modPrefix
} from "../index.js";
import { isInArray } from "../utils.js";

register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    if (unformattedMessage.startsWith("Party >") && unformattedMessage.includes("!p ")) {
        if (isInArray(unformattedMessage.split("!")[0].replace(/\[[^\]]+\]/,"").replace("Party > ","").replace(/ /g,"").replace(/:/g,"").toLowerCase(),data.partycmd.whitelist) && !isInArray("p " + unformattedMessage.split("!")[1].split(" ")[1],data.partycmd.blacklist) && unformattedMessage.split("!")[1].startsWith("p ")) {
            ChatLib.command(unformattedMessage.split("!")[1])
            ChatLib.chat(modPrefix + " Executing: /" + unformattedMessage.split("!")[1])
        }
    } else if (unformattedMessage.startsWith("From ") && data.partycmd.msgEnabled && unformattedMessage.includes("!p ")) {
        if (isInArray(unformattedMessage.split("!")[0].replace(/\[[^\]]+\]/,"").replace("From ","").replace(/ /g,"").replace(/:/g,"").toLowerCase(),data.partycmd.whitelist) && !isInArray("p " + unformattedMessage.split("!")[1].split(" ")[1],data.partycmd.blacklist) && unformattedMessage.split("!")[1].startsWith("p ")) {
            ChatLib.command(unformattedMessage.split("!")[1])
            ChatLib.chat(modPrefix + " Executing: /" + unformattedMessage.split("!")[1])
        }
    }
})

register("command", (...args) => {
    if (args[0]) {
        if (args[0] == "add") {
            if (args[1]) {
                if (!data.partycmd.whitelist.includes(args[1].toLowerCase())) {
                    data.partycmd.whitelist.push(args[1].toLowerCase())
                    data.save()
                    ChatLib.chat(modPrefix + " Added \"" + args[1] + "\" to the PartyCommands whitelist.")
                } else {
                    ChatLib.chat(modPrefix + " This player is already whitelisted.")
                }
            } else {
                ChatLib.chat("§cUsage: /partycommands add <ign>")
            }
        } else if (args[0] == "remove") {
            if (args[1]) {
                if (data.partycmd.whitelist.includes(args[1].toLowerCase())) {
                    data.partycmd.whitelist.splice(data.partycmd.whitelist.indexOf(args[1].toLowerCase()),1)
                    data.save()
                    ChatLib.chat(modPrefix + " Removed \"" + args[1] + "\" from the PartyCommands whitelist.")
                } else {
                    ChatLib.chat(modPrefix + " This player isn't whitelisted.")
                }
            } else {
                ChatLib.chat("§cUsage: /partycommands remove <ign>")
            }
        } else if (args[0] == "list") {
            string = "§2Currently whitelisted:\n"
            for (let i = 0; i < data.partycmd.whitelist.length; i++) {
                if (i != data.partycmd.whitelist.length - 1) {
                    string = string + "§a" + data.partycmd.whitelist[i] + ", "
                } else {
                    string = string + "§a" + data.partycmd.whitelist[i]
                }
            }
            ChatLib.chat(string)
        } else {
            ChatLib.chat("§cUsage: /partycommands <add/remove/list>")
        }
    } else {
        ChatLib.chat("§cUsage: /partycommands <add/remove/list>")
    }
}).setName("partycommands").setAliases(["partycmds","pcmds","pcmd"])