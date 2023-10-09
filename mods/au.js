import { data, modPrefix } from "../index.js"
import Settings from "../gui.js";
import { sendWebhookMessage } from "../utils.js";

//au report should only ever be used once in a session.
used = false

register("command", (...args) => {
    if (args[0] == "help") {
        ChatLib.chat(
`§2All Commands:

§6§lMisc
    §a/au §eOpens the Config GUI.
    §a/au help §eShows this message.
    §a/attributevalue §eShows lowest BIN of the attributes on the item you are holding.

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
    §a/listcommand <command> §eLists all currently set up commands.

§6§lAlias
    §a/addalias <alias> <ign> §eAdds an alias.
    §a/removealias <alias> §e Removes an alias.`
            )
    } else if (args[0] == "report" && used != true) {
        //I mean I'll assume no one's gonna spam this webhook but do I care? not really. Please don't tho <3
        sendWebhookMessage({username:"AsuAddons API Reports",content:"Someone has reported an api outage.",embeds:[{
            title:"New API Outage Report",
            color:0xFF0000,
            description:Player.name + " has reported that the API is down.\n\n" + String(new Date(Date.now())).split(" GMT")[0],
            footer:{text:"This message was sent through the /au report command."},
            thumbnail:{url:"https://mc-heads.net/player/"+Player.name}
        }]},"https://discord.com/api/webhooks/1151510044827983924/epsDb2J6l9LrLQLSrJnXVKgAeUGSdXoisavTt9cjIUjrJPvYFLw4HwkquYtenKmskbEv")
        used = false
        ChatLib.chat(modPrefix + " §aYour report has been sent.")
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