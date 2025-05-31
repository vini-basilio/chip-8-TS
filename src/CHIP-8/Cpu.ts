import {CreateMemory} from "./CreateMemory";
import {INSTRUCTIONS} from "./instructions";
import CHIP8Screen from "./CHIP8Screen";

export class Cpu {
    memory: DataView;
    registersNames: string[]
    registersMemory: DataView;
    registerMapIndex: Map<string, number>
    chip8Screen: typeof CHIP8Screen;
    /*
        Na maior parte dos emuladores, pelo que li,
        a stack fica fora da conta da RAM.
        Seguirei essa abordagem.
    */
    stack: number[]

    constructor(registerMemorySpace: typeof CreateMemory, memory: DataView, chip8Screen: typeof CHIP8Screen) {
        this.registersNames = [
            "V0", "V1", "V2",
            "V3", "V4", "V5",
            "V6", "V7", "V8",
            "V9",
            "VA", "VB", "VC",
            "VD", "VE", "VF",
            "PC", // Program Counter
            "I",  // Endereco da memoria
            "SP"  // Stack Pointer
        ]

        // Cada registrador guarda 16 bit
        // 2 bytes
        const sizeOfRegisterMemory = this.registersNames.length * 2;

        this.registersMemory = registerMemorySpace(sizeOfRegisterMemory);

        this.registerMapIndex = this.registersNames.reduce((map, name, i) => {
            map.set(name, i * 2)
            return map
        }, new Map())

        this.stack = new Array();
        this.memory = memory;


        this.chip8Screen = chip8Screen;
        this.loadFontSet();
        this.setRegisterName("PC", 0x800)
    }

    debug(){

        const registersState = this.registersNames.map(name => {
            const raw = this.getRegister(name);
            const hex = raw.toString(16).padStart(2, '0').toUpperCase();
            return hex
        })

        return registersState;
    }

    // sprites
    loadFontSet() {
        const FONT_SET = [
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];

        for (let i = 0; i < FONT_SET.length; i++) {
            this.memory[i] = FONT_SET[i]; // Carrega a partir do endereço 0x050
        }
    }


    // Manipulacao de registradores
    getRegister(name: string){
        if(!(this.registersNames.includes(name))){
            throw new Error(`getRegister: No such register '${name}'`)
        }

        const index = this.registerMapIndex.get(name)
        if(index != undefined ) {
            const value = this.registersMemory.getUint16(index)
            return value
        }
        throw new Error(`getRegister: Error to get such register '${name}' value`)
    }

    setRegisterName(name: string, value: number){
        if(!(this.registersNames.includes(name))){
            throw new Error(`setRegister: No such register '${name}'`)
        }
        const index = this.registerMapIndex.get(name)
        if(index != undefined) return this.registersMemory.setUint16(index, value)
        throw new Error(`setRegister: Error to set register '${name}' value`)
    }

    // Buscas
    /*
       Por hora, vou implementar apenas um tipo de busca
       na RAM. A cada ciclo, quero uma instrucao inteira
   */
    fetch(){
        const nextInstructionAddress = this.getRegister("PC");

        if(nextInstructionAddress != undefined){

            const instruction = this.memory.getUint16(nextInstructionAddress);

            this.setRegisterName("PC", nextInstructionAddress + 2)
            return instruction;
        }
        throw new Error(`getRegister: Error to get new instruction`)
    }

    /*
    Tambem vi que eh comum se usar um switch case gigante
    para as opercoes. Seguirei assim e talvez eu mude
    */

    execute(instruction: number){

        const decode = (instruction: number) => {
            const opcode = (instruction & 0xF000) >> 12;
            return opcode;
        }

        const opcode = decode(instruction);

        switch(opcode){
            case INSTRUCTIONS.MOV_LIT_REG:{
                const register = (instruction & 0x0F00) >> 8;
                const literal =  (instruction & 0x00FF)

                this.registersMemory.setUint16(register * 2, literal)
                break;
            }
            case INSTRUCTIONS.ADD_LIT_TO_REGISTER:{
                const register = (instruction & 0x0F00) >> 8;
                const currentRegisterValue = this.registersMemory.getUint16(register);
                const literal = (instruction & 0x00FF)
                this.registersMemory.setUint16(register * 2, literal + currentRegisterValue)
                break;
            }
            case INSTRUCTIONS.SET_INDEX_REGISTER:{
                this.setRegisterName("I", (instruction & 0x0FFF))
                break;
            }
            case INSTRUCTIONS.DRAW: {
                const registerX = (instruction & 0x0F00) >> 8;
                const registerValueX = this.registersMemory.getUint16(registerX * 2);

                const registerY = (instruction & 0x00F0) >> 4;
                const registerValueY = this.registersMemory.getUint16(registerY * 2);
                const rows = (instruction & 0x000F); // define o tamanho da linha


                this.setRegisterName("VF", 0);

                // TO-DO retirar esse inner loop como fiz com a tela
                for(let row = 0; row < rows; row++){
                    const spriteByte = this.memory[this.getRegister("I") + row]
                    // 8 bits
                    for(let col = 0; col < 8; col++){
                        const spritePixel = (spriteByte >> (7 - col)) & 1;

                        const xOffset = (registerValueX + col) % 64;
                        const yOffset = (registerValueY + row) % 32;
                        console.log(xOffset + " : " + yOffset)
                        const currentPixel = this.chip8Screen.getPixel(yOffset, xOffset);

                        const newPixel = spritePixel ^ currentPixel;

                        this.chip8Screen.setPixel(yOffset, xOffset, newPixel)

                        if (currentPixel === 1 && newPixel === 0) {
                            this.setRegisterName("VF", 1);
                        }
                    }
                }
            }
        }
    }
    step(){
        const instruction = this.fetch();
        this.execute(instruction);
    }
}