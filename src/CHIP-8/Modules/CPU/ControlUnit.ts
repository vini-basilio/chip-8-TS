import {CpuMediatorInterface} from "../../Interfaces/Contracts";
import {EmulatorMediator} from "../EmulatorMediator/EmulatorMediator";
import * as IN from "./Instructions/InstructionsImplementation";

export class ControlUnit {
    constructor(
        private cpuEmulatorMediator: CpuMediatorInterface,
        private emulatorMediator: EmulatorMediator
    ) {
    }

    fetch() {
        const nextInstructionAddress = this.cpuEmulatorMediator.getRegister("PC");
        if (nextInstructionAddress != undefined) {
            const instruction = this.emulatorMediator.getUint16(nextInstructionAddress);
            this.cpuEmulatorMediator.setRegisterName("PC", nextInstructionAddress + 2)
            return instruction;
        }
        throw new Error(`getRegister: Error to get new instruction`)
    }
    decode (instruction: number) {
        return (instruction & 0xF000) >> 12;
    }
    execute(opcode: number, instruction: number){
        switch (opcode){
            case 0x0: return this.cpuEmulatorMediator.ZeroFamily(instruction)
            case 0x8: return this.cpuEmulatorMediator.BinaryFamily(instruction, this.emulatorMediator)
            case 0xD: return  IN.Draw(instruction, this.cpuEmulatorMediator, this.emulatorMediator)
            default: return this.cpuEmulatorMediator.BaseFamily(opcode, instruction)
        }
    }
    // Atuamente, ainda nao tenho ciclos automaticos, torna mais facil debugar
    step(){
        const instruction = this.fetch();
        const opcode = this.decode(instruction);
        this.execute(opcode, instruction)
    }
    debug(){
        const registers = this.cpuEmulatorMediator.registerState()
        const stackState = this.cpuEmulatorMediator.stackState()
        return [registers,  stackState];
    }
}