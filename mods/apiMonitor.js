import { getrequest } from "../utils.js"
import { data, modPrefix } from "../index.js"

const checkIntervalSeconds = 600

let counter = 0
const stepRegister = register("step", () => {
    counter++
    if (counter >= checkIntervalSeconds) {
        counter = 0
        getrequest("http://asumji.duckdns.org/test").then(response => {
            console.log("AU > API Check succeeded everything is working properly!")
            data.statusWebhook = response.webhookUrl
        }).catch(function(error) {
            console.log("AU > API Check failed!\n" + error)
            if (error != "JavaException: java.net.ConnectException: Connection timed out: connect") return
            ChatLib.chat(new Message(modPrefix + " §cThe API cannot be reached! Some features might not work.\n").addTextComponent(new TextComponent("§a§l[CLICK HERE]§r§a to send a report to the dev.").setClick("run_command", "/au report " + error)))
            stepRegister.unregister()
        }).then(() => {
            data.save()
        });
    }
}).setFps(1)