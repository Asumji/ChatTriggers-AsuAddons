import { getrequest, upload } from "../../utils";

export function execute(args) {
    getrequest("https://api.thecatapi.com/v1/images/search").then(response => {
        upload(response[0]["url"]).then(({ data: { link } }) => {
            ChatLib.command("pc " + link)
        })
    })
}