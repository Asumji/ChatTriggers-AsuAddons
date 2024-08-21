import RenderLib from "RenderLib"
import { calculateDistanceQuick } from "../utils.js"
import { data } from "../index.js"
//Boss Detection adapted from https://github.com/zhenga8533/VolcAddons/blob/main/features/rift/VampireSlayer.js
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
let bossUUID = 0;
let renderRegistered = false
let renderRegister = undefined
let toMark = []
let maniaTimes = [24.8,21.6,18.3,15.1,11.9,8.6,5.3,2.0]
let maniaStage = 0
let ringRadius = 14

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
    if (ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Slay the boss!/) == null || ChatLib.removeFormatting(Scoreboard.getLines().join(" ")).match(/Rift Dimensio🔮n/) == null || data.vamp.enabled != true) return
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
                            if (data.vamp.debug) Tessellator.drawString(i.toString(),toMark[i].x+0.5,toMark[i].y+1,toMark[i].z+0.5,0x00ff00,true,1,true)
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
}).setCriteria(/(?:   » Slay \d+ Combat XP worth of Vampires\.|  SLAYER QUEST COMPLETE!|  SLAYER QUEST FAILED!)/).setStart()