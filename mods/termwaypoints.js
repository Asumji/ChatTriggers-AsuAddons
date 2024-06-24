import { data, modPrefix } from "../index.js"
import { drawWaypoint, calculateDistanceQuick, showAUTitle, getClasses } from "../utils.js"
const waypoints = JSON.parse(FileLib.read("AsuAddons/jsonData","termCoords.json"))

let renderTrigger = undefined
let currentPhase = 0
let i4Done = false
let termsDone = []
let players = {}

register("Chat", () => {
    i4Done = false
    currentPhase = 0
    termsDone = []
    players = {}

    if (data.dpu.termwaypoints) {
        renderTrigger = register("renderWorld", () => {
            waypoints.forEach(waypoint => {
                if (waypoint.phase == currentPhase && !termsDone.includes(waypoint.id)) {
                    drawWaypoint(waypoint.location[0],waypoint.location[1],waypoint.location[2],1,1,0.55,0.09,0.09,waypoint.type,0x0ac324,true,data.dpu.termbeacon,true) 
                }
            })
        })
    }
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.").setStart()

register("Chat", () => {
    if (renderTrigger != undefined) renderTrigger.unregister()
}).setCriteria("The Core entrance is opening!").setStart()

register("Chat", (name,type,current,goal) => {
    let player = World.getPlayerByName(name)
    let classes = getClasses()

    if (data.dpu.i4) {
        if (classes["berserk"] != Player.name) {
            if (classes["berserk"] != null && player == null && type == "device") {
                ChatLib.chat(modPrefix + " §a§lBers finished i4!")
                i4Done = true
                termsDone.push(23)
            }
        } else if (name == Player.name && type == "device" && currentPhase == 0) {
            ChatLib.chat(modPrefix + " §a§lYou finished device!")
            showAUTitle(modPrefix + " §a§lYou finished device!", 1000, true)
            if (data.dpu.compMsg != "") ChatLib.command("pc " + data.dpu.compMsg)
            i4Done = true
            termsDone.push(23)
        }
    }

    if (current == goal) {
        currentPhase += 1
        if (currentPhase == 3 && i4Done) {
            ChatLib.chat(modPrefix + " §a§l4th Device is done! (i4)")
            showAUTitle(modPrefix + " §a§l4th Device is done! (i4)", 1000, true)
            if (data.dpu.i4Msg != "") ChatLib.command("pc " + data.dpu.i4Msg)
        }
    }

    if (player == undefined) return

    if (!players[name]) {
        players[name] = {
            device: 0,
            terminal: 0,
            lever: 0
        }
    }
    players[name][type]++

    if (type == "device") {
        waypoints.forEach(waypoint => {
            if (waypoint.phase == currentPhase && waypoint.type == "device") {
                termsDone.push(waypoint.id)
            }
        })
    } else if (type == "lever" || type == "terminal") {
        let closest = [0,999999999999]
        waypoints.forEach(waypoint => {
            if (waypoint.type == type) {
                if (closest[1] > calculateDistanceQuick([waypoint.location[0],waypoint.location[1],waypoint.location[2]],[player.getX(), player.getY(), player.getZ()])) {
                    closest = [waypoint.id,calculateDistanceQuick([waypoint.location[0],waypoint.location[1],waypoint.location[2]],[player.getX(), player.getY(), player.getZ()])]
                }
            }
        })
        termsDone.push(closest[0])
    }

    if (currentPhase > 3) {
        if (renderTrigger != undefined) renderTrigger.unregister()

        if (data.dpu.termsummary) {
            let playerString = ""
            for (let player in players) {
                playerString += `${modPrefix} §b${player}: §aTerms: §c${players[player].terminal}, §aDevices: §c${players[player].device}, §aLevers: §c${players[player].lever}\n`
            }
            playerString = playerString.replace(/\n$/, "")

            ChatLib.chat(playerString)
        }
    }
}).setCriteria(/(.*) (?:activated|completed) a (lever|terminal|device)! \((\d)\/(\d)\)/).setStart()