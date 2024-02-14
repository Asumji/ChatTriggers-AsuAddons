import {
    data,
    modPrefix,
    File
} from "../index.js";

import { isInArrayIdx } from "../utils.js"

register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    if (unformattedMessage.startsWith("Party >") && unformattedMessage.includes("!p ")) {
        if (data.partycmd.whitelist.includes(unformattedMessage.split("!")[0].replace(/\[[^\]]+\]/,"").replace("Party > ","").replace(/ /g,"").replace(/:/g,"").toLowerCase()) && !data.partycmd.blacklist.includes("p " + unformattedMessage.split("!")[1].split(" ")[1]) && unformattedMessage.split("!")[1].startsWith("p ")) {
            ChatLib.command(unformattedMessage.split("!")[1])
            ChatLib.chat(modPrefix + " Executing: /" + unformattedMessage.split("!")[1])
        }
    } else if (unformattedMessage.startsWith("From ") && data.partycmd.msgEnabled && unformattedMessage.includes("!p ")) {
        if (data.partycmd.whitelist.includes(unformattedMessage.split("!")[0].replace(/\[[^\]]+\]/,"").replace("From ","").replace(/ /g,"").replace(/:/g,"").toLowerCase()) && !data.partycmd.blacklist.includes("p " + unformattedMessage.split("!")[1].split(" ")[1]) && unformattedMessage.split("!")[1].startsWith("p ")) {
            ChatLib.command(unformattedMessage.split("!")[1])
            ChatLib.chat(modPrefix + " Executing: /" + unformattedMessage.split("!")[1])
        }
    }
})

commandPrefix = "!"
register("chat", (event) => {
    let cmd = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    if (data.partycmd.customEnabled && cmd.split(": ")[1].startsWith(commandPrefix) &! data.partycmd.customBlacklist.includes(cmd.split(":")[0].replace(/ /g,"").replace(/\[[^\]]+\]/,"").replace("Party>",""))) {
        cmd = cmd.split(commandPrefix)[1]
        const f = new File("config/ChatTriggers/modules/AsuAddons/mods/", "custompcmds")
        if (f.exists()) {
            const fileArray = f.listFiles()
            for (let i = 0; i < fileArray.length; i++) {

                if (typeof isInArrayIdx(fileArray[i].toString().split("\\")[6].split(".")[0],data.partycmd.commands,0) == "boolean") {
                    data.partycmd.commands.push([fileArray[i].toString().split("\\")[6].split(".")[0],true])
                }

                let f1 = fileArray[i].toString().split("\\")[6].split(".")[0]
                if (f1 == cmd.split(" ")[0].toLowerCase()) {
                    for (let j = 0; j < data.partycmd.commands.length; j++) {
                        if (data.partycmd.commands[j][0] == f1 && data.partycmd.commands[j][1]) {
                            ChatLib.chat(modPrefix + " Executing: !" + cmd)
                            setTimeout(() => {
                                require("../mods/custompcmds/" + f1).execute(cmd.split(" "))
                            }, 1000);
                        }
                    }
                }
            }
        }
    }
}).setCriteria("Party >").setContains()

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