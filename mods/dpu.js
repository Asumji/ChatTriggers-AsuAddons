import { data, modPrefix } from "../index.js";
import { getPetLevel, getrequest, getCataLevel, decodeInv, shortenNumber } from "../utils.js";
const rarities = JSON.parse(FileLib.read("AsuAddons/jsonData", "rarities.json"))

function buildOutput(player, items, armor, secrets, pet, cata, isDungeon, attributes, uuid, bank, mp, pb) {
    if (isDungeon) {
        var output = new Message("§cName:§b " + player + "\n§6Cata: §a" + cata.toString() + "\n§6Secrets: §c" + secrets + "\n§6MP: §c" + mp.toString() + "\n§6Bank: " + shortenNumber(bank) + "\n§6Spirit: " + pet[1] + "\n\n§6Items:§r\n")
    } else {
        var output = new Message("§cName:§b " + player + "\n\n§6Items:§r\n")
    }

    for (let i = items.length - 1; i >= 0; i--) {
        output.addTextComponent(new TextComponent(" " + items[i][0] + " ").setHover("show_text", items[i][1]))
    }
    output.addTextComponent("\n\n§6Armor:§r\n")
    for (let i = 0; i < armor.length; i++) {
        output.addTextComponent(new TextComponent(" " + armor[i][0] + " ").setHover("show_text", armor[i][1]))
    }
    if (data.dpu.showEquipment) output.addTextComponent("\n§6Equipment: §6Dominance: §c" + attributes[0] + " §6Lifeline: §c" + attributes[1])
    data.dpu.showEdrag ? output.addTextComponent("\n\n§6Pet: §r" + pet[0] + "§7 / " + pet[2]) : output.addTextComponent("\n\n§6Pet: §r" + pet[0])
    output.addTextComponent(new TextComponent("\n§4[Kick from Party]").setClick("run_command", "/party kick " + player))
    output.addTextComponent("        ")
    output.addTextComponent(new TextComponent("§7[Ignore]").setClick("run_command", "/block add " + player))
    output.addTextComponent("        ")
    output.addTextComponent(new TextComponent("§a[View Inv]").setClick("run_command", "/auvw " + uuid))
    if (isDungeon) {
        output.addTextComponent("        ")
        output.addTextComponent(new TextComponent("§6[PBs]").setHover("show_text", pb.trim()))
    }

    ChatLib.chat(output)
}

register('Chat', (event) => {
    if (data.dpu.enabled == true) {
        let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
        unformattedMessage = unformattedMessage.replace(/ /g, "")
        let isDungeon = true
        if (!unformattedMessage.includes("dungeon")) {
            if (!data.dpu.kuudra) return
            isDungeon = false
        }
        let name = ""
        for (let i = 0; i < unformattedMessage.indexOf("joinedthe"); i++) {
            if (i > unformattedMessage.indexOf(">")) {
                name = name + unformattedMessage[i]
            }
        }
        getrequest("https://api.mojang.com/users/profiles/minecraft/" + name).then(response => {
            let uuid = response["id"];
            let secrets = "0"
            getrequest("http://asumji.duckdns.org/v2/player?uuid="+uuid).then(response => {
                if (isDungeon) {
                    secrets = response["player"]["achievements"]["skyblock_treasure_hunter"]
                    if (secrets == undefined) {
                        secrets = "0"
                    }
                }
                getrequest("http://asumji.duckdns.org/v2/skyblock/profiles?uuid="+uuid).then(response => {
                    let profiles = response["profiles"]
                    let itemArray = []
                    let armorArray = []
                    let pets = ["§cNone", "§cNo", "§cNo Edrag"]
                    let cata = -1
                    let attributes = [0,0]
                    let bank = "Bank API off" 
                    let mp = 0
                    let pb = ""
                    profiles.forEach(profile => {
                        if (profile.selected) {
                            if (profile["members"][uuid]["inventory"]["inv_contents"] != null) {
                                let items = decodeInv(profile["members"][uuid]["inventory"]["inv_contents"]["data"])
                                let length = items.func_74745_c(); //NBTTagList.tagCount()
                                for (let i = 0; i < length; i++) {
                                    let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                                    if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                                        let Name = item.func_74781_a("tag").func_74781_a("display").func_74781_a("Name").toString().replace(/"/g, "") //NBTTagCompound.getTag()
                                        let Lore = item.func_74781_a("tag").func_74781_a("display").func_74781_a("Lore")

                                        let LoreString = Name
                                        let LLength = Lore.func_74745_c()
                                        for (let i = 0; i < LLength; i++) {
                                            let line = Lore.func_150307_f(i) //NBTTagList.getStringTagAt()
                                            LoreString = LoreString + "\n" + line
                                        }

                                        for (let i = 0; i < data.dpu.relevantItems.length; i++) {
                                            if (Name.toLowerCase().includes(data.dpu.relevantItems[i])) {
                                                itemArray.push([Name, LoreString])
                                            }
                                        }
                                    }
                                }
                            } else {
                                itemArray.push(["§cInventory API off!", ""])
                            }
                            if (profile["members"][uuid]["inventory"]["inv_armor"] != null) {
                                let armor = decodeInv(profile["members"][uuid]["inventory"]["inv_armor"]["data"])
                                let length2 = armor.func_74745_c();
                                for (let i = length2; i > -1; i--) {
                                    armorPiece = armor.func_150305_b(i)
                                    if (!armorPiece.func_82582_d()) {
                                        let Name = armorPiece.func_74781_a("tag").func_74781_a("display").func_74781_a("Name").toString().replace(/"/g, "")
                                        let Lore = armorPiece.func_74781_a("tag").func_74781_a("display").func_74781_a("Lore")

                                        let LoreString = Name
                                        let LLength = Lore.func_74745_c()
                                        for (let i = 0; i < LLength; i++) {
                                            let line = Lore.func_150307_f(i) //NBTTagList.getStringTagAt()
                                            LoreString = LoreString + "\n" + line
                                        }

                                        armorArray.push([Name, LoreString])
                                    }
                                }
                            }
                            if (profile["members"][uuid]["inventory"]["equipment_contents"] != null) {
                                let equipment = decodeInv(profile["members"][uuid]["inventory"]["equipment_contents"]["data"])
                                let length = equipment.func_74745_c();
                                for (let i = length; i > -1; i--) {
                                    equipmentPiece = equipment.func_150305_b(i)
                                    if (!equipmentPiece.func_82582_d()) {
                                        equipmentPiece = equipmentPiece.func_74781_a("tag").func_74781_a("ExtraAttributes").func_74781_a("attributes")
                                        if (equipmentPiece != null) {
                                            if (equipmentPiece.func_74781_a("dominance") != null) {
                                                attributes[0] += Number(equipmentPiece.func_74781_a("dominance"))
                                            }
                                            if (equipmentPiece.func_74781_a("lifeline") != null) {
                                                attributes[1] += Number(equipmentPiece.func_74781_a("lifeline"))
                                            }
                                        }
                                    }
                                }
                            }
                            if (profile["members"][uuid]["pets_data"]["pets"] != null) {
                                if (profile["members"][uuid]["pets_data"]["pets"].length != 0) {
                                    for (let i = 0; i < profile["members"][uuid]["pets_data"]["pets"].length; i++) {
                                        let type = profile["members"][uuid]["pets_data"]["pets"][i]["type"]
                                        let level = 0
                                        if (profile["members"][uuid]["pets_data"]["pets"][i]["type"] == "GOLDEN_DRAGON") {
                                            level = getPetLevel(profile["members"][uuid]["pets_data"]["pets"][i]["exp"],profile["members"][uuid]["pets_data"]["pets"][i]["tier"],200)
                                        } else {
                                            level = getPetLevel(profile["members"][uuid]["pets_data"]["pets"][i]["exp"],profile["members"][uuid]["pets_data"]["pets"][i]["tier"],100)
                                        }
                                        type = type.toLowerCase()
                                        type = type[0].toUpperCase() + type.slice(1, type.length)
                                        type = type.replace(/_/g, " ")

                                        if (type == "Spirit") {
                                            pets[1] = "§aYes"
                                        }
                                        if (type == "Ender dragon") {
                                            pets[2] = "§7[Lvl " + level.toString() + "] " + rarities[profile["members"][uuid]["pets_data"]["pets"][i]["tier"]] + type + "§r"
                                            if (profile["members"][uuid]["pets_data"]["pets"][i]["heldItem"] == "PET_ITEM_TIER_BOOST") {
                                                pets[2] = pets[2].replace("§5", "§6")
                                                pets[2] += " §7(TB)§r"
                                            }
                                        }
                                        if (profile["members"][uuid]["pets_data"]["pets"][i]["active"] == true) {
                                            pets[0] = "§7[Lvl " + level.toString() + "] " + rarities[profile["members"][uuid]["pets_data"]["pets"][i]["tier"]] + type + "§r"
                                        }
                                    }
                                }
                            }
                            if (isDungeon) {
                                cata = getCataLevel(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["experience"])
                                let dungeonType = profile["members"][uuid]["dungeons"]["dungeon_types"]
                                if (dungeonType["catacombs"]["fastest_time_s_plus"]) {
                                    for (let floor in dungeonType["catacombs"]["fastest_time_s_plus"]) {
                                        let pbDate = new Date(dungeonType["catacombs"]["fastest_time_s_plus"][floor]);
                                        if (floor != "best") pb += `§aF${floor}: §6 ${pbDate.getMinutes()}:${pbDate.getSeconds().toString().length == 1 ? "0"+pbDate.getSeconds() : pbDate.getSeconds()}\n`
                                    }
                                }
                                if (dungeonType["master_catacombs"]["fastest_time_s_plus"]) {
                                    for (let floor in dungeonType["master_catacombs"]["fastest_time_s_plus"]) {
                                        let pbDate = new Date(dungeonType["master_catacombs"]["fastest_time_s_plus"][floor]);
                                        if (floor != "best") pb += `§cM${floor}: §6 ${pbDate.getMinutes()}:${pbDate.getSeconds().toString().length == 1 ? "0"+pbDate.getSeconds() : pbDate.getSeconds()}\n`
                                    }
                                }
                            }
                            if (profile["banking"] && profile["banking"]["balance"]) {
                                bank = profile["banking"]["balance"]
                            }
                            mp = profile["members"][uuid]["accessory_bag_storage"]["highest_magical_power"]
                        }
                    })
                    buildOutput(name, itemArray, armorArray, secrets, pets, cata, isDungeon, attributes, uuid, bank, mp, pb)
                })
            })
        });
    }
}).setChatCriteria(/joined the group!|joined the dungeon group!/).setContains();

register("command", (...args) => {
    if (args) {
        if (args[0] == "add") {
            if (args[1]) {
                if (!data.dpu.relevantItems.includes(args.slice(1).join(" ").toLowerCase())) {
                    data.dpu.relevantItems.push(args.slice(1).join(" ").toLowerCase())
                    data.save()
                    ChatLib.chat("§aThe mod now checks for " + args.slice(1).join(" ") + ".")
                } else {
                    ChatLib.chat("§cItem is already being checked.")
                }
            } else {
                ChatLib.chat("§cDidn't provide an item.")
            }
        } else if (args[0] == "remove") {
            if (args[1]) {
                if (data.dpu.relevantItems.includes(args.slice(1).join(" ").toLowerCase())) {
                    data.dpu.relevantItems.splice(data.dpu.relevantItems.indexOf(args.slice(1).join(" ").toLowerCase()), 1)
                    data.save()
                    ChatLib.chat("§aThe mod no longer checks for " + args.slice(1).join(" ") + ".")
                } else {
                    ChatLib.chat("§cItem isn't being checked.")
                }
            } else {
                ChatLib.chat("§cDidn't provide an item.")
            }
        } else if (args[0] == "list") {
            string = "§2Mod currently checks for:\n"
            for (let i = 0; i < data.dpu.relevantItems.length; i++) {
                if (i != data.dpu.relevantItems.length - 1) {
                    string = string + "§a" + data.dpu.relevantItems[i] + ", "
                } else {
                    string = string + "§a" + data.dpu.relevantItems[i]
                }
            }
            ChatLib.chat(string)
        } else if (args[0] == "toggle") {
            data.dpu.enabled ? data.dpu.enabled = false : data.dpu.enabled = true
            data.save()
            data.dpu.enabled ? ChatLib.chat(modPrefix + " Enabled Dungeon Party Utils") : ChatLib.chat(modPrefix + " Disabled Dungeon Party Utils")
        } else {
            ChatLib.chat("§cInvalid command. Run /au help for help.")
        }
    } else {
        ChatLib.chat("§cInvalid command. Run /au help for help.")
    }
}).setName("dpu")