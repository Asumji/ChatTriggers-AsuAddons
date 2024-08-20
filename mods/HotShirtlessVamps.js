import RenderLib from "RenderLib"
import { data } from "../index.js";

//Boss Detection: https://github.com/zhenga8533/VolcAddons/blob/main/features/rift/VampireSlayer.js
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
let bossUUID = 0;
let renderRegistered = false
let renderRegister = undefined
let toMark = []
let maniaTimes = [24.8,21.6,18.3,15.1,11.9,8.6,5.3,2.0]
let maniaStage = 0
let ringRadius = 14

const vampRegister = register("tick", () => {
    if (!data.vamp.enabled) return
    const player = Player.asPlayerMP().getEntity();
    const stands = World.getWorld()
        .func_72839_b(player, player.func_174813_aQ().func_72314_b(16, 16, 16))
        .filter((entity) => entity instanceof EntityArmorStand);

    if (!bossUUID) {
        const spawn = stands.find((stand) => stand.func_95999_t().includes("3:59"));
        if (spawn === undefined) return;
        bossUUID = spawn.persistentID;
    } else {
        const boss = stands.find((stand) => stand.persistentID === bossUUID);
        if (boss === undefined) return;
        const name = boss.func_95999_t().split(" ");

        // Mania Detect
        const maniaIndex = name.indexOf("§5§lMANIA");
        if (maniaIndex !== -1) {
            if (Number(name.join(" ").match(/§5§lMANIA §b§l(\d+\.\d)/)[1]) <= maniaTimes[maniaStage]) {
                maniaStage++
                toMark = []
                console.log("checking mania")
                let xOffset = 0
                let zOffset = 1
                for (let i = 1; i <= 784; i++) {
                    let block = World.getBlockAt(boss.field_70165_t+ringRadius-xOffset,boss.field_70163_u-4,boss.field_70161_v-ringRadius+zOffset)
                    if (block.type.getRegistryName() == "minecraft:stained_hardened_clay" && block.getMetadata() == 13) toMark.push(block)
                    if (i % 28 == 0) {
                        xOffset++
                        zOffset = 0
                    }
                    zOffset++
                }
            }

            if (renderRegistered == false) {
                if (renderRegister == undefined) {
                    renderRegister = register("renderWorld", () => {
                        for (let i = 0; i < toMark.length; i++) {
                            RenderLib.drawInnerEspBox(toMark[i].x+0.5,toMark[i].y+0.01,toMark[i].z+0.5,1,1,0,255,0,0.5,false)
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
vampRegister.unregister()

register("chat", () => {
    vampRegister.register()
    bossUUID = 0;
    renderRegistered = false
    renderRegister = undefined
    toMark = []
}).setCriteria(/   » Slay \d+ Combat XP worth of Vampires\./).setStart()

register("chat", () => {
    vampRegister.unregister()
}).setCriteria("JAILED! You lost all your ❤! You were sent to the Oubliette!")