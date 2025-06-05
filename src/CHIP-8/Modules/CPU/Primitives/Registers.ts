import {RegistersInterface} from "../../../Interfaces/Contracts";
import {CreateMemory} from "../../Memory/CreateMemory";

export class Registers implements RegistersInterface {
    registersNames: string[];
    registersMemory: DataView;
    registerMapIndex: Map<string, number>

    constructor(stackSize: number) {
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
        const sizeOfRegisterMemory = this.registersNames.length * 2;

        this.registersMemory = CreateMemory(sizeOfRegisterMemory);

        this.registerMapIndex = this.registersNames.reduce((map, name, i) => {
            map.set(name, i * 2)
            return map
        }, new Map())

        this.setRegisterName("PC", 0x200)
        this.setRegisterName("SP", stackSize - 2);
    }

    registerState() {
        return this.registersNames.map(name => {
            const cc = this.getRegister(name);
            return `${name}: ${cc.toString(16).padStart(4, '0x').toUpperCase()}`
        })
    }

    getRegister(name: string) {
        if (!(this.registersNames.includes(name))) {
            throw new Error(`getRegister: No such register '${name}'`)
        }

        const index = this.registerMapIndex.get(name)
        if (index != undefined) {
            return this.registersMemory.getUint16(index)
        }
        throw new Error(`getRegister: Error to get such register '${name}' value`)
    }

    getRegisterByInstruction(register: number) {
        return this.registersMemory.getUint16(register * 2);
    }

    setRegisterName(name: string, value: number) {
        if (!(this.registersNames.includes(name))) {
            throw new Error(`setRegister: No such register '${name}'`)
        }
        const index = this.registerMapIndex.get(name)
        if (index != undefined) return this.registersMemory.setUint16(index, value)
        throw new Error(`setRegister: Error to set register '${name}' value`)
    }

    setRegisterByInstruction(register: number, literal: number) {
        this.registersMemory.setUint16(register * 2, literal)
    }
}