import { getKeyByValue } from "../../utils";

export function execute(args) {
    const dict = {
        "A": ".-",
        "B": "-...",
        "C": "-.-.",
        "D": "-..",
        "E": ".",
        "F": "..-.",
        "G": "--.",
        "H": "....",
        "I": "..",
        "J": ".---",
        "K": "-.-",
        "L": ".-..",
        "M": "--",
        "N": "-.",
        "O": "---",
        "P": ".--.",
        "Q": "--.-",
        "R": ".-.",
        "S": "...",
        "T": "-",
        "U": "..-",
        "V": "...-",
        "W": ".--",
        "X": "-..-",
        "Y": "-.--",
        "Z": "--..",
        "1": ".----",
        "2": "..---",
        "3": "...--",
        "4": "....-",
        "5": ".....",
        "6": "-....",
        "7": "--...",
        "8": "---..",
        "9": "----.",
        "10": "-----",
        ".": ".-.-.-",
        ",": "--.--",
        "?": "..--..",
        "!": "-.-.--",
        " ": "/"
    }

    if (args.length > 2) {
        if (args[1].toLowerCase() == "encode") {
            args = args.splice(2,args.length).join(" ").toUpperCase().split("")
            args.forEach((letter,index) => {
                args[index] = dict[letter]
            });
            ChatLib.command("pc " + args.join(" "))
        } else if (args[1].toLowerCase() == "decode") {
            args = args.splice(2,args.length)
            args.forEach((letter,index) => {
                args[index] = getKeyByValue(dict,letter)
            });
            ChatLib.command("pc " + args.join(""))
        } else {
            ChatLib.command("pc Usage: !morse <decode/encode> <text>")
        }
    } else {
        ChatLib.command("pc Usage: !morse <decode/encode> <text>")
    }
}