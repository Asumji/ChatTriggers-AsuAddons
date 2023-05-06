import { data, modPrefix } from "../index.js"
import request from "requestV2/index";
const fishnames = JSON.parse(FileLib.read("AsuAddons", "trophyfish.json"))
const display = new Display();

const getrequest = function(url) {
    return request({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (ChatTriggers)'
        },
        json: true
    });
}

function getCurrentProfile(player) {
    let profiles = player["profiles"]
    let curProfile = [0, "None"]
    profiles.forEach(profile => {
        if (profile["last_save"] > curProfile[0]) {
            curProfile = [profile["last_save"], profile["cute_name"]]
        }
    })
    return curProfile[1]
}

function render() {
    if (data.trophy.enabled) {
        let trophyString = ""
        for (fish in data.trophy.collected) {
            trophyString += "\n" + "§6§l" + fish.toString()[0].toUpperCase() + fish.split("").splice(1,fish.length).join("").replace(/_/g, " ") + "§r [§c" + data.trophy.collected[fish][0] + " §r| " + "§7" + data.trophy.collected[fish][1] + " §r| " + "§6" + data.trophy.collected[fish][2] + " §r| " + "§b" + data.trophy.collected[fish][3] + "§r]"
        }

        display.clearLines()
        display.setLine(0, trophyString);
        display.setRenderLoc(0,50)
    }
}

if (data.trophy.firstUse) {
    data.trophy.firstUse = false

    getrequest("https://api.mojang.com/users/profiles/minecraft/" + Player.name).then(response => {
        let uuid = response["id"];
        getrequest("https://api.hypixel.net/skyblock/profiles?key=" + data.apiKey + "&uuid=" + uuid).then(response => {
            let profiles = response["profiles"]
            let curProfile = getCurrentProfile(response)
            profiles.forEach(profile => {
                if (profile["cute_name"] == curProfile) {
                    console.log(profile["members"][uuid]["trophy_fish"]["total_caught"])
                    for (fish in data.trophy.collected) {
                        console.log(fish)
                        if (profile["members"][uuid]["trophy_fish"][fish + "_bronze"] != null) {
                            data.trophy.collected[fish][0] = profile["members"][uuid]["trophy_fish"][fish + "_bronze"]
                            console.log(profile["members"][uuid]["trophy_fish"][fish + "_bronze"])
                        }
                        if (profile["members"][uuid]["trophy_fish"][fish + "_silver"] != null) {
                            data.trophy.collected[fish][1] = profile["members"][uuid]["trophy_fish"][fish + "_silver"]
                        }
                        if (profile["members"][uuid]["trophy_fish"][fish + "_gold"] != null) {
                            data.trophy.collected[fish][2] = profile["members"][uuid]["trophy_fish"][fish + "_gold"]
                        }
                        if (profile["members"][uuid]["trophy_fish"][fish + "_diamond"] != null) {
                            data.trophy.collected[fish][3] = profile["members"][uuid]["trophy_fish"][fish + "_diamond"]
                        }
                        data.save()
                        render()
                    }
                }
            })
        })
    })
}

register("chat", (event) => {
    let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
    unformattedMessage = unformattedMessage.replace("TROPHY FISH! You caught a ", "")
    unformattedMessage = unformattedMessage.replace("TROPHY FISH! You caught an ", "")
    const fishName = unformattedMessage.split("").splice(0, unformattedMessage.lastIndexOf(" ")).join("")
    const fishRarity = unformattedMessage.split("").splice(unformattedMessage.lastIndexOf(" ")+1, unformattedMessage.length).join("")

    if (fishRarity == "BRONZE.") {
        data.trophy.collected[fishnames[fishName]][0] += 1
    }
    if (fishRarity == "SILVER.") {
        data.trophy.collected[fishnames[fishName]][1] += 1
    }
    if (fishRarity == "GOLD.") {
        data.trophy.collected[fishnames[fishName]][2] += 1
    }
    if (fishRarity == "DIAMOND.") {
        data.trophy.collected[fishnames[fishName]][3] += 1
    }
    data.save()
    render()
}).setCriteria("&6&lTROPHY FISH!").setContains()

register("command", () => {
    data.trophy.enabled ? data.trophy.enabled = false : data.trophy.enabled = true
    data.save()
    data.trophy.enabled ? ChatLib.chat(modPrefix + " Enabled the Trophy Fishing mod") : ChatLib.chat(modPrefix + " Disabled the Trophy Fishing mod")
  }).setName("trophy")