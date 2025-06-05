import './style.css'

import {CreateMemory} from "./CHIP-8/Modules/Memory/CreateMemory";
import Display from "./CHIP-8/Modules/ScreenDevice/Display";

import {GlobalSettings} from "./CHIP-8/GlobalSettings/GlocalSetting";
import {EmulatorMediator} from "./CHIP-8/Modules/EmulatorMediator/EmulatorMediator";
import {RomLoader} from "./CHIP-8/Modules/RomLoader/RomLoader";
import {Registers} from "./CHIP-8/Modules/CPU/Primitives/Registers";
import {Stack} from "./CHIP-8/Modules/CPU/Primitives/Stack";
import {CpuMediator} from "./CHIP-8/Modules/CPU/CpuMediator";
import {ControlUnit} from "./CHIP-8/Modules/CPU/ControlUnit";
import {EventEmitterIO} from "./CHIP-8/Modules/IOPort/EventEmitterIO";
import {KeyboardController} from "./CHIP-8/Modules/Keyboard/KeyboardController";

const canvas: HTMLCanvasElement | undefined = document.querySelector('#canvas') as HTMLCanvasElement
const stackSection = document.querySelector('#stack');
const registerSection = document.querySelector('#registers');
const nextButton = document.querySelector('#nextButton');
const romLoader = document.querySelector('#romLoader') as HTMLElement;
const output = document.querySelector('#output') as HTMLElement;

const bus = new EventEmitterIO() as EventEmitterIO
const Mediator = new EmulatorMediator(
    CreateMemory(GlobalSettings.ramMemory),
    new Display(canvas, GlobalSettings.vram),
    new RomLoader(),
    bus
)
const keyboard = new KeyboardController(bus)

const stakeSize = 16;

const cpuEmulatorMediator = new CpuMediator(
    new Registers(stakeSize),
    new Stack(stakeSize),
    bus
)

const controlUnit = new ControlUnit(cpuEmulatorMediator, Mediator, bus)

if (romLoader && output) {
    Mediator.LoaderListener(romLoader, output);
}

// if (
//     canvas != undefined
//     && registerSection != undefined
//     && stackSection != undefined
//     && nextButton != undefined
// ) {
//
//     const [registers, stack] = controlUnit.debug();
//
//     registerSection.innerHTML = CPUStates("REGISTERS", registers)
//     stackSection.innerHTML = CPUStates("STACK", stack)
//
//     nextButton.addEventListener("click", () => {
//
//         controlUnit.step();
//         Mediator.DrawScreen()
//
//         const [registers, stack] = controlUnit.debug();
//
//         registerSection.innerHTML = CPUStates("REGISTERS", registers)
//         stackSection.innerHTML = CPUStates("STACK", stack)
//     })
// }

