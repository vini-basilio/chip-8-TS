import './style.css'

import {CreateMemory} from "./CHIP-8/CreateMemory.js";
import { Cpu } from "./CHIP-8/Cpu.js";
import {INSTRUCTIONS} from "./CHIP-8/instructions.js";

const RAM = CreateMemory(256)
const CPU = new Cpu(CreateMemory, RAM)

let i = 0;

RAM.setUint8(i++, 0x60 + CPU.registerMapIndex.get("V0"));
RAM.setUint8(i++, 0x01);
RAM.setUint8(i++, 0x70 + CPU.registerMapIndex.get("V0"));
RAM.setUint8(i++, 0x01);
RAM.setUint8(i++, 0xA0 + 0x09);
RAM.setUint8(i++, 0x99);
CPU.step();
CPU.step();
CPU.step();
const state = CPU.debug();

const root = document.querySelector('#app')


state.forEach(
    reg => {
        root.insertAdjacentHTML(
            "beforeend",
            `<p>${reg}</p>`,
        );
    }
)


