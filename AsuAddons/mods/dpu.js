import request from "requestV2/index";
import {
    data,
    modPrefix
} from "../index.js";
import { getrequest } from "../utils.js";
const rarities = JSON.parse(FileLib.read("AsuAddons", "rarities.json"))
const cataLevelArray = [0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340, 35640, 50040, 70040, 97640, 135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640, 1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640, 13259640, 17559640, 23159640, 30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640, 285559640, 360559640, 453559640, 569809640]

function decodeInv(data) {
    let bytearray = java.util.Base64.getDecoder().decode(data);
    let inputstream = new java.io.ByteArrayInputStream(bytearray);
    let nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()                            
    let items = nbt.func_150295_c("i", 10); //NBTTagCompound.getTagList()

    return items
}

function buildOutput(player, items, armor, secrets, pet, cata) {
    var output = new Message("§cName:§b " + player + "\n§6Cata: §a" + cata.toString() + "\n§6Secrets: §c" + secrets + "\n§6Spirit: " + pet[1] + "\n\n§6Items:§r\n")

    for (let i = items.length - 1; i >= 0; i--) {
        output.addTextComponent(new TextComponent(" " + items[i][0] + " ").setHover("show_text", items[i][1]))
    }
    output.addTextComponent("\n\n§6Armor:§r\n")
    for (let i = 0; i < armor.length; i++) {
        output.addTextComponent(new TextComponent(" " + armor[i][0] + " ").setHover("show_text", armor[i][1]))
    }
    output.addTextComponent("\n\n§6Pet: §r" + pet[0])
    output.addTextComponent(new TextComponent("\n§4[Kick from Party]").setClick("run_command", "/party kick " + player))
    output.addTextComponent("        ")
    output.addTextComponent(new TextComponent("§7[Ignore]").setClick("run_command", "/ignore add " + player))

    ChatLib.chat(output)
}

register('Chat', (event) => {
    if (data.dpu.enabled == true) {
        let unformattedMessage = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
        unformattedMessage = unformattedMessage.replace(/ /g, "")

        let name = ""
        for (let i = 0; i < unformattedMessage.indexOf("joinedthedungeongroup"); i++) {
            if (i > unformattedMessage.indexOf(">")) {
                name = name + unformattedMessage[i]
            }
        }

        getrequest("https://api.mojang.com/users/profiles/minecraft/" + name).then(response => {
            let uuid = response["id"];
            getrequest("https://api.hypixel.net/player?key=" + data.apiKey + "&uuid=" + uuid).then(response => {
                let secrets = response["player"]["achievements"]["skyblock_treasure_hunter"]
                if (secrets == undefined) {
                    secrets = "0"
                }
                getrequest("https://api.hypixel.net/skyblock/profiles?key=" + data.apiKey + "&uuid=" + uuid).then(response => {
                    let profiles = response["profiles"]
                    let itemArray = []
                    let armorArray = []
                    let pets = ["§cNone", "§cNo"]
                    let cata = -1
                    profiles.forEach(profile => {
                        if (profile.selected) {
                            if (profile["members"][uuid]["inv_contents"] != null) {
                                // Build Item Array

                                let items = decodeInv(profile["members"][uuid]["inv_contents"]["data"])
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
                                            LoreString = LoreString + "\n " + line
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
                            if (profile["members"][uuid]["inv_armor"] != null) {
                                //Build Armor Array

                                let armor = decodeInv(profile["members"][uuid]["inv_armor"]["data"])
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
                                            LoreString = LoreString + "\n " + line
                                        }

                                        armorArray.push([Name, LoreString])
                                    }
                                }
                            }
                            if (profile["members"][uuid]["pets"] != null) {
                                if (profile["members"][uuid]["pets"].length != 0) {
                                    for (let i = 0; i < profile["members"][uuid]["pets"].length; i++) {
                                        if (profile["members"][uuid]["pets"][i]["type"] == "SPIRIT") {
                                            pets[1] = "§aYes"
                                        }
                                        if (profile["members"][uuid]["pets"][i]["active"] == true) {
                                            let type = profile["members"][uuid]["pets"][i]["type"]
                                            type = type.toLowerCase()
                                            type = type[0].toUpperCase() + type.slice(1, type.length)
                                            type = type.replace(/_/g, " ")
                                            if (pets[0] != "§cNone") {
                                                pets[0] = pets[0] + rarities[profile["members"][uuid]["pets"][i]["tier"]] + type + "§r\n"
                                            } else {
                                                pets[0] = rarities[profile["members"][uuid]["pets"][i]["tier"]] + type + "§r\n"
                                            }
                                        }
                                    }
                                }
                            }
                            for (let i = 0; i < cataLevelArray.length; i++) {
                                let cataXP = Math.floor(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["experience"])
                                if (cataLevelArray[i] <= cataXP) {
                                    cata += 1
                                }
                            }
                        }
                    })
                    buildOutput(name, itemArray, armorArray, secrets, pets, cata)
                })
            })
        });
    }
}).setChatCriteria("joined the dungeon group!").setContains();

register("command", (...args) => {
    const helpMessage = "§6Help\n§a/dpu key <API key>\n§2Set your api key.\n§a/dpu add <item>\n§2Add an Item to check for.\n§a/dpu remove <item>\n§2Remove an item that is being checked for.\n§a/dpu list\n§2List all items the mod currently checks for.\n§a/dpu toggle\n§2Toggle the mod."
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
            ChatLib.chat(helpMessage)
        }
    } else {
        ChatLib.chat(helpMessage)
    }
}).setName("dpu")