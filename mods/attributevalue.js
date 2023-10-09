import { modPrefix } from "../index.js"
import { getrequest } from "../utils.js";

register("command", () => {
    if (Player.getHeldItem() == null) {
        ChatLib.chat(modPrefix + " §cYou are not holding an item.")
        return
    }

    const itemExtraAttributes = Player.getHeldItem().getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes");
    const attributes = itemExtraAttributes.getCompoundTag("attributes");

    let itemID = itemExtraAttributes.getString("id").toUpperCase()
    if (/HELMET|CHESTPLATE|LEGGINGS|BOOTS/.test(itemID)) {
        itemID = Player.getHeldItem().getNBT().getString("id").toUpperCase().replace("MINECRAFT:LEATHER","GENERIC_KUUDRA")
    }

    if (!attributes.hasNoTags()) {
        getrequest("https://moulberry.codes/lowestbin.json").then(lbinData => {
            let attributeArray = []
            attributes.getTagMap().forEach((attribute, attribute_level) => 
                attributeArray.push([attribute.toUpperCase(), attribute_level])
            )

            let output = "§1=====================================\n"
            attributeArray.forEach((attribute) => {
                const value = lbinData[`${itemID}+ATTRIBUTE_${attribute[0]};${attribute[1]}`].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                output += `${modPrefix} §aLowest BIN for §c${attribute[0]} ${attribute[1]} §aon §c${itemID.replace("GENERIC_KUUDRA_","")}§a:\n§6${value} coins\n`
            })
            output = output.replace(/\n$/, "\n§1=====================================")
            ChatLib.chat(output)
        })
    } else {
        ChatLib.chat(modPrefix + " §cItem doesn't have attributes");
    }
}).setName("attributevalue").setAliases(["attributev","attv","avalue"])