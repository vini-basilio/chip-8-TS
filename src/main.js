import './style.css'

import {CreateMemory} from "./CHIP-8/CreateMemory.js";
import { Cpu } from "./CHIP-8/Cpu.js";

import CHIP8Screen from "./CHIP-8/CHIP8Screen.js";
import {DRAW_E_CENTER, IBM_LOGO, TEST_SPRITE_PROGRAM} from "./CHIP-8/ROMS_DEBUG/IBM_LOGO.js";

const canvas = document.querySelector('#canvas')

const RAM = CreateMemory(4026)
const SCREEN = new CHIP8Screen(canvas);
const CPU = new Cpu(CreateMemory, RAM, SCREEN)

let i = 0;

// 0x200 - 0xFFF (512 - 4095 bytes): Área do Programa (Onde o Jogo é Carregado)
TEST_SPRITE_PROGRAM.forEach(
    (instrution16bit, index8bitSize) =>
    {
        RAM.setInt16((index8bitSize * 2) + 0x200, instrution16bit)
    }
)



const root = document.querySelector('#app');
const nextButton = document.querySelector('#nextButton');

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




