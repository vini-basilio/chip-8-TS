import {EventEmitterIOInterface} from "../../Interfaces/Contracts";

export class KeyboardController {
    private keysMap: Map<string, number>

    constructor(private emitter: EventEmitterIOInterface) {
        this.emitter = emitter;

        this.keysMap = new Map();
        this.keysMap.set("1", 0)
        this.keysMap.set("2", 1)
        this.keysMap.set("3", 2)
        this.keysMap.set("4", 3)
        this.keysMap.set("q", 4)
        this.keysMap.set("w", 5)
        this.keysMap.set("e", 6)
        this.keysMap.set("r", 7)
        this.keysMap.set("a", 8)
        this.keysMap.set("s", 9)
        this.keysMap.set("d", 10)
        this.keysMap.set("f", 11)
        this.keysMap.set("z", 12)
        this.keysMap.set("x", 13)
        this.keysMap.set("c", 14)
        this.keysMap.set("v", 15)


        window.addEventListener("keydown", ev => {
            ev.preventDefault();
            if (!this.keysMap.has(ev.key)) return
            this.lastKeyPressed = ev.key
            this.emitter.emit("keyboardStateChange", this.keysMap.get(ev.key), 1);
        })
        window.addEventListener("keyup", ev => {
            ev.preventDefault();
            if (!this.keysMap.has(ev.key)) return
            this.emitter.emit("keyboardStateChange", this.keysMap.get(ev.key), 0);
        })
    }

}
