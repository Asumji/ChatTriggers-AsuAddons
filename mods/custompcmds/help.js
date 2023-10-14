import { data } from "../../index.js"

export const desc = "Shows all current commands."

export function execute(args) {
    let output = "Available Commands: "
    data.partycmd.commands.forEach(command => {
        output += "!" + command[0] + ", "
    })
    output = output.slice(0,-2)
    ChatLib.command("pc " + output)
}