import { data, modPrefix } from "../index.js"
import { Overlay } from "../moveGUI.js"
import { showAUTitle } from "../utils.js"

//Jump height numbers from https://hypixel.net/threads/advanced-guide-to-using-spring-boots.5469527/
const levels = {
    0.6984127163887024: [6.5,2],
    0.8253968358039856: [19,6],
    0.8888888955116272: [31,8],
    0.9365079402923584: [40,7],
    1.047619104385376: [47,7],
    1.1746032238006592: [56,10],
    1.317460298538208: [61,5],
    1.7777777910232544: [61,0],
}

export const display = new Display();
display.setRenderLoc(data.spring.location[0],data.spring.location[1])
new Overlay("spring","movespring","springboots.js")

let blocks = 0
let currentPitch = 0
let startBlocks = 0
let checkpointsPassed = 0
let displayShown = true
register("soundPlay", (pos, name, vol, pitch) => {
    if (!data.spring.enabled) return
    if (Player.armor.getBoots().getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getString("id") != "SPRING_BOOTS") return
    if (!Player.isSneaking()) return
    if (pitch != currentPitch) {
        currentPitch = pitch
        startBlocks = blocks
    }
    if (levels[pitch] && levels[pitch][1] != 0) blocks += ((levels[pitch][0]-startBlocks)/levels[pitch][1]) 
    if (blocks >= Number(data.spring.checkpoints[checkpointsPassed])) {
        checkpointsPassed += 1
        showAUTitle(`§${checkpointsPassed}Checkpoint ${checkpointsPassed} passed!`,400,true,"§cSpring Boots")
    }
}).setCriteria("note.pling")

register("tick", () => {
    if (Player.armor.getBoots().getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getString("id") != "SPRING_BOOTS" && displayShown) {
        displayShown = false
        return display.hide()
    }
    if (Player.armor.getBoots().getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getString("id") == "SPRING_BOOTS" &! displayShown) {
        displayShown = true
        display.show()
    }
    if (data.spring.enabled) display.setLine(0,`Spring Boots: ${Math.floor(blocks)} Blocks`)
    if (Player.getMotionY() > 0 && data.spring.enabled) {
        if (blocks != 0 && data.spring.editMode) ChatLib.chat(new Message(`${modPrefix} §aPrevious Jump Height was: §6${Math.floor(blocks)}`).addTextComponent(new TextComponent("\n§a§l[CLICK HERE] §6to save as checkpoint.").setClick("run_command",`/auspringcheckpoint add ${Math.floor(blocks)}`)))
        blocks = 0
        checkpointsPassed = 0
    }
})

register("command", (...args) => {
    switch(args[0]) {
        case "add":
            if (!args[1]) return ChatLib.chat("§cUsage: /auspringcheckpoint add (checkpoint value)")
            if (data.spring.checkpoints.length >= 9) return ChatLib.chat("§cCheckpoints limit has been reached. Remove some!")
            if (data.spring.checkpoints.includes(args[1])) return ChatLib.chat("§cThe checkpoint you provided already exists.")
            if (isNaN(args[1])) return ChatLib.chat("§cThe checkpoint you provided isn't a number.")
            if (data.spring.checkpoints.length == 0) {
                ChatLib.chat(`${modPrefix} §1Checkpoint 1 §awith value §6${args[1]} §awas successfully saved!`)
                data.spring.checkpoints.push(args[1])
            } else {
                data.spring.checkpoints.forEach((checkpoint,i) => {
                    if (Number(checkpoint) >= Number(args[1])) {
                        ChatLib.chat(`${modPrefix} §${i}Checkpoint ${i} §awith value §6${args[1]} §awas successfully saved!`)
                        data.spring.checkpoints.splice(i,0,args[1])
                    } else if (i+1 == data.spring.checkpoints.length) {
                        ChatLib.chat(`${modPrefix} §${i+2}Checkpoint ${i+2} §awith value §6${args[1]} §awas successfully saved!`)
                        data.spring.checkpoints.push(args[1])
                    }
                });
            }
            data.save()
            break;
        case "remove":
            if (!args[1]) return ChatLib.chat("§cUsage: /auspringcheckpoint remove (checkpoint index)")
            if (isNaN(args[1])) return ChatLib.chat("§cThe checkpoint you provided isn't a number.")
            if (data.spring.checkpoints.length < Number(args[1])) return ChatLib.chat("§cThe checkpoint you provided doesn't exist.")
            ChatLib.chat(`${modPrefix} §${args[1]}Checkpoint ${args[1]} §awith value §6${data.spring.checkpoints[Number(args[1])-1]} §awas successfully removed!`)
            data.spring.checkpoints.splice(Number(args[1])-1,1)
            data.save()
            break;
        case "list":
            let string = `§2Checkpoints:`
            for (let i in data.spring.checkpoints) {
                string += `\n§${Number(i)+1}Checkpoint ${Number(i)+1}§a: §6${data.spring.checkpoints[i]}`
            }
            ChatLib.chat(string)
            break;
        default:
            ChatLib.chat("§cUsage: /auspringcheckpoint <add|remove|list> (checkpoint)")
    }
}).setName("auspringcheckpoint")