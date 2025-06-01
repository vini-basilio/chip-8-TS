import {CreateMemory} from "../Memory/CreateMemory";
import {INSTRUCTIONS} from "./instructions";
import {MemoryMapperInterface, ScreenDeviceInterface} from "../../Interfaces/Contracts";

export class Cpu {
    memory: MemoryMapperInterface;
    registersNames: string[]
    registersMemory: DataView;
    registerMapIndex: Map<string, number>
    chip8Screen: ScreenDeviceInterface;
    /*
        Na maior parte dos emuladores, pelo que li,
        a stack fica fora da conta da RAM.
        Seguirei essa abordagem.
    */
    stack: number[]

    constructor(
                registerMemorySpace: typeof CreateMemory,
                memory: MemoryMapperInterface,
                chip8Screen: ScreenDeviceInterface,
                ROM_start_address: number
    ) {
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

        this.stack = [];
        this.memory = memory;


        this.chip8Screen = chip8Screen;
        this.setRegisterName("PC", ROM_start_address)
    }

    debug(){

        const registersState = this.registersNames.map(name => {
            return this.getRegister(name).toString(16).padStart(2, '0').toUpperCase();
        })

        return registersState;
    }

    loadROM(Uint16Buffer: number[]){
        const startAddress = this.getRegister("PC");
        Uint16Buffer.forEach( (n: number, index: number) => {
            this.memory.setUint16((index * 2) + startAddress, n);
        })
    }

    loadBufferInMemory(Uint8Buffer: number[],baseAddress: number){
        Uint8Buffer.forEach( (n: number, index: number) => {
                this.memory.setUint8(index + baseAddress, n);
        })
    }
    // Manipulacao de registradores
    getRegister(name: string){
        if(!(this.registersNames.includes(name))){
            throw new Error(`getRegister: No such register '${name}'`)
        }

        const index = this.registerMapIndex.get(name)
        if(index != undefined ) {
            return this.registersMemory.getUint16(index)
        }
        throw new Error(`getRegister: Error to get such register '${name}' value`)
    }

    private getRegisterByInstruction(register: number) {
        return this.registersMemory.getUint16(register * 2);
    }

    setRegisterName(name: string, value: number){
        if(!(this.registersNames.includes(name))){
            throw new Error(`setRegister: No such register '${name}'`)
        }
        const index = this.registerMapIndex.get(name)
        if(index != undefined) return this.registersMemory.setUint16(index, value)
        throw new Error(`setRegister: Error to set register '${name}' value`)
    }

    private setRegisterByInstruction(register: number, literal: number) {
        this.registersMemory.setUint16(register * 2, literal)
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
            return (instruction & 0xF000) >> 12;
        }

        const opcode = decode(instruction);

        switch(opcode){
            case INSTRUCTIONS.MOV_LIT_REG:{
                const register = (instruction & 0x0F00) >> 8;
                const literal =  (instruction & 0x00FF)
                this.setRegisterByInstruction(register, literal);
                break;
            }
            case INSTRUCTIONS.ADD_LIT_TO_REGISTER:{
                const register = (instruction & 0x0F00) >> 8;
                const currentRegisterValue = this.registersMemory.getUint16(register);
                const literal = (instruction & 0x00FF)
                this.setRegisterByInstruction(register, literal + currentRegisterValue);
                break;
            }
            case INSTRUCTIONS.SET_INDEX_REGISTER:{
                this.setRegisterName("I", (instruction & 0x0FFF))
                break;
            }
            case INSTRUCTIONS.DRAW: {
                const registerX = (instruction & 0x0F00) >> 8;
                const registerValueX = this.getRegisterByInstruction(registerX);

                const registerY = (instruction & 0x00F0) >> 4;
                const registerValueY = this.getRegisterByInstruction(registerY);
                const rows = (instruction & 0x000F); // define o tamanho da linha

                const baseAddress = this.getRegister("I")

                this.setRegisterName("VF", 0);

                // TO-DO retirar esse inner loop como fiz com a tela
                for(let row = 0; row < rows; row++){

                    const spriteByte = this.memory.getUint8(baseAddress + row)

                    for(let col = 0; col < 8; col++){
                        const spritePixel = (spriteByte >> (7 - col)) & 1;

                        const xOffset = (registerValueX + col) % 64;
                        const yOffset = (registerValueY + row) % 32;

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