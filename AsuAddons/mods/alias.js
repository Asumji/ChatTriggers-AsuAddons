/// <reference types="../../CTAutocomplete" />

import { data, modPrefix } from "../index.js"

function hasIGN(ign) {
    let returnBool = false
    for (let i = 0;i<data.alias.names.length;i++) {
        if (data.alias.names[i][1] == ign) {
            returnBool = true
        }
    }
    return returnBool
}

function hasAlias(alias) {
    let returnBool = false
    for (let i = 0;i<data.alias.names.length;i++) {
        if (data.alias.names[i][0] == alias) {
            returnBool = true
        }
    }
    return returnBool
}

register("messageSent", (message, event) => {
    if (message.includes("/addalias") || message.includes("/removealias")) return
    for (let i = 0; i < data.alias.names.length; i++) {
        if (message.toLowerCase().includes(data.alias.names[i][0])) {
            cancel(event)
            const newMessage = message.toLowerCase().replace(data.alias.names[i][0], data.alias.names[i][1])
            ChatLib.say(newMessage)
            ChatLib.addToSentMessageHistory(-1, newMessage)
        }
    }
})

register("command", (...args) => {
    if (args[0] && args[1]) {
        if (!hasIGN(args[1].toLowerCase()) && !hasAlias(args[0].toLowerCase())) {
            data.alias.names.push([args[0].toLowerCase(), args[1].toLowerCase()])
            data.save()
            ChatLib.chat(modPrefix + "§aAdded the alias \"" + args[0] + "\" for the player \"" + args[1] + "\".")
        } else {
            ChatLib.chat("§cThat player already has an alias or the alias already exists.")
        }
    } else {
        ChatLib.chat("§cUsage: /addalias <alias> <ign>")
    }
}).setName("addalias")

register("command", (...args) => {
    if (args[0]) {
        if (hasAlias(args[0].toLowerCase())) {
            for (let i = 0;i<data.alias.names.length;i++) {
                if (data.alias.names[i][0] == args[0].toLowerCase()) {
                    data.alias.names.splice(i,1)
                    data.save()
                    ChatLib.chat(modPrefix + "§aRemoved the alias \"" + args[0] + "\".")
                }
            }
        } else {
            ChatLib.chat("§cThat alias doesn't exist.")
        }
    } else {
        ChatLib.chat("§cUsage: /removealias <alias>")
    }
}).setName("removealias")