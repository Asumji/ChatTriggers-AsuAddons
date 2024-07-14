import { data } from "../index.js"
import { showAUTitle } from "../utils.js"

register("chat", (color, pet) => {
    if (data.petrules.notif) showAUTitle(`${color}${pet}`,400,true,"§cAutopet")
}).setCriteria(/&.Autopet &.equipped your &.\[Lvl \d+\] (&.)([A-z ]+)(?:&. ✦)?&.! &.&.VIEW RULE&./).setStart()