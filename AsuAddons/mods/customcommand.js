/// <reference types="../../CTAutocomplete" />
import { data, modPrefix } from "../index.js"

function hasCommand(command) {
    let returnBool = false

    command = command.split(" ")[0]
    command = command.replace("/", "")

    for (let i = 0;i<data.cc.commands.length;i++) {
        if (data.cc.commands[i][0] == command) {
            returnBool = true
        }
    }
    return returnBool
}

for (let i = 0; i < data.cc.commands.length;i++) {
    register("command", () => {
        return
    }).setName(data.cc.commands[i][0])
}

register("messageSent", (message, event) => {
    console.log(message)
    let command = message.split(" ")[0]
    let args = message.replace(command, "")
    command = command.replace("/", "")
    console.log(command)

    if (message.startsWith("/") && hasCommand(message.toLowerCase())) {
        for (let i = 0;i<data.cc.commands.length;i++) {
            if (data.cc.commands[i][0] == command) {
                ChatLib.command(data.cc.commands[i][1] + args)
            }
        }
    }
})

register("command", (...args) => {
    if (args[0] && args[1]) {
        if (!hasCommand(args[0].toLowerCase())) {
            let cmdArgs = args.slice(1).join(" ")
            data.cc.commands.push([args[0].toLowerCase(), cmdArgs])
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
}).setName("addcommand")

register("command", (...args) => {
    if (args[0]) {
        if (hasCommand(args[0].toLowerCase())) {
            for (let i = 0;i<data.cc.commands.length;i++) {
                if (data.cc.commands[i][0] == args[0].toLowerCase()) {
                    data.cc.commands.splice(i,1)
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

register("command", () => {
    string = "§2Commands:\n"
    for (let i = 0; i < data.cc.commands.length; i++) {
        if (i != data.cc.commands.length - 1) {
            string = string + "§a/" + data.cc.commands[i][0] + "§2 -> " + "§a/" + data.cc.commands[i][1] + "\n"
        } else {
            string = string + "§a/" + data.cc.commands[i][0] + "§2 -> " + "§a/" + data.cc.commands[i][1]
        }
    }
    ChatLib.chat(string)
}).setName("listcommand")