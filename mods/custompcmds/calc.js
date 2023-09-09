export function execute(args) {
    const formula = args.splice(1,args.length).join(" ").replace(/[^-()\d\/*+.]/g, "")
    if (formula == "" || !formula.match(/\d/g)) return ChatLib.command("pc " + "That was not a valid calculation.")
    try {
        const output = eval(formula)
        if (output == undefined || !Number(output)) return ChatLib.command("pc " + "That was not a valid calculation.")
        ChatLib.command("pc " + output)
    } catch (e) {
        ChatLib.command("pc " + "That was not a valid calculation.")
    }
}