import { data, modPrefix } from "../index.js"

const prefix = "#"
let mode = ["leave", true]
let allowCommands = ["Everyone", true]

register("chat", event => {
  if (data.frag.enabled == true) {
    if (Player.name.toLowerCase() == data.frag.bot) {
      let msg = ChatLib.getChatMessage(event)
      for (let i = 0; i < data.frag.names.length; i++) {
        if (msg.toLowerCase().includes(data.frag.names[i])) {
          setTimeout(() => {
            ChatLib.command("p accept " + data.frag.names[i], false)
          }, 1000);
          break;
        }
      }
    }
  }
}).setChatCriteria("invited you to join their party!").setContains()

register("chat", event => {
  if (data.frag.enabled == true) {
    if (Player.name.toLowerCase() == data.frag.bot) {
      let msg = ChatLib.getChatMessage(event).removeFormatting()
      if (msg.startsWith("Party >")) {
        const ign = msg.split(": ")[0].replace(/ /g,"").replace("Party>").replace(/\[[^\]]+\]/,"").toLowerCase()
        msg = msg.split(": ")[1] 
        const args = msg.split(" ")
        if (allowCommands[0] == "Owner" && ign == data.frag.owner || allowCommands[0] == "Everyone") {
          if (msg.toLowerCase().startsWith(prefix + "togglemode")) {
            mode[1] ? mode = ["stay", false] : mode = ["leave", true]
            ChatLib.command("pc I will now " + mode[0] + " after joining a dungeon!", false)
          } else if (msg.toLowerCase().startsWith(prefix + "toggleperms") && ign == data.frag.owner) {
            allowCommands[1] ? allowCommands = ["Owner", false] : allowCommands = ["Everyone", true]
            ChatLib.command("pc " + allowCommands[0] + " can now execute commands!", false)
          } else if (msg.toLowerCase().startsWith(prefix + "addplayer")) {
            if (args[1]) {
              data.frag.names.push(args[1].toLowerCase())
              data.save()
              ChatLib.command("pc Added " + args[1] + " to allowed players list.", false)
            }
          } else if (msg.toLowerCase().startsWith(prefix + "removeplayer")) {
            if (data.frag.names.includes(args[1])) {
              data.frag.names.splice(data.frag.names.indexOf(args[1].toLowerCase(),1))
              data.save()
              ChatLib.command("pc Removed " + args[1] + " from allowed players list.", false)
            }
          } else if (msg.toLowerCase().startsWith(prefix + "settings")) {
            string = "Allowed players: "
            for (let i = 0; i < data.frag.names.length; i++) {
              if (i != data.frag.names.length - 1) {
                string = string + data.frag.names[i] + ", "
              } else {
                string = string + data.frag.names[i]
              }
            }
            ChatLib.command("pc Mode: " + mode[0] + " Permissions: " + allowCommands[0] + " " + string, false)
          }
        } else {
          ChatLib.command("pc Only the owner can currently execute commands!", false)
        }
      }
    }
  }
}).setChatCriteria(prefix).setContains()

register("chat", event => {
  if (data.frag.enabled == true) {
    if (Player.name.toLowerCase() == data.frag.bot) {
      if (mode[0] == "leave") {
        setTimeout(() => {
          ChatLib.command("p leave")
        }, 1000);
      }
    }
  }
}).setChatCriteria("entered The Catacombs").setContains()

register("command", (...args) => {
  data.frag.enabled ? data.frag.enabled = false : data.frag.enabled = true
  data.save()
  data.frag.enabled ? ChatLib.chat(modPrefix + " Enabled the FragBot mod") : ChatLib.chat(modPrefix + " Disabled the FragBot mod")
}).setName("frag")