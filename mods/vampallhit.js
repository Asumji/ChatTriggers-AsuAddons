import { data, modPrefix } from "../index.js"
import { Overlay } from "../moveGUI.js"
import { isInArrayIdx } from "../utils.js"

const comboMulti = 0.5
const combotTimeTicks = 30
const bonusCombos = {
    "Royal Flush": [["Twinclaws","Impel","Mania"],500]
}

let validRun = true
let points = 0
let combo = []
let comboTicks = 0
export const display = new Display();
display.setRenderLoc(data.vamp.allhitloc[0],data.vamp.allhitloc[1])
new Overlay("vamp","allhitloc","moveallhit","vampallhit.js","§aScore: §c12\n§65x Combo (2t)")
display.hide()


register("chat", (hearts,iced,attack) => {
    if (!data.vamp.allhit) return
    iced == "(ICED)" ? points += (Number(hearts) * 0.2) * (comboMulti*combo.length+1) : points += (Number(hearts)) * (comboMulti*combo.length+1)
    ChatLib.chat(modPrefix + ` §aYou scored §c${(iced == "(ICED)" ? (Number(hearts) * 0.2) * (comboMulti*combo.length+1) : (Number(hearts)) * (comboMulti*combo.length+1)).toFixed(1)} points §aon that attack! §6(${combo.length}x Combo)`)
    comboTicks = combotTimeTicks
    attack == "Mania" && hearts <= 3 ? combo.push(["Mania3",iced == "(ICED)"]) : combo.push([attack,iced == "(ICED)"])
    for (let bonusCombo in bonusCombos) {
        if (combo.length < bonusCombos[bonusCombo][0].length) break
        let comboReq = bonusCombos[bonusCombo][0].slice()
        let recentAttacks = combo.slice(combo.length-comboReq.length,combo.length)
        for (let i = 0; i < recentAttacks.length; i++) {
            if (typeof isInArrayIdx(comboReq[2-i],recentAttacks,0) != "boolean") comboReq.pop()
            if (comboReq.length == 0) {
                ChatLib.chat(modPrefix + ` §aYou scored a §6${bonusCombo} §agranting you an extra §c${bonusCombos[bonusCombo][1]} §apoints!`)
                points += bonusCombos[bonusCombo][1]
            }
        }
    }
    display.show()
}).setCriteria(/Took (\d+)❤ ?(\(ICED\))? from (\w+)!/).setStart()

register("actionBar", () => {
    if (!data.vamp.allhit) return
    if (ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Slay the boss!/) == null || ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Rift Dimensio🔮n/) == null) return
    validRun = false
    display.setLine(0,new DisplayLine(`§cHemoglass Detected, Loser!\n§cHemoglass is illegitimate and will not be allowed for use in the All Hits Challenge.\n§cPlease refrain from using the item in order to have your run count.`))
    ChatLib.chat("§cHemoglass Detected, Loser!\n§cHemoglass is illegitimate and will not be allowed for use in the All Hits Challenge.\n§cPlease refrain from using the item in order to have your run count.")
}).setCriteria(/\+0.5❤/).setContains()

register("tick", () => {
    if (!data.vamp.allhit) return
    if (validRun) display.setLine(0,new DisplayLine(`§aScore: §c${points.toFixed(1)}\n§6${combo.length}x Combo (${comboTicks}t)`).setShadow(true))
    if (comboTicks > 0) comboTicks--
    if (comboTicks <= 0) combo = []
})

register("chat", () => {
    if (data.vamp.allhit) setTimeout(() => {
        validRun ? ChatLib.chat(new Message(modPrefix + ` §aYou achieved a total score of §c${points.toFixed(1)}.\n`).addTextComponent(new TextComponent("§6§l[CLICK HERE] §ato see all bonus point combos.").setClick("run_command","/auviewbonuscombos"))) : ChatLib.chat("§cHemoglass Detected, Loser!\n§cHemoglass is illegitimate and will not be allowed for use in the All Hits Challenge.\n§cPlease refrain from using the item in order to have your run count.")
        display.hide()
        points = 0
        validRun = true
    },400)
}).setCriteria(/  SLAYER QUEST (COMPLETE|FAILED)!/).setStart()

register("command", () => {
    let outputString = ""
    for (let bonusCombo in bonusCombos) {
        outputString += `§6"${bonusCombo}" §arequires §6${bonusCombos[bonusCombo][0].join(", ")} §ain ${combotTimeTicks} ticks.\n§aReward: §c${bonusCombos[bonusCombo][1]} points`
    }
    ChatLib.chat(outputString.trim())
}).setName("auviewbonuscombos")