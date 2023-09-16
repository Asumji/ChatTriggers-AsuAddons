import { data, modPrefix } from "../index.js"
import { drawWaypoint, calculateDistanceQuick } from "../utils.js"
const waypoints = JSON.parse(FileLib.read("AsuAddons/jsonData","termCoords.json"))

let renderTrigger = undefined

let currentPhase = 0
let termsDone = []
let players = {}

register("Chat", () => {

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

register("Chat", (name,type,current,goal) => {
    let player = World.getPlayerByName(name)
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
        if (current == goal) {
            currentPhase++
        }
    } else if (type == "lever") {
        let closest = [0,999999999999]
        waypoints.forEach(waypoint => {
            if (waypoint.type == "lever") {
                if (closest[1] > calculateDistanceQuick([waypoint.location[0],waypoint.location[1],waypoint.location[2]],[player.getX(), player.getY(), player.getZ()])) {
                    closest = [waypoint.id,calculateDistanceQuick([waypoint.location[0],waypoint.location[1],waypoint.location[2]],[player.getX(), player.getY(), player.getZ()])]
                }
            }
        })
        termsDone.push(closest[0])
        if (current == goal) {
            currentPhase++
        }
    } else if (type == "terminal") {
        let closest = [0,999999999999]
        waypoints.forEach(waypoint => {
            if (waypoint.type == "terminal") {
                if (closest[1] > calculateDistanceQuick([waypoint.location[0],waypoint.location[1],waypoint.location[2]],[player.getX(), player.getY(), player.getZ()]) && !termsDone.includes(waypoint.id)) {
                    closest = [waypoint.id,calculateDistanceQuick([waypoint.location[0],waypoint.location[1],waypoint.location[2]],[player.getX(), player.getY(), player.getZ()])]
                }
            }
        })
        termsDone.push(closest[0])
        if (current == goal) {
            currentPhase++
        }
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