import './style.css'

import {CreateMemory} from "./CHIP-8/CreateMemory.js";
import { Cpu } from "./CHIP-8/Cpu.js";

import CHIP8Screen from "./CHIP-8/CHIP8Screen.js";
import {DRAW_E_CENTER, ROMS, LETTER_E, TEST_SPRITE_PROGRAM} from "./CHIP-8/ROMS_DEBUG/ROMS.ts";

const canvas = document.querySelector('#canvas')

const RAM = CreateMemory(4026)
const SCREEN = new CHIP8Screen(canvas);
const CPU = new Cpu(CreateMemory, RAM, SCREEN)

let i = 0;

// 0x200 - 0xFFF (512 - 4095 bytes): Área do Programa (Onde o Jogo é Carregado)
ROMS.forEach(
    (instrution16bit, index8bitSize) =>
    {
        RAM.setUint16((index8bitSize * 2) + 0x800, instrution16bit)
    }
)

const IBM_LETTER = [
    0xF0, // ████
    0x20, //   █
    0x20, //   █
    0x20, //   █
    0xF0 , // ████

    // // B
    0xF0, // ████
    0x90, // █  █
    0xF0, // ████
    0x90, // █  █
    0xF0, // ████
    //
    // M
    0x90, // █  █
    0xF0, // ████
    0xF0, // ████
    0x90, // █  █
    0x90
]// █  █


for (let i = 0; i < IBM_LETTER.length; i++) {
    RAM[i + 0x22A ] = IBM_LETTER[i]; // Carrega a partir do endereço 0x050
    RAM.setUint8(i + 0x22A, IBM_LETTER[i])
}

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




