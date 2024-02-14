import { data, modPrefix } from "../index.js"
import { isInArrayIdx } from "../utils.js";

let tempCmds = []
data.cc.commands.forEach(cmd => {
    tempCmds.push([cmd[0],cmd[1],false])
})
for (let i = 0; i < tempCmds.length;i++) {
    for (let i = 0; i < tempCmds.length;i++) {
        if (tempCmds[i][2] != true) {
            let correctCmd = tempCmds[i][1]
            register("command", (...args) => {
                ChatLib.command(correctCmd + " " + args.join(" "))
            }).setName(tempCmds[i][0])

            tempCmds[i][2] = true
        }
    }
}

register("command", (...args) => {
    if (args[0] && args[1]) {
        if (typeof isInArrayIdx(args[0].toLowerCase().split(" ")[0].replace("/", ""),data.cc.commands,0) == "boolean") {
            let cmdArgs = args.slice(1).join(" ")
            data.cc.commands.push([args[0].toLowerCase(), cmdArgs])
            data.save()
            register("command", (...args) => {
                ChatLib.command(cmdArgs + " " + args.join(" "))
            }).setName(args[0].toLowerCase())
            ChatLib.chat(modPrefix + " §aAdded new command with name \"/" + args[0] + "\" that runs \"/" + cmdArgs + "\".")
        } else {
            ChatLib.chat("§cCommand already exists.")
        }
    } else {
        ChatLib.chat("§cUsage: /addcommand <new command> <command to run>")
    }
}).setName("addcommand")

register("command", (...args) => {
    if (args[0]) {
        if (typeof isInArrayIdx(args[0].toLowerCase().split(" ")[0].replace("/", ""),data.cc.commands,0) != "boolean") {
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