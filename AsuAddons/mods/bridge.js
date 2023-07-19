/// <reference types="../../CTAutocomplete" />

import { data, modPrefix } from "../index.js"

register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    if (unformattedMessage.replace(/\[[^\]]+\]/, "").replace(/ /g, "").toLowerCase().startsWith("guild>" + data.bridge.botIGN) && unformattedMessage.toLowerCase() != "guild > " + data.bridge.botIGN + " joined.") {
        unformattedMessage = unformattedMessage.split(":").splice(1,2)
        unformattedMessage[0] = unformattedMessage[0].replace(" ", "")
        unformattedMessage[1] = unformattedMessage[1].replace(" ", "")
        cancel(event)
        ChatLib.chat(data.bridge.bridgeMessage.replace("<1>", unformattedMessage[0]).replace("<2>", unformattedMessage[1]))
        print(unformattedMessage.toString())
    }

}).setCriteria("Guild > ").setStart()

register("command", (...args) => {
    if (args[0]) {
        data.bridge.botIGN = args[0].toLowerCase()
        data.save()
        ChatLib.chat(modPrefix + " §aSet the Bridge Bot IGN to " + args[0] + ".")
    } else {
        ChatLib.chat("§cUsage: /bridgeset <ign>")
    }
}).setName("bridgeset")

register("command", (...args) => {
    if (args[0]) {
        if (args.join(" ").includes("<1>") && args.join(" ").includes("<2>")) {
            data.bridge.bridgeMessage = args.join(" ")
            data.save()
            ChatLib.chat(modPrefix + " §aSet the Bridge message to §r\"" + args.join(" ") + "§r\".")
        } else {
            ChatLib.chat("§cBridge message must include <1> and <2>.\n§c<1> being the message sender and <2> being the message.\m§cUse & for colours.")
        }
    } else {
        ChatLib.chat("§cUsage: /bridgemessage <message>")
    }
}).setName("bridgemessage")