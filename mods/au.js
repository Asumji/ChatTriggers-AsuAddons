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
    §a/movecarry §eMove the GUI.        
    §a/register <ign> <runs> §eRegisters a new client with the amount of runs they ordered.
    §a/edit <ign> <runs> §eEdits the amount of ordered runs.
    §a/clear [ign] §eRemoves a specific player or all off the carry list.
    §a/add [ign] §eAdds 1 run to a specific player or all players. (Runs will automatically be added upon completion but for safety this exists)
    §a/sub [ign] §eRemoves 1 run from a specific player or all players.

§6§lFragBot
§2In party chat:
    §a#togglemode §eToggles between the bot leaving or staying in the party when joining a dungeon.
    §a#toggleperms §eToggles between wether only you or everyone can execute commands.
    §a#addplayer <ign> §eAdds a new player to the players that can invite the bot.
    §a#removeplayer <ign> §eRemoves a player from the player that can invite the bot.
    §a#settings §eDisplay an overview of the above mentioned settings.

§6§lTrophyFish
    §a/movetrophy §eMoves the GUI.

§6§lCustomCommands
    §a/addcommand <new command> <command to run> §eAdds a command.
    §a/removecommand <command> §eRemoves a command.

§6§lAlias
    §a/addalias <alias> <ign> §eAdds an alias.
    §a/removealias <alias> §e Removes an alias.`
            )
    } else {
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