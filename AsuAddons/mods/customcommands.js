/// <reference types="../../CTAutocomplete" />
import { data, modPrefix } from "../index.js"

function hasCommand(command) {
    let returnBool = false
    for (let i = 0;i<data.CCcommands.length;i++) {
        if (data.CCcommands[i][0] == command) {
            returnBool = true
        }
    }
    return returnBool
}

function hasCommand(command) {
    let returnBool = false

    command = command.split(" ")[0]
    command = command.replace("/", "")

    for (let i = 0;i<data.CCcommands.length;i++) {
        if (data.CCcommands[i][0] == command) {
            returnBool = true
        }
    }
    return returnBool
}

for (let i = 0; i < data.CCcommands.length;i++) {
    register("command", () => {
        return
    }).setName(data.CCcommands[i][0])
}

register("messageSent", (message, event) => {
    let command = message.split(" ")[0]
    let args = message.replace(command, "")
    command = command.replace("/", "")

    if (message.startsWith("/") && hasCommand(message.toLowerCase())) {
        for (let i = 0;i<data.CCcommands.length;i++) {
            if (data.CCcommands[i][0] == command) {
                ChatLib.command(data.CCcommands[i][1] + args)
            }
        }
    }
})

register("command", (...args) => {
    if (args[0]) {
        if (args[1]) {
            if (!hasCommand(args[0].toLowerCase())) {
                let cmdArgs = args.slice(1).join(" ")
                data.CCcommands.push([args[0].toLowerCase(), cmdArgs])
                data.save()
                register("command", () => {
                    return
                }).setName(args[0].toLowerCase())
                ChatLib.chat(modPrefix + "§a Added new command with name \"/" + args[0] + "\" that runs \"/" + cmdArgs + "\".")
            } else {
                ChatLib.chat("§cCommand already exists.")
            }
        } else {
            ChatLib.chat("§cUsage: /addcommand <new command> <command to run>")
        }
    } else {
        ChatLib.chat("§cUsage: /addcommand <new command> <command to run>")
    }
}).setName("addCommand")

register("command", (...args) => {
    if (args[0]) {
        if (hasCommand(args[0].toLowerCase())) {
            for (let i = 0;i<data.CCcommands.length;i++) {
                if (data.CCcommands[i][0] == args[0].toLowerCase()) {
                    data.CCcommands.splice(i,1)
                    data.save()
                    ChatLib.chat(modPrefix + " §aRemoved \"/" + args[0] + "\".")
                }
            }
        } else {
            ChatLib.chat("§cCommand doesn't exist.")
        }
    } else {
        ChatLib.chat("§cUsage /removecommand <command>")
    }
}).setName("removecommand")
