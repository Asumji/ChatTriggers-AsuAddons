import { data } from "../index.js"
import { drawBox, drawInnerBox } from "../utils.js"

register("postRenderEntity", (entity) => {
    if (entity.getClassName() != "EntityArmorStand" || !data.wither.hitbox) return
    if (!entity.getName().match(/Maxor|Storm|Goldor|Necron/)) return
    data.wither.type == 0 ? 
        drawBox(entity.x,entity.y,entity.z,1,-4,Number(data.wither.color[0])/100,Number(data.wither.color[1])/100,Number(data.wither.color[2])/100,1,false) :   
        drawInnerBox(entity.x,entity.y,entity.z,1,-4,Number(data.wither.color[0])/100,Number(data.wither.color[1])/100,Number(data.wither.color[2])/100,1,false)
})