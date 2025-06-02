import './style.css'

import {CreateMemory} from "./CHIP-8/Modules/Memory/CreateMemory";
import { Cpu } from "./CHIP-8/Modules/CPU/Cpu";
import CHIP8Screen from "./CHIP-8/Modules/ScreenDevice/CHIP8Screen";

import {GlobalSettings} from "./CHIP-8/GlobalSettings/GlocalSetting";

import {CPUStates} from "./UI/CPUStates";

const canvas: HTMLCanvasElement | undefined = document.querySelector('#canvas') as HTMLCanvasElement
const stackSection = document.querySelector('#stack');
const registerSection = document.querySelector('#registers');
const nextButton = document.querySelector('#nextButton');
const romLoader = document.querySelector('#romLoader');
const output = document.querySelector('#output');

const SCREEN = new CHIP8Screen(canvas, GlobalSettings.vram);
const RAM = CreateMemory(GlobalSettings.ramMemory )
const CPU = new Cpu(CreateMemory, RAM, SCREEN, 0x200)

if(romLoader && output){
    romLoader.addEventListener('change', function(e: Event) {
        if(e.target == null) return;
        // @ts-ignore
        const file = e.target.files[0];

        if (!file) return;
        const reader = new FileReader();

        reader.onload = function(event) {
            const rom = new Uint8Array(event.target!.result  as ArrayBuffer);
            CPU.loadROM(rom)
            output.innerHTML = `
                        <h3>ROM loaded: ${file.name}</h3>
                        <p>Size: ${rom.length} bytes</p>
                        <p>Initial bytes: ${Array.from(rom.slice(0, 16)).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')}</p>
                    `;
        };

        reader.readAsArrayBuffer(file);
    });
}

if(
    canvas != undefined
    && registerSection != undefined
    && stackSection != undefined
    && nextButton != undefined
    ) {

    const [registers, stack] = CPU.debug();

    registerSection.innerHTML = CPUStates("REGISTERS", registers)
    stackSection.innerHTML = CPUStates("STACK", stack)

    nextButton.addEventListener("click", () => {
        CPU.step();
        SCREEN.DrawScreen()

        const [registers, stack] = CPU.debug();

        registerSection.innerHTML = CPUStates("REGISTERS", registers)
        stackSection.innerHTML = CPUStates("STACK", stack)
    })
}

