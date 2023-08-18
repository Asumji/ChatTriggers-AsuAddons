import { getrequest, upload } from "../../utils";

export function execute(args) {
    getrequest("https://dog.ceo/api/breeds/image/random").then(response => {
        upload(response["message"]).then(({ data: { link } }) => {
            ChatLib.command("pc " + link)
        })
    })
}