import { getrequest } from "../../utils.js"
import { modPrefix } from "../../index.js"

export function execute(args) {
    getrequest("https://uselessfacts.jsph.pl/api/v2/facts/random").then(response => {
        console.log(modPrefix + "Fact source: " + response["permalink"])

        if (response["text"].includes(" sex") || response["text"].includes(" ejaculation")) {
            ChatLib.chat(modPrefix+" Fact contained banned Words. Aborting.")
            return;
        }

        if (response["text"].length > 96) {
            let array = response["text"].split("")
            let output = [""]
            let line = 0
            for (let i = 0; i < array.length; i++) {
                output[line] += array[i]
                if ((i+1)%96 == 0 || i == array.length) {
                    output.push("")
                    line += 1
                }
            }
            output.forEach((line,index) => {
                setTimeout(() => {
                    ChatLib.command("pc " + line)
                }, index*500);
            })
        } else {
            ChatLib.command("pc " + response["text"])
        }
    })
}