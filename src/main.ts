import './style.css'

import {CreateMemory} from "./CHIP-8/Modules/Memory/CreateMemory";
import { Cpu } from "./CHIP-8/Modules/CPU/Cpu";
import CHIP8Screen from "./CHIP-8/Modules/ScreenDevice/CHIP8Screen";


import {FONTS} from "./CHIP-8/AssetsForTests/Assets";
import {LETTER_E, ROMS} from "./CHIP-8/ROMS_DEBUG/ROMS";


const canvas: HTMLCanvasElement | undefined = document.querySelector('#canvas') as HTMLCanvasElement
const root = document.querySelector('#app');
const nextButton = document.querySelector('#nextButton');

if(
    canvas != undefined
    && root != undefined
    && nextButton != undefined
    ) {
    const SCREEN = new CHIP8Screen(canvas);

    const RAM = CreateMemory(4096)
    const CPU = new Cpu(CreateMemory, RAM, SCREEN, 0x800)

    CPU.loadBufferInMemory(FONTS.IBM_LETTER, 0x22A)
    CPU.loadROM(ROMS)


    const state = CPU.debug();
    root.innerHTML = `
    <aside>
      <h3>REGISTERS STATE</h3>
      <main  style=" display: flex;
            gap: 20px;
            justify-items: center;
            align-content: space-evenly;
"
      >
        <div>
          <p>V0 : ${state[0]} </p>
          <p>V1 : ${state[1]} </p>
          <p>V2 : ${state[2]} </p>
          <p>V3 : ${state[3]} </p>
          <p>V4 : ${state[4]} </p>
          <p>V5 :  ${state[5]} </p>
          <p>V6 :  ${state[6]} </p>
          <p>V7 :  ${state[7]} </p>
          <p>V8 :  ${state[8]} </p>
          <p>V9 :  ${state[9]} </p>
        </div>
        <div>
          <p>VA :  ${state[10]} </p>
          <p>VB :  ${state[11]} </p>
          <p>VC :  ${state[12]} </p>
          <p>VD :  ${state[13]} </p>
          <p>VE :  ${state[14]} </p>
        </div>
        <div>
          <p>VF :  ${state[15]} </p>
          <p>PC :  ${state[16]} </p>
          <p>I  :  ${state[17]} </p>
          <p>SP :  ${state[18]} </p>
        </div>
      </main>
    </aside>
    `

    nextButton.addEventListener("click", () => {
        CPU.step();
        SCREEN.DrawScreen()

        const state = CPU.debug();
        root.innerHTML = `
    <aside>
      <h3>REGISTERS STATE</h3>
      <main  style=" display: flex;
            gap: 20px;
            justify-items: center;
            align-content: space-evenly;
"
      >
        <div>
          <p>V0 : ${state[0]} </p>
          <p>V1 : ${state[1]} </p>
          <p>V2 : ${state[2]} </p>
          <p>V3 : ${state[3]} </p>
          <p>V4 : ${state[4]} </p>
          <p>V5 :  ${state[5]} </p>
          <p>V6 :  ${state[6]} </p>
          <p>V7 :  ${state[7]} </p>
          <p>V8 :  ${state[8]} </p>
          <p>V9 :  ${state[9]} </p>
        </div>
        <div>
          <p>VA :  ${state[10]} </p>
          <p>VB :  ${state[11]} </p>
          <p>VC :  ${state[12]} </p>
          <p>VD :  ${state[13]} </p>
          <p>VE :  ${state[14]} </p>
        </div>
        <div>
          <p>VF :  ${state[15]} </p>
          <p>PC :  ${state[16]} </p>
          <p>I  :  ${state[17]} </p>
          <p>SP :  ${state[18]} </p>
        </div>
      </main>

    </aside>
    `
    })



}

