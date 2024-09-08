import { data, modPrefix } from "../index.js"

let points = 0

register("chat", (hearts,iced,attack) => {
    if (data.vamp.allhit) iced == "(ICED)" ? points += Number(hearts) * 0.2 : points += Number(hearts)
}).setCriteria(/Took (\d+)❤ ?(\(ICED\))? from (\w+)!/).setStart()

register("chat", () => {
    if (data.vamp.allhit) setTimeout(() => {
        ChatLib.chat(modPrefix + ` §aYou took §c${points.toFixed(1)}❤ §adamage in total.`)
        points = 0
    },400)
}).setCriteria(/  SLAYER QUEST (COMPLETE|FAILED)!/).setStart()