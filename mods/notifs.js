import { data } from "../index.js"
import { showAUTitle } from "../utils.js"

register("chat", (color, pet) => {
    if (data.petrules.notif) showAUTitle(`${color}${pet}`,400,true,"§cAutopet")
}).setCriteria(/&.Autopet &.equipped your &.\[Lvl \d+\] (&.)([A-z ]+)(?:&. ✦)?&.! &.&.VIEW RULE&./).setStart()

register("chat", (name,type,current,goal) => {
    	if (!data.dpu.devNotification || type != "device") return
        if (data.dpu.devOnlySelf && name != Player.name) return
        showAUTitle(`§6§l${name} §a§lcompleted a device.`,700,true,"")
}).setCriteria(/(.*) (?:activated|completed) a (lever|terminal|device)! \((\d)\/(\d)\)/)