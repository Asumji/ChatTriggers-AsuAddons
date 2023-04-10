let kickArray = []

function getIGN(ign) {
    let returnObj = [false, undefined]
    for (let i = 0;i<kickArray.length;i++) {
        if (kickArray[i] == ign) {
            returnObj[0] = true
            returnObj[1] = kickArray[i]
        }
    }
    return returnObj
}

register("command", (...args) => {
    if (args[0]) {
        kickArray.push(args[0].toLowerCase())
        ChatLib.chat("§a" + args[0] + " will be kicked when the dungeon is over!")
    } else {
        ChatLib.chat("§cUsage: /gkick <ign>")
    }
}).setName("gkick").setAliases(["gk"])

register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    const toKick = unformattedMessage.replace(/ /g,"").replace("joinedtheparty.","").toLowerCase()
    setTimeout(() => {
        if (toKick[0]) {
            ChatLib.chat(toKick)
            ChatLib.command("p kick " + toKick)
            kickArray.splice(kickArray.indexOf(toKick,1))
        }
    },2000)

}).setCriteria("joined the party.").setContains()
