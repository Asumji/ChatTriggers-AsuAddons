import { data } from "../index.js"
import Settings from "../gui.js";

register("command", (...args) => {
    if (args[0] == "help") {
        ChatLib.chat(
`§2All Commands:

§6§lMain
    §a/au §eOpens the Config GUI.
    §a/au help §eShows this message.

§6§lCarryHelper
    &a/register <ign> <runs> §eRegisters a new client with the amount of runs they ordered.
    §a/edit <ign> <runs> §eEdits the amount of ordered runs.
    §a/clear [ign] §eRemoves a specific player or all off the carry list.
    §a/add [ign] §eAdds 1 run to a specific player or all players. (Runs will automatically be added upon completion but for safety this exists)
    §a/sub [ign] §eRemoves 1 run from a specific player or all players.

§6§lFragBot
    §a/frag §eTo toggle the mod on the bots account.
§2In party chat:
    §a#togglemode §eToggles between the bot leaving or staying in the party when joining a dungeon.
    §a#toggleperms §eToggles between wether only you or everyone can execute commands.
    §a#addplayer <ign> §eAdds a new player to the players that can invite the bot.
    §a#removeplayer <ign> §eRemoves a player from the player that can invite the bot.
    §a#settings §eDisplay an overview of the above mentioned settings.

§6§lDungeon Party Utils
    §a/dpu add <item> §eAdds an item to check for in a players inventory
    §a/dpu remove <item> §eRemoves and item to check for
    §a/dpu list §eLists all items that are being checked for
    §a/dpu toggle §eToggles the mod

§6§lReplaceGhost
    §a/rghost add <ign> §eAdds a player to check for.
    §a/rghost remove <ign> §eRemoves a player that is being checked for.
    §a/rghost list §eLists all players which are being checked for.
    §a/rghost set <msg> §eSets the msg to replace "and became a ghost" with.
    §a/rghost toggle §eToggles the mod

§6§lCustomCommands
    §a/addcommand <new command> <command to run> §eAdds a command.
    §a/removecommand <command> §eRemoves a command.

§6§lAlias
    §a/addalias <alias> <ign> §eAdds an alias.
    §a/removealias <alias> §e Removes an alias.
    
§6§lTrophyFish
    §a/trophy §eToggles the mod.
    
§6§lBridge
    §a/bridgeset <IGN> §eSets the bot IGN.
    §a/trophy <message> §eSets the bot message. (Has to contain "<1>" (sender name) and "<2>" (message))
    
§6§lReparty
    §a/autojoin §eToggles automatically joining if you get repartied.
    §a/autojoin cd <s> §eSets the period for how long the mod will be looking for a new invite in seconds.
    §a/rp §eThe reparty command.
    
§6§lPartyCommands
    §a/partycommands add <ign> §eAdds a player to the PartyCommands whitelist.
    §a/partycommands remove <ign> §eRemoves a player from the PartyCommands whitelist
    §a/partycommands list §eLists all players in the PartyCommands whitelist.`
            )
    } else  {
        Settings.openGUI()
    }
}).setName("au");

register("guiClosed", (...gui) => {
    if(gui.toString().split("@")[0] == "gg.essential.vigilance.gui.SettingsGui") {
        data.save()
        if (!data.bridge.bridgeMessage.includes("<1>") || !data.bridge.bridgeMessage.includes("<2>")) {
            Settings.bridgeMsg = "&2Bridge > &6<1>: &r<2>"
            data.bridge.bridgeMessage = "&2Bridge > &6<1>: &r<2>"
            data.save()
        }
    }
})