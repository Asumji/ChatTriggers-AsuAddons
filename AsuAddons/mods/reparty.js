/// <reference types="../../CTAutocomplete" />
import { data, modPrefix } from "../index.js"

register("command", (...args) => {
    if (args[0] == "cd") {
        if (args[1]) {
            if (Number(args[1])) {
                data.rp.cooldown = Number(args[1])*1000
                data.save()
                ChatLib.chat(`§aCooldown has been set to ${args[1]}s!`)
            } else {
                ChatLib.chat("§cCooldown has to be a number (seconds)!")
            }
        } else {
            ChatLib.chat("§cUsage: /autojoin cd [seconds]")
        }
        return
    }
    data.rp.autojoin ? data.rp.autojoin = false : data.rp.autojoin = true
    data.save()
    data.rp.autojoin ? ChatLib.chat(modPrefix + " Enabled AutoPartyJoin") : ChatLib.chat(modPrefix + " Disabled AutoPartyJoin")
}).setName("autojoin").setAliases(["aj"])

let disbanded = undefined
register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    unformattedMessage = unformattedMessage.replace(/ /g,"").replace("hasdisbandedtheparty!","").replace(/\[[^\]]+\]/,"")
    if (data.rp.autojoin) {
        disbanded = unformattedMessage
        setTimeout(() => {
            disbanded = undefined
        }, data.rp.cooldown);
    }
}).setCriteria("&r&ehas disbanded the party!&r").setContains()

register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    unformattedMessage = unformattedMessage.replace(/ /g,"").replace(/-----------------------------------------------------/g,"").replace(/\n/g,"").replace("hasinvitedyoutojointheirparty!Youhave60secondstoaccept.Clickheretojoin!","").replace(/\[[^\]]+\]/,"")
    if (data.rp.autojoin) {
        if (disbanded != undefined && unformattedMessage == disbanded) {
            ChatLib.command("p accept " + unformattedMessage)
        }
    }
}).setCriteria("has invited you to join their party!").setContains()

let repartying = false
let members = []
register("command", () => {
    repartying = true
    members = []
    ChatLib.command("pl")
    setTimeout(() => {
        ChatLib.command("p disband")
        members.pop()
        members.forEach((mem,int) => {
            setTimeout(() => {
                ChatLib.command("p " + mem) 
            }, 500*int); 
        })
    }, 1000);
}).setName("reparty").setAliases(["rp","reeparty"])

register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    if (repartying) {
        if (unformattedMessage.includes("Party Members:")) {
            members = unformattedMessage.replace(/ /g,"").replace(/\[[^\]]+\]/g,"").replace(/●/g," ").replace("PartyMembers:","").split(" ")
        }
    }
}).setCriteria("Party").setContains()