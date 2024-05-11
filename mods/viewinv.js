import { modPrefix } from "../index";
import { decodeInv, getrequest } from "../utils"

//Adapted from https://www.chattriggers.com/modules/v/SBInvSee

const ItemStack = Java.type("net.minecraft.item.ItemStack");
const InventoryBasic = Java.type("net.minecraft.inventory.InventoryBasic");
const GuiChest = Java.type("net.minecraft.client.gui.inventory.GuiChest");

let lastInv = null
let invToOpen = null
let lastRun = 0

register("command", (...args) => {
    if (Date.now()-lastRun <= 1000) return ChatLib.chat(modPrefix+" §cDon't spam the command.")
    lastRun = Date.now()
    if (!args) return ChatLib.chat(modPrefix+" §cNo UUID Given. Usage: /auvw <uuid>")
    getrequest("http://asumji.duckdns.org/v2/skyblock/profiles?uuid="+args[0]).then(res => {
        if (res.success == false) return ChatLib.chat(modPrefix+" §c"+res.cause+".")
        if (res.profiles == null) return ChatLib.chat(modPrefix+" §cThat player does not have any profiles.")
        res.profiles.forEach(profile => {
            if (!profile.selected) return
            if(profile["members"][args[0]]["inventory"]["inv_contents"] == null) {
                ChatLib.chat(modPrefix + "&c" + username + " has inventory API disabled.")
            } else {
                let items = decodeInv(profile["members"][args[0]]["inventory"]["inv_contents"]["data"])
                let length = items.func_74745_c(); //NBTTagList.tagCount()

                let inv = new InventoryBasic("Inventory", true, 36);

                for(let i = 0; i < length; i++){                                    
                    let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                    if(!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                        let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.air
                        itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                        
                        let slot = i < 9 ? i + 27 : i - 9 //Move hotbar slots to bottom
                        inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                    }
                }

                let guiChest = new GuiChest(Player.getPlayer().field_71071_by, inv); //EntityPlayer.inventory

                lastInv = guiChest;
                invToOpen = guiChest;
            }
        });
    })
}).setName("auviewinv").setAliases(["auvw","auinv"])

register("tick", () => {
    if(invToOpen !== null) {
        Client.getMinecraft().func_147108_a(invToOpen); //Minecraft.displayGuiScreen()
        invToOpen = null;
    }
});

register("guiMouseClick", (x, y, button, gui, event) => {
    if(Client.getMinecraft().field_71462_r === lastInv && lastInv !== null) {
        cancel(event)
    }
});