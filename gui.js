import { data } from "./index.js";
import { @Vigilant, @ButtonProperty, @SliderProperty, @SwitchProperty, @ParagraphProperty, @TextProperty, @SelectorProperty, createPropertyAttributesExt } from 'Vigilance';

const File = Java.type("java.io.File")
const ValueBackedPropertyValue = Java.type("gg.essential.vigilance.data.ValueBackedPropertyValue");
const PropertyType = Java.type("gg.essential.vigilance.data.PropertyType");
const PropertyData = Java.type("gg.essential.vigilance.data.PropertyData");

@Vigilant("AsuAddons", "AsuAddons Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["PartyCommands","TrophyFish","Bridge","Reparty","ReplaceGhost","FragBot","Dungeons"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
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

    @SwitchProperty({
        name: "Fun Commands",
        description: "Allow party members to access the fun commands below.",
        category: "PartyCommands"
    })
    partycmdCustomEnabled = data.partycmd.customEnabled;

    @ParagraphProperty({
        name: "Fun Blacklist",
        description: "List of all players that can't use the fun commands. Seperate with \",\" ex. player1,player2",
        category: "PartyCommands"
    })
    partycmdCustomBlacklist = data.partycmd.customBlacklist.length > 1 ? data.partycmd.customBlacklist.join(",") : "";

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
        category: "Dungeons"
    })
    dpuEnabled = data.dpu.enabled;

    @SwitchProperty({
        name: "Terminal Waypoints",
        description: "Marks undone terminals. (Same as Soopy but less buggy I think)",
        category: "Dungeons"
    })
    dpuTermwaypoints = data.dpu.termwaypoints;

    @SwitchProperty({
        name: "Waypoint Beacon",
        description: "Toggles whether or not the term waypoint has a beacon or not.",
        category: "Dungeons"
    })
    dpuTermbeacon = data.dpu.termbeacon;

    @SwitchProperty({
        name: "Terms Overview",
        description: "Shows you a list of what party members did in f7 p3.",
        category: "Dungeons"
    })
    dpuTermsummary = data.dpu.termsummary;

    @SwitchProperty({
        name: "Enable Kuudra",
        description: "Toggles the party finder for kuudra.",
        category: "Dungeons"
    })
    dpuKuudra = data.dpu.kuudra;

    @ParagraphProperty({
        name: "Relevant Items",
        description: "List of all items the mod checks for. Seperate with \",\" ex. item1,item2",
        category: "Dungeons"
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

    constructor() {
        this.initialize(this);
        
        const f = new File("config/ChatTriggers/modules/AsuAddons/mods/", "custompcmds")

        if (f.exists()) {
            const fileArray = f.listFiles()
            fileArray.forEach(command => {
                command = command.toString().split("\\")[command.toString().split("\\").length-1].replace(".js","")
                const attributes = createPropertyAttributesExt(
                    PropertyType.SWITCH,
                    {
                        name: command,
                        category: "PartyCommands",
                        description: require("./mods/custompcmds/"+command+".js").desc
                    }
                )
    
                const PropData = new PropertyData(
                    attributes,
                    new ValueBackedPropertyValue(true),
                    this.getConfig()
                )
                this.registerProperty(PropData) 
                this.addDependency(command,"Fun Commands")
                this.registerListener(command, newValue => {
                    data.partycmd.commands.forEach((commandValue,index) => {
                        if (command == commandValue[0]) {
                            data.partycmd.commands[index][1] = newValue
                        }
                    })
                })
            });
        }

        this.addDependency("Fun Blacklist","Fun Commands")
        this.addDependency("Waypoint Beacon","Terminal Waypoints")

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
        this.registerListener("Terminal Waypoints", newValue => {
            data.dpu.termwaypoints = newValue
        });
        this.registerListener("Waypoint Beacon", newValue => {
            data.dpu.termbeacon = newValue
        });
        this.registerListener("Terms Overview", newValue => {
            data.dpu.termsummary = newValue
        });
        this.registerListener("Enable Kuudra", newValue => {
            data.dpu.kuudra = newValue
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
            data.bridge.botIGN = newValue
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
        this.registerListener("Fun Commands", newValue => {
            data.partycmd.customEnabled = newValue
        });
        this.registerListener("Fun Blacklist", newValue => {
            if (newValue.includes(",")) {
                data.partycmd.customBlacklist = newValue.toLowerCase().split(",")
            } else {
                data.partycmd.customBlacklist = [newValue.toLowerCase()]
            }
        });

        this.setCategoryDescription("PartyCommands", "Quick one to let specific players execute party commands on your behalf.\n\n§4Use At Your Own Risk! (chat macro)")
        this.setCategoryDescription("TrophyFish", "Tracks all the Trophy Fish you've fished up so far. Since I could only find mods that track based off api I made a live tracking one")
        this.setCategoryDescription("Bridge", "Simple Bridge bot formatting since I didn't like the other bridge mods.\n\n§aMessage Preview: " + data.bridge.bridgeMessage.replace("<1>","Player").replace("<2>","This is a test message."))
        this.setCategoryDescription("Reparty", "Just your average reparty mod.\n\n§4Use At Your Own Risk! (technically a chat macro)")
        this.setCategoryDescription("ReplaceGhost", "A simple dungeons mod that replaced and became a ghost with any msg you want (includes formatting). Leaving the list of player to check for empty will replace the msg for everyone.")
        this.setCategoryDescription("FragBot", "A better FragBot mod than most other mods.\nSolo dungeons are being added so this is mostly irrelavent but keeping it here for anyone that needs it.\n\n§4Use At Your Own Risk! (fragbots are bannable)")
        this.setCategoryDescription("Dungeons", "A QOL mod for dungeons to give useful information for your runs.")
    }
}

export default new Settings();