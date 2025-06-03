import {CreateMemory} from "../Memory/CreateMemory";
import {INSTRUCTIONS} from "./instructions";
import {ScreenDeviceInterface} from "../../Interfaces/Contracts";

export class Cpu {
    memory: DataView;
    registersNames: string[]
    registersMemory: DataView;
    registerMapIndex: Map<string, number>
    chip8Screen: ScreenDeviceInterface;
    /*
        Na maior parte dos emuladores, pelo que li,
        a stack fica fora da conta da RAM.
        Seguirei essa abordagem.
    */
    stack: DataView

    constructor(
                registerMemorySpace: typeof CreateMemory,
                memory: DataView,
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

        this.stack = CreateMemory(16 * 2)
        this.memory = memory;


        this.chip8Screen = chip8Screen;
        this.setRegisterName("PC", ROM_start_address)
        this.setRegisterName("SP", this.stack.byteLength - 2)
    }

    debug(){

        const registers = this.registersNames.map(name => {
                const cc = this.getRegister(name);
            return  `${name}: ${cc.toString(16).padStart(4, '0x').toUpperCase()}`
        })
        const stackState = []
        for(let i = 0; i < this.stack.byteLength; i += 2 ){
            const cc = this.stack.getUint16(i)
            stackState.push(cc.toString(16).padStart(4, '0x').toUpperCase());
        }
        return [registers,  stackState];
    }

    loadROM(Uint8Buffer: Uint8Array){
        const startAddress = this.getRegister("PC");

        Uint8Buffer.forEach( (n: number, index: number) => {
            this.memory.setUint8(index + startAddress, n);
        })
    }

    // Manipulacao de registradores
    private getRegister(name: string){
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

    private setRegisterName(name: string, value: number){
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
    private fetch(){
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

    private execute(instruction: number){

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
            case INSTRUCTIONS.SET_INDEX_REGISTER:{
                this.setRegisterName("I", (instruction & 0x0FFF))
                break;
            }
            case INSTRUCTIONS.JUMP: {
                this.setRegisterName("PC", (instruction & 0x0FFF))
                break;
            }
            // Condicionais
            case INSTRUCTIONS.EQUALS: {
                const registerX = (instruction & 0x0F00) >> 8;
                const currentRegisterX = this.getRegisterByInstruction(registerX);
                const registerY = (instruction & 0x00F0) >> 4;
                const currentRegisterY = this.getRegisterByInstruction(registerY);
                const currentPC = this.getRegister("PC")
                if(currentRegisterX == currentRegisterY) this.setRegisterName("PC",  currentPC + 2)
                break;
            }
            case INSTRUCTIONS.NOT_EQUALS: {
                const registerX = (instruction & 0x0F00) >> 8;
                const currentRegisterX = this.getRegisterByInstruction(registerX);
                const registerY = (instruction & 0x00F0) >> 4;
                const currentRegisterY = this.getRegisterByInstruction(registerY);
                const currentPC = this.getRegister("PC")
                if(currentRegisterX != currentRegisterY) this.setRegisterName("PC",  currentPC + 2)
                break;
            }
            case INSTRUCTIONS.EQUALS_LIT: {
                const register = (instruction & 0x0F00) >> 8;
                const currentRegisterValue = this.getRegisterByInstruction(register);
                const literalValue = (instruction & 0x00FF);
                const currentPC = this.getRegister("PC")
                if(currentRegisterValue == literalValue) this.setRegisterName("PC",  currentPC + 2)
                break;
            }
            case INSTRUCTIONS.NOT_EQUAL_LIT: {
                const register = (instruction & 0x0F00) >> 8;
                const currentRegisterValue = this.getRegisterByInstruction(register);
                const literalValue = (instruction & 0x00FF);
                const currentPC = this.getRegister("PC")
                if(currentRegisterValue != literalValue) this.setRegisterName("PC",  currentPC + 2)
                break;
            }
            case INSTRUCTIONS.ADD_LIT_TO_REGISTER:{
                const register = (instruction & 0x0F00) >> 8;
                const currentRegisterValue = this.registersMemory.getUint16(register);
                const literal = (instruction & 0x00FF)
                const sum = literal + currentRegisterValue
                this.setRegisterByInstruction(register, (sum & 0xFF));
                break;
            }
            case INSTRUCTIONS.CALL_SUB: {
                const currentStackPointer = this.getRegister("SP")
                this.stack.setUint16(currentStackPointer, this.getRegister("PC"))
                this.setRegisterName("SP", currentStackPointer - 2)
                this.setRegisterName("PC",(instruction & 0x0FFF))
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
                break;
            }
        }
        if(opcode == 0){
            if(INSTRUCTIONS.CLEAR_SCREEN == (instruction & 0x0FFF)) {
                this.chip8Screen.ClearScreen();
                return;
            }
            if(INSTRUCTIONS.CALL_RET == (instruction & 0x0FFF)){
                const stackPointer = this.getRegister("SP")
                const stackPCValue = this.stack.getUint16(stackPointer)
                this.setRegisterName("PC", stackPCValue)
                this.setRegisterName("SP", stackPointer + 2)
                return;
            }
        }
        if(opcode == 0x8){
            switch ((instruction & 0x000F)){
                case 0x0: {
                    // Carrega no REG X o valor do REG Y
                    const registerX = (instruction & 0x0F00) >> 8;
                    const registerY = (instruction & 0x00F0) >> 4;
                    const registerValueY = this.getRegisterByInstruction(registerY);
                    this.setRegisterByInstruction(registerX, registerValueY)
                    break;
                }
                case 0x1: {
                    // Seta o REG X com valor da operacao REG X OR REG Y
                    // Y nao e afetado
                    const registerX = (instruction & 0x0F00) >> 8;
                    const registerValueX = this.getRegisterByInstruction(registerX);
                    const registerY = (instruction & 0x00F0) >> 4;
                    const registerValueY = this.getRegisterByInstruction(registerY);
                    this.setRegisterByInstruction(registerX, (registerValueX | registerValueY))
                    break;
                }
                case 0x2: {
                    // Seta o REG X com o valor da operacao REG X AND REG Y
                    // Y nao e afetado
                    const registerX = (instruction & 0x0F00) >> 8;
                    const registerValueX = this.getRegisterByInstruction(registerX);
                    const registerY = (instruction & 0x00F0) >> 4;
                    const registerValueY = this.getRegisterByInstruction(registerY);
                    this.setRegisterByInstruction(registerX, (registerValueX & registerValueY))
                    break;
                }
                case 0x3: {
                    // Seta o REG X com o valor da operacao REG X XOR REG Y
                    // Y nao e afetado
                    const registerX = (instruction & 0x0F00) >> 8;
                    const registerValueX = this.getRegisterByInstruction(registerX);
                    const registerY = (instruction & 0x00F0) >> 4;
                    const registerValueY = this.getRegisterByInstruction(registerY);
                    this.setRegisterByInstruction(registerX, (registerValueX ^ registerValueY))
                    break;
                }
                case 0x4: {
                    // Adiciona ao REG X o valor REG X SUM REG Y
                    // Diferente de 0x7, flag deve ser atualizado com overflow ou nao
                    const registerX = (instruction & 0x0F00) >> 8;
                    const registerValueX = this.getRegisterByInstruction(registerX);
                    const registerY = (instruction & 0x00F0) >> 4;
                    const registerValueY = this.getRegisterByInstruction(registerY);

                    const sum = registerValueX + registerValueY;
                    const overflow = sum > 255 ? 1 : 0;
                    this.setRegisterName("VF", overflow)
                    this.setRegisterByInstruction(registerX, (sum & 0xFF))

                    break;
                }
                case 0x5: {
                    // Adiciona ao REG X o valor REG X - REG Y

                    const registerX = (instruction & 0x0F00) >> 8;
                    const registerValueX = this.getRegisterByInstruction(registerX);
                    const registerY = (instruction & 0x00F0) >> 4;
                    const registerValueY = this.getRegisterByInstruction(registerY);

                    const diff = registerValueX - registerValueY;

                    this.setRegisterByInstruction(registerX, diff)

                    break;
                }
                case 0x7: {
                    // Adiciona ao REG X o valor REG X + REG Y

                    const registerX = (instruction & 0x0F00) >> 8;
                    const registerValueX = this.getRegisterByInstruction(registerX);
                    const registerY = (instruction & 0x00F0) >> 4;
                    const registerValueY = this.getRegisterByInstruction(registerY);

                    const diff = registerValueY - registerValueX;

                    this.setRegisterByInstruction(registerX, diff)

                    break;
                }
                case 0x6: {
                    throw new Error("No implemented 8XY6")

                    break;
                }
                case 0xE: {
                    throw new Error("No implemented 8XYE")

                    break;
                }
            }
        }
    }


    step(){
        const instruction = this.fetch();
        this.execute(instruction);
    }
}