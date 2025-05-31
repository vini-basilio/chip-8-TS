import {CreateMemory} from "./CreateMemory";
import {INSTRUCTIONS} from "./instructions";

export class Cpu {
    memory: DataView;
    registersNames: string[]
    registersMemory: DataView;
    registerMapIndex: Map<string, number>

    /*
        Na maior parte dos emuladores, pelo que li,
        a stack fica fora da conta da RAM.
        Seguirei essa abordagem.
    */
    stack: number[]

    constructor(registerMemorySpace: typeof CreateMemory, memory: DataView) {
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
        console.log(this.registerMapIndex)

    }

    debug(){
        const registersState: string[] = []
        this.registersNames.forEach(name => {
            const value = this.getRegister(name).toString(16);
            registersState.push(`${name}: ${value.padStart(4,"0")}`)
        })
        return registersState;
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
                const literal = (instruction & 0x00FF)
                this.registersMemory.setUint16(register, literal)
                break;
            }
            case INSTRUCTIONS.ADD_LIT_TO_REGISTER:{
                const register = (instruction & 0x0F00) >> 8;
                const currentRegisterValue = this.registersMemory.getUint16(register);
                const literal = (instruction & 0x00FF)
                this.registersMemory.setUint16(register, literal + currentRegisterValue)
                break;
            }
            case INSTRUCTIONS.SET_INDEX_REGISTER:{
                this.setRegisterName("I", (instruction & 0x0FFF))
                break;
            }
        }
    }
    step(){
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}