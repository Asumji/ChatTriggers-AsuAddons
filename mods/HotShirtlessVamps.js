import RenderLib from "RenderLib"
import { calculateDistanceQuick } from "../utils.js"
import { data } from "../index.js"
import { Overlay } from "../moveGUI.js"
//Boss Detection adapted from https://github.com/zhenga8533/VolcAddons/blob/main/features/rift/VampireSlayer.js
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
let bossUUID = 0;
let renderRegistered = false
let renderRegister = undefined
let toMark = []
let maniaTimes = [24.8,21.6,18.3,15.1,11.9,8.6,5.3,2.0]
let maniaStage = 0
let ringRadius = 14
let inMania = false
let splitTimer = 0
let fullTimer = 0
let splits = []
let displayShown = false

export const display = new Display();
display.setRenderLoc(data.vamp.location[0],data.vamp.location[1])
new Overlay("vamp","location","movevamp","HotShirtlessVamps.js", "§aDamage: §c20t §6/ §c1.0s\n§5Mania\n§aDamage: §c20t §6/ §c1.0s\n§aFull Boss: §c40t &6/ §c2.0s")
display.hide()

function scanMania(boss,attempt) {
    if (data.vamp.debug) console.log("checking mania")
    toMark = []
    let xOffset = 0
    let zOffset = 1
    for (let i = 1; i <= 784; i++) {
        let block = World.getBlockAt(boss.field_70165_t+ringRadius-xOffset,boss.field_70163_u-4,boss.field_70161_v-ringRadius+zOffset)
        if (block.type.getRegistryName() == "minecraft:stained_hardened_clay" && block.getMetadata() == 13) {
            if (calculateDistanceQuick([boss.field_70165_t,boss.field_70163_u,boss.field_70161_v],[block.x,block.y,block.z]) > 196 && attempt < 1) return setTimeout(() => { scanMania(boss,1) },1300)
            toMark.push(block)
        }
        if (i % 28 == 0) {
            xOffset++
            zOffset = 0
        }
        zOffset++
    }
}

register("tick", () => {
    if (ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Slay the boss!/) == null || ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Rift Dimensio🔮n/) == null) return
    if (data.vamp.splits) {
        if (displayShown == false) {
            display.show()
            displayShown = true
        }
        fullTimer += 1
        if (inMania && splitTimer != 0) {
            splits.push(splitTimer)
            splitTimer = 0
        } else if (!inMania) {
            if (splits[splits.length-1] != "§5Mania" && splits.length >= 1) splits.push("§5Mania")
            splitTimer += 1
        }
        for (let i = 0; i < splits.length; i++) {
            splits[i] != "§5Mania" ? display.setLine(i,new DisplayLine("§aDamage: §c"+String(splits[i])+"t §6/ §c"+String(splits[i]/20)+"s").setShadow(true)) : display.setLine(i,new DisplayLine(splits[i]).setShadow(true))
        }
        splitTimer != 0 ? display.setLine(splits.length,new DisplayLine("§aCurrent Split: §c"+String(splitTimer)+"t §6/ §c"+String(splitTimer/20)+"s").setShadow(true)) : display.setLine(splits.length,new DisplayLine("§aCurrent Split: §5Mania").setShadow(true))
        display.setLine(splits.length+1,new DisplayLine("§aFull Boss: §c"+String(fullTimer)+"t §6/ §c"+String(fullTimer/20)+"s").setShadow(true))
    }
    if (data.vamp.enabled == true) {
        const player = Player.asPlayerMP().getEntity();
        const stands = World.getWorld()
            .func_72839_b(player, player.func_174813_aQ().func_72314_b(16, 16, 16))
            .filter((entity) => entity instanceof EntityArmorStand);

        if (!bossUUID) {
            const spawned = stands.find((stand) => ChatLib.removeFormatting(stand.func_95999_t()) == "Spawned by: " + Player.getName())
            if (spawned == undefined) return;
            const spawn = stands.find((stand) => calculateDistanceQuick([spawned.field_70165_t, spawned.field_70163_u, spawned.field_70161_v], [stand.field_70165_t, stand.field_70163_u, stand.field_70161_v]) < 2 && stand.func_95999_t().includes("3:5"))
            if (spawn === undefined) return;
            bossUUID = spawn.persistentID;
        } else {
            const boss = stands.find((stand) => stand.persistentID === bossUUID);
            if (boss === undefined) return;
            const name = boss.func_95999_t().split(" ");

            const maniaIndex = name.indexOf("§5§lMANIA");
            if (maniaIndex !== -1) {
                if (inMania == false) inMania = true
                if (Number(name.join(" ").match(/§5§lMANIA §b§l(\d+\.\d)/)[1]) <= maniaTimes[maniaStage]) {
                    maniaStage++
                    scanMania(boss,0)
                    if (data.vamp.debug) console.log(toMark, boss)
                }

                if (renderRegistered == false) {
                    if (renderRegister == undefined) {
                        renderRegister = register("renderWorld", () => {
                            if (data.vamp.debug) RenderLib.drawInnerEspBox(boss.field_70165_t,boss.field_70163_u,boss.field_70161_v,1,1,0,255,0,0.5,false)
                            for (let i = 0; i < toMark.length; i++) {
                                RenderLib.drawInnerEspBox(toMark[i].x+0.5,toMark[i].y+0.01,toMark[i].z+0.5,1,1,0,255,0,0.5,false)
                                if (data.vamp.debug && toMark[i] != undefined) Tessellator.drawString(i.toString(),toMark[i].x+0.5,toMark[i].y+1,toMark[i].z+0.5,0x00ff00,true,1,true)
                            }
                        })
                    } else {
                        renderRegister.register()
                    }
                    renderRegistered = true
                }
            } else {
                if (renderRegistered == true) {
                    renderRegister.unregister()
                    renderRegistered = false
                    toMark = []
                    maniaStage = 0
                    inMania = false
                }
            }
        }
    }
})

register("chat", () => {
    if (renderRegistered && renderRegister != undefined) renderRegister.unregister()
    bossUUID = 0;
    renderRegistered = false
    renderRegister = undefined
    toMark = []
    if (displayShown == true) {
        display.hide()
        inMania = false
        displayShown = false
        setTimeout(() => {
            for (let i = 0; i < splits.length; i++) {
                splits[i] == "§5Mania" ? ChatLib.chat("  §5Mania") : ChatLib.chat("  §aDamage: §c"+String(splits[i])+"t §6/ §c"+String(splits[i]/20)+"s")
            }
            ChatLib.chat("  §aFull Boss: §c"+String(fullTimer)+"t §6/ §c"+String(fullTimer/20)+"s")
            fullTimer = 0
            splitTimer = 0
            splits = []
        },300)
    }
}).setCriteria(/(?:   » Slay \d+ Combat XP worth of Vampires\.|  SLAYER QUEST COMPLETE!|  SLAYER QUEST FAILED!)/).setStart()