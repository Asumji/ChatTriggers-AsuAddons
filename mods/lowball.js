import { modPrefix, data } from "../index.js";
import { expandNumber, isInArrayIdx, shortenNumber } from "../utils.js";

register("command", (...args) => {
    if (!args[0]) return ChatLib.chat("§c/lowball <add|remove|setsold|list>")
    switch (args[0].toLowerCase()) {
        case "add":
            if (!args[1] || !args[2]) return ChatLib.chat("§cAt least one argument is missing. /lowball add <item> <buyprice>")
            if (typeof isInArrayIdx(args[1],data.lowball.items,0) != "boolean") return ChatLib.chat("§cThat item already exists try adding a number to the end.")
            if (!expandNumber(args[2])) return ChatLib.chat("§cBuy price is not a number.")
            data.lowball.items.push([args[1],args[2],"§cNot sold yet."])
            data.save()
            ChatLib.chat(modPrefix + " §aAdded " + args[1] + " to the lowball list bought at a price of " + args[2] + ".")
            break;
        case "setsold":
            if (!args[1] || !args[2]) return ChatLib.chat("§cAt least one argument is missing. /lowball setsold <item> <sellprice>")
            if (typeof isInArrayIdx(args[1],data.lowball.items,0) == "boolean") return ChatLib.chat("§cThat item does not exist.")
            if (!expandNumber(args[2])) return ChatLib.chat("§cSell price is not a number.")
            let itemIndex = isInArrayIdx(args[1],data.lowball.items,0)
            data.lowball.items[itemIndex][2] = args[2]
            data.lowball.items[itemIndex][3] = shortenNumber(expandNumber(args[2]) - expandNumber(data.lowball.items[itemIndex][1]))
            data.save()
            ChatLib.chat(modPrefix + " §aSet the sell price of " + args[1] + " to " + args[2] + ".")
            break;
        case "remove":
            if (!args[1]) return ChatLib.chat("§cThe item is missing. /lowball remove <item>")
            if (typeof isInArrayIdx(args[1],data.lowball.items,0) == "boolean") return ChatLib.chat("§cThat item does not exist.")
            data.lowball.items.splice(isInArrayIdx(args[1],data.lowball.items,0),1)
            data.save()
            ChatLib.chat(modPrefix + " §aRemoved " + args[1] + " from the item list.")
            break;
        case "list":
            let output = "§c§l-- Lowballed Items --\n"
            data.lowball.items.forEach((item,i) => {
                output += `§e${i+1}. §a${item[0]}\n  §eBought at: §a${item[1]}\n  §eSold at: §a${item[2]}\n  §eProfit: §a${item[3] == undefined ? "§cNot sold yet." : item[3]}\n`
            });
            ChatLib.chat(output.trim())
            break;
        default:
            ChatLib.chat("§cUnknown subcommand. /lowball <add|remove|setsold|list>")
    }
}).setName("lowball")