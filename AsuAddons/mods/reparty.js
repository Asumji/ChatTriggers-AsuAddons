/// <reference types="../../CTAutocomplete" />
import { data } from "../index.js"

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
                if (int-1 == members.length) {
                    repartying = false
                }
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