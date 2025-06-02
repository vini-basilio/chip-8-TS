import './style.css'

import {CreateMemory} from "./CHIP-8/Modules/Memory/CreateMemory";
import { Cpu } from "./CHIP-8/Modules/CPU/Cpu";
import CHIP8Screen from "./CHIP-8/Modules/ScreenDevice/CHIP8Screen";

import {FONTS} from "./CHIP-8/AssetsForTests/Assets";
import {ROMS} from "./CHIP-8/ROMS_DEBUG/ROMS";
import {GlobalSettings} from "./CHIP-8/GlobalSettings/GlocalSetting";

import {RegisterElement} from "./UI/Registers";
import {StackElement} from "./UI/Stack";
import {CPUStates} from "./UI/CPUStates";

const canvas: HTMLCanvasElement | undefined = document.querySelector('#canvas') as HTMLCanvasElement
const stackSection = document.querySelector('#stack');
const registerSection = document.querySelector('#registers');
const nextButton = document.querySelector('#nextButton');


const SCREEN = new CHIP8Screen(canvas, GlobalSettings.vram);
const RAM = CreateMemory(GlobalSettings.ramMemory )

const CPU = new Cpu(CreateMemory, RAM, SCREEN, 0x200)

document.getElementById('romLoader').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const rom = new Uint8Array(event.target.result);

        CPU.loadROM(rom)
        // Mostrar informações do ROM
        const output = document.getElementById('output');
        output.innerHTML = `
                    <h3>ROM Carregado: ${file.name}</h3>
                    <p>Tamanho: ${rom.length} bytes</p>
                    <p>Primeiros bytes: ${Array.from(rom.slice(0, 16)).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' ')}</p>
                `;

        CPU
        console.log('ROM pronto para emulação:', rom);
    };

    reader.readAsArrayBuffer(file);
});

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

