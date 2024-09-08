import { data, modPrefix } from "../index.js"
import { Overlay } from "../moveGUI.js"

let validRun = true
let points = 0
let combo = 0
let comboTicks = 0
export const display = new Display();
display.setRenderLoc(data.vamp.allhitloc[0],data.vamp.allhitloc[1])
new Overlay("vamp","allhitloc","moveallhit","vampallhit.js","§aScore: §c12\n§65x Combo (2t)")
display.hide()


register("chat", (hearts,iced,attack) => {
    if (!data.vamp.allhit) return
    iced == "(ICED)" ? points += (Number(hearts) * 0.2) * (combo+1) : points += (Number(hearts)) * (combo+1)
    ChatLib.chat(modPrefix + ` §aYou scored §c${(iced == "(ICED)" ? (Number(hearts) * 0.2) * (combo+1) : (Number(hearts)) * (combo+1)).toFixed(1)} points §aon that attack! §6(${combo}x Combo)`)
    comboTicks = 10
    combo++
    display.show()
}).setCriteria(/Took (\d+)❤ ?(\(ICED\))? from (\w+)!/).setStart()

register("actionBar", () => {
    if (ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Slay the boss!/) == null || ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Rift Dimensio🔮n/) == null) return
    validRun = false
    display.setLine(0,new DisplayLine(`§cHemoglass Detected, Loser!\n§cHemoglass is illegitimate and will not be allowed for use in the All Hits Challenge.\n§cPlease refrain from using the item in order to have your run count.`))
    ChatLib.chat("§cHemoglass Detected, Loser!\n§cHemoglass is illegitimate and will not be allowed for use in the All Hits Challenge.\n§cPlease refrain from using the item in order to have your run count.")
}).setCriteria(/\+0.5❤/)

register("tick", () => {
    if (!data.vamp.allhit) return
    if (validRun) display.setLine(0,new DisplayLine(`§aScore: §c${points.toFixed(1)}\n§6${combo}x Combo (${comboTicks}t)`).setShadow(true))
    if (comboTicks > 0) comboTicks--
    if (comboTicks <= 0) combo = 0 
})

register("chat", () => {
    if (data.vamp.allhit) setTimeout(() => {
        validRun ? ChatLib.chat(modPrefix + ` §aYou achieved a total score of §c${points.toFixed(1)}.`) : ChatLib.chat("§cHemoglass Detected, Loser!\n§cHemoglass is illegitimate and will not be allowed for use in the All Hits Challenge.\n§cPlease refrain from using the item in order to have your run count.")
        display.hide()
        points = 0
        validRun = true
    },400)
}).setCriteria(/  SLAYER QUEST (COMPLETE|FAILED)!/).setStart()