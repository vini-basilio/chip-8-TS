import {RegistersInterface} from "../../../../Interfaces/Contracts";
import {EmulatorMediator} from "../../../EmulatorMediator/EmulatorMediator";

export const IndexLong = (
    instruction: number,
    registers: RegistersInterface,
) => {
    registers.setRegisterName("I", (instruction & 0x0FFF))
}

export const SaveRegs = (
    instruction: number,
    registers: RegistersInterface,
    emulatorMediator: EmulatorMediator
) => {
    const registerX = (instruction & 0x0F00) >> 8;
    const registerY = (instruction & 0x00F0) >> 8;

    let index = registers.getRegister("I")

    for (let i = registerX; i <= registerY; i++) {
        const v = registers.getRegisterByInstruction(i)
        emulatorMediator.setUint8(index++, v)
    }
}

export const LoadRegs = (
    instruction: number,
    registers: RegistersInterface,
    emulatorMediator: EmulatorMediator
) => {
    const registerX = (instruction & 0x0F00) >> 8;
    const registerY = (instruction & 0x00F0) >> 8;

    let index = registers.getRegister("I")

    for (let i = registerX; i <= registerY; i++) {
        registers.setRegisterByInstruction(i, emulatorMediator.getUint8(index++))
    }
}

export const ModeLong = () => {

}