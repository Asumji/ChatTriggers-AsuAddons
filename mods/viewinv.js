import { modPrefix } from "../index";
import { decodeInv, getrequest, openInv } from "../utils"

let lastRun = 0

register("command", (...args) => {
    if (Date.now()-lastRun <= 1000) return ChatLib.chat(modPrefix+" §cDon't spam the command.")
    lastRun = Date.now()
    if (!args) return ChatLib.chat(modPrefix+" §cNo UUID Given. Usage: /auvw <uuid>")
    getrequest("http://asumji.duckdns.org/v2/skyblock/profiles?uuid="+args[0]).then(res => {
        if (res.success == false) return ChatLib.chat(modPrefix+" §c"+res.cause+".")
        if (res.profiles == null) return ChatLib.chat(modPrefix+" §cThat player does not have any profiles.")
        res.profiles.forEach(profile => {
            if (!profile.selected) return
            if(profile["members"][args[0]]["inventory"]["inv_contents"] == null) {
                ChatLib.chat(modPrefix + "&c" + username + " has inventory API disabled.")
            } else {
                openInv(decodeInv(profile["members"][args[0]]["inventory"]["inv_contents"]["data"]))
            }
        });
    })
}).setName("auviewinv").setAliases(["auvw","auinv"])