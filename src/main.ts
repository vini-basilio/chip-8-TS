import './style.css'

import {CreateMemory} from "./CHIP-8/Modules/Memory/CreateMemory";
import Display from "./CHIP-8/Modules/ScreenDevice/Display";

import {GlobalSettings} from "./CHIP-8/GlobalSettings/GlocalSetting";

import {CPUStates} from "./UI/CPUStates";
import {EmulatorMediator} from "./CHIP-8/Modules/EmulatorMediator/EmulatorMediator";
import {RomLoader} from "./CHIP-8/Modules/RomLoader/RomLoader";
import {Registers} from "./CHIP-8/Modules/CPU/Registers";
import {Stack} from "./CHIP-8/Modules/CPU/Stack";
import {CpuMediator} from "./CHIP-8/Modules/CPU/CpuMediator";
import {ControlUnit} from "./CHIP-8/Modules/CPU/ControlUnit";

const canvas: HTMLCanvasElement | undefined = document.querySelector('#canvas') as HTMLCanvasElement
const stackSection = document.querySelector('#stack');
const registerSection = document.querySelector('#registers');
const nextButton = document.querySelector('#nextButton');
const romLoader = document.querySelector('#romLoader') as HTMLElement;
const output = document.querySelector('#output') as HTMLElement;

const SCREEN = new Display(canvas, GlobalSettings.vram);
const RAM = CreateMemory(GlobalSettings.ramMemory)
const Mediator = new EmulatorMediator(RAM, SCREEN, new RomLoader())

const stakeSize = 16;
const regs = new Registers(stakeSize)
const stack = new Stack(stakeSize)
const cpuEmulatorMediator = new CpuMediator(regs, stack)
const controlUnit = new ControlUnit(cpuEmulatorMediator, Mediator)


if(romLoader && output){
    Mediator.LoaderListener(romLoader, output);
}

if(
    canvas != undefined
    && registerSection != undefined
    && stackSection != undefined
    && nextButton != undefined
    ) {

    const [registers, stack] = controlUnit.debug();

    registerSection.innerHTML = CPUStates("REGISTERS", registers)
    stackSection.innerHTML = CPUStates("STACK", stack)

    nextButton.addEventListener("click", () => {
        controlUnit.step();
        SCREEN.DrawScreen()

        const [registers, stack] = controlUnit.debug();

        registerSection.innerHTML = CPUStates("REGISTERS", registers)
        stackSection.innerHTML = CPUStates("STACK", stack)
    })
}

