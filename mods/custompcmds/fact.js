import { getrequest } from "../../utils.js"
import { modPrefix } from "../../index.js"

export const desc = "A random useless fact."

export function execute(args) {
    getrequest("https://uselessfacts.jsph.pl/api/v2/facts/random").then(response => {
        //var response = {permalink: "test", text:"In 1912 a law passed in Nebraska where drivers in the country at night were required to stop every 150 yards, send up a skyrocket, wait eight minutes for the road to clear before proceeding cautiously, all the while blowing their horn and shooting off flares."}
        ChatLib.chat(modPrefix + "Fact source: " + response["permalink"])

        if (response["text"].includes(" sex") || response["text"].includes(" ejaculation")) {
            ChatLib.chat(modPrefix+" Fact contained banned Words. Aborting.")
            return;
        }

        if (response["text"].length > 96) {
            let array = response["text"].split("")
            let output = [""]
            let line = 0
            for (let i = 0; i < array.length; i++) {
                print(output[line])
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