import { Overlay } from "../moveGUI.js";
import { data } from "../index.js"

export const display = new Display();
new Overlay("ticktimer","location","moveticktimer","ticktimer.js","§a0");
ticks = 20;
inClear = false;

register("packetReceived", () => {
    if (!data.ticktimer.enabled || !inClear) return;
    ticks--
    if (ticks < 0) ticks = 20
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction"))

register("tick", () => {
    if (!data.ticktimer.enabled || !inClear) {
        display.clearLines();
        return;
    }
    display.setLine(0, (ticks > 10 ? "§a" : ticks > 5 ? "§6" : "§c")+ticks);
    display.setRenderLoc(data.ticktimer.location[0],data.ticktimer.location[1])  
})

register("chat", () => {
    inClear = true;
}).setCriteria(/.* is now ready./)

register("chat", () => {
    inClear = false;
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")