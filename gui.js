import { data } from "./index.js";
import { @Vigilant, @ButtonProperty, @SliderProperty, @SwitchProperty, @ParagraphProperty, @TextProperty } from 'Vigilance';

@Vigilant("AsuAddons", "AsuAddons Settings")
class Settings {
    @SwitchProperty({
        name: "Enable FragBot",
        description: "Toggle the mod.",
        category: "FragBot"
    })
    fragEnabled = data.frag.enabled;

    @ParagraphProperty({
        name: "Whitelist",
        description: "Whitelisted players for the fragbot. Seperate with \",\" ex. player1,player2",
        category: "FragBot"
    })
    fragNames = data.frag.names.length > 1 ? data.frag.names.join(",") : "";

    @TextProperty({
        name: "Bot",
        description: "The IGN of your current fragbot account.",
        category: "FragBot"
    })
    fragBot = data.frag.bot;

    @TextProperty({
        name: "Owner",
        description: "The IGN of your main account.",
        category: "FragBot"
    })
    fragOwner = data.frag.owner;

    @SwitchProperty({
        name: "Enable DPU",
        description: "Toggle the mod.",
        category: "DungeonPartyUtils"
    })
    dpuEnabled = data.dpu.enabled;

    @ParagraphProperty({
        name: "Relevant Items",
        description: "List of all items the mod checks for. Seperate with \",\" ex. item1,item2",
        category: "DungeonPartyUtils"
    })
    dpuItems = data.dpu.relevantItems.length > 1 ? data.dpu.relevantItems.join(",") : "";

    @SwitchProperty({
        name: "Enable ReplaceGhost",
        description: "Toggle the mod.",
        category: "ReplaceGhost"
    })
    rghostEnabled = data.rghost.enabled;

    @ParagraphProperty({
        name: "Ghostnames",
        description: "List of all players the mod replaces for. Seperate with \",\" ex. player1,player2",
        category: "ReplaceGhost"
    })
    rghostNames = data.rghost.names.length > 1 ? data.rghost.names.join(",") : "";

    @TextProperty({
        name: "Message",
        description: "The message to replace \"and became a ghost\" with.",
        category: "ReplaceGhost"
    })
    rghostMsg = data.rghost.replace;

    @SwitchProperty({
        name: "Enable TrophyFish",
        description: "Toggle the mod.",
        category: "TrophyFish"
    })
    trophyEnabled = data.trophy.enabled;

    @TextProperty({
        name: "Bridge Bot",
        description: "The name of the bridge bot.",
        category: "Bridge"
    })
    bridgeBot = data.bridge.botIGN;

    @TextProperty({
        name: "Bridge Formatting",
        description: 'Sets the bot message. (Has to contain "<1>" (sender name) and "<2>" (message))',
        category: "Bridge"
    })
    bridgeMsg = data.bridge.bridgeMessage;

    @ButtonProperty({
        name: "Preview Bridge Message",
        description: "Shows you a preview of your Bridge message.",
        category: "Bridge",
        placeholder: "Preview"
    })
    bridgePreview() {
        if (this.bridgeMsg.includes("<1>") && this.bridgeMsg.includes("<2>")) {
            this.setCategoryDescription("Bridge", "Simple Bridge bot formatting since I didn't like the other bridge mods.\n\n§aMessage Preview: " + this.bridgeMsg.replace("<1>","Player").replace("<2>","This is a test message."))
            this.openGUI()
        } else {
            this.setCategoryDescription("Bridge", "Simple Bridge bot formatting since I didn't like the other bridge mods.\n\n§cMessage Preview only available if <1> and <2> are present in the Bridge Message.")
            this.openGUI()
        }
    }

    @SwitchProperty({
        name: "Enable AutoJoin",
        description: "Toggles automatically joining if you get repartied.",
        category: "Reparty"
    })
    autojoinEnabled = data.rp.autojoin;

    @SliderProperty({
        name: "Cooldown",
        description: "Sets the period for how long the mod will be looking for a new invite in seconds.",
        category: "Reparty",
        min:1,
        max:60
    })
    autojoinCD = data.rp.cooldown / 1000;

    @SwitchProperty({
        name: "MSG",
        description: "Allow whitelisted players to also execute commands through /msg.",
        category: "PartyCommands"
    })
    partycmdMsgEnabled = data.partycmd.msgEnabled;

    @ParagraphProperty({
        name: "Allowed Players",
        description: "List of all players the mod allows to execute party commands for. Seperate with \",\" ex. player1,player2",
        category: "PartyCommands"
    })
    partycmdWhitelist = data.partycmd.whitelist.length > 1 ? data.partycmd.whitelist.join(",") : "";

    @ParagraphProperty({
        name: "Command Blacklist",
        description: "List of all /p commands that won't be executed. Seperate with \",\" and include \"p\" ex. p command1,p command2",
        category: "PartyCommands"
    })
    partycmdBlacklist = data.partycmd.blacklist.length > 1 ? data.partycmd.blacklist.join(",") : "";


    constructor() {
        this.initialize(this);
        this.registerListener("Enable FragBot", newValue => {
            data.frag.enabled = newValue
        });
        this.registerListener("Whitelist", newValue => {
            if (newValue.includes(",")) {
                data.frag.names = newValue.toLowerCase().split(",")
            } else {
                data.frag.names = [newValue.toLowerCase()]
            }
        });
        this.registerListener("Bot", newValue => {
            data.frag.bot = newValue.toLowerCase()
        });
        this.registerListener("Owner", newValue => {
            data.frag.owner = newValue.toLowerCase()
        });
        this.registerListener("Enable DPU", newValue => {
            data.dpu.enabled = newValue
        });
        this.registerListener("Relevant Items", newValue => {
            if (newValue.includes(",")) {
                data.dpu.relevantItems = newValue.toLowerCase().split(",")
            } else {
                data.dpu.relevantItems = [newValue.toLowerCase()]
            }
        });
        this.registerListener("Enable ReplaceGhost", newValue => {
            data.rghost.enabled = newValue
        });
        this.registerListener("Ghostnames", newValue => {
            if (newValue.includes(",")) {
                data.rghost.names = newValue.toLowerCase().split(",")
            } else {
                data.rghost.names = [newValue.toLowerCase()]
            }
        });
        this.registerListener("Message", newValue => {
            data.rghost.replace = newValue
        });
        this.registerListener("Enable TrophyFish", newValue => {
            data.trophy.enabled = newValue
        });
        this.registerListener("Bridge Bot", newValue => {
            data.bridge.bridgeBot = newValue
        });
        this.registerListener("Bridge Formatting", newValue => {
            data.bridge.bridgeMessage = newValue
        });
        this.registerListener("Enable AutoJoin", newValue => {
            data.rp.autojoin = newValue
        });
        this.registerListener("Cooldown", newValue => {
            data.rp.cooldown = newValue * 1000
        });
        this.registerListener("Allowed Players", newValue => {
            if (newValue.includes(",")) {
                data.partycmd.whitelist = newValue.toLowerCase().split(",")
            } else {
                data.partycmd.whitelist = [newValue.toLowerCase()]
            }
        });
        this.registerListener("Command Blacklist", newValue => {
            if (newValue.includes(",")) {
                data.partycmd.blacklist = newValue.toLowerCase().split(",")
            } else {
                data.partycmd.blacklist = [newValue.toLowerCase()]
            }
        });
        this.registerListener("MSG", newValue => {
            data.partycmd.msgEnabled = newValue
        });
        this.setCategoryDescription("TrophyFish", "Tracks all the Trophy Fish you've fished up so far. Since I could only find mods that track based off api I made a live tracking one")
        this.setCategoryDescription("PartyCommands", "Quick one to let specific players execute party commands on your behalf.\n\n§4Use At Your Own Risk! (chat macro)")
        this.setCategoryDescription("Bridge", "Simple Bridge bot formatting since I didn't like the other bridge mods.\n\n§aMessage Preview: " + data.bridge.bridgeMessage.replace("<1>","Player").replace("<2>","This is a test message."))
        this.setCategoryDescription("Reparty", "Just your average reparty mod.\n\n§4Use At Your Own Risk! (technically a chat macro)")
        this.setCategoryDescription("ReplaceGhost", "A simple dungeons mod that replaced and became a ghost with any msg you want (includes formatting). Leaving the list of player to check for empty will replace the msg for everyone.")
        this.setCategoryDescription("FragBot", "A better FragBot mod than most other mods.\n\n§4Use At Your Own Risk! (fragbots are bannable)")
        this.setCategoryDescription("DungeonPartyUtils", "A Party Finder mod for dungeons to quickly see what stuff your teammates have.")
    }
}

export default new Settings();