import { data } from "../index.js"

const prefix = "#"
let mode = ["leave", true]
let allowCommands = ["Everyone", true]

register("chat", event => {
  if (Player.name == data.bot) {
    let msg = ChatLib.getChatMessage(event)
    for (let i = 0; i < data.names.length; i++) {
      if (msg.toLowerCase().includes(data.names[i])) {
        setTimeout(() => {
          ChatLib.command("p accept " + data.names[i], false)
        }, 1000);
        break;
      }
    }
  }
}).setChatCriteria("invited you to join their party!").setContains()

register("chat", event => {
  if (Player.name == data.bot) {
    let msg = ChatLib.getChatMessage(event).removeFormatting()
    if (msg.startsWith("Party >")) {
      const ign = msg.split(": ")[0]
      msg = msg.split(": ")[1] 
      const args = msg.split(" ")
      if (allowCommands[0] == "Owner" && ign == data.owner || allowCommands[0] == "Everyone") {
        if (msg.toLowerCase().startsWith(prefix + "togglemode")) {
          mode[1] ? mode = ["stay", false] : mode = ["leave", true]
          ChatLib.command("pc I will now " + mode[0] + " after joining a dungeon!", false)
        } else if (msg.toLowerCase().startsWith(prefix + "toggleperms") && ign == data.owner) {
          allowCommands[1] ? allowCommands = ["Owner", false] : allowCommands = ["Everyone", true]
          ChatLib.command("pc " + allowCommands[0] + " can now execute commands!", false)
        } else if (msg.toLowerCase().startsWith(prefix + "addplayer")) {
          if (args[1]) {
            data.names.push(args[1])
            data.save()
            ChatLib.command("pc Added " + args[1] + " to allowed players list.", false)
          }
        } else if (msg.toLowerCase().startsWith(prefix + "removeplayer")) {
          if (data.names.includes(args[1])) {
            data.names.splice(data.names.indexOf(args[1],1))
            data.save()
            ChatLib.command("pc Removed " + args[1] + " from allowed players list.", false)
          }
        } else if (msg.toLowerCase().startsWith(prefix + "settings")) {
          string = "Allowed players: "
          for (let i = 0; i < data.names.length; i++) {
            if (i != data.names.length - 1) {
              string = string + data.names[i] + ", "
            } else {
              string = string + data.names[i]
            }
          }
          ChatLib.command("pc Mode: " + mode[0] + " Permissions: " + allowCommands[0] + " " + string, false)
        }
      } else {
        ChatLib.command("pc Only the owner can currently execute commands!", false)
      }
    }
  }
}).setChatCriteria(prefix).setContains()

register("chat", event => {
  if (Player.name == data.bot) {
    if (mode[0] == "leave") {
      setTimeout(() => {
        ChatLib.command("p leave")
      }, 1000);
    }
  }
}).setChatCriteria("entered The Catacombs").setContains()