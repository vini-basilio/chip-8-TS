import {CpuMediatorInterface, RegistersInterface, StackInterface} from "../../Interfaces/Contracts";
import {INSTRUCTIONS} from "./Instructions/instructions";
import * as IN from "./Instructions/InstructionsImplementation";

export class CpuMediator implements CpuMediatorInterface {
    constructor(
        private registers: RegistersInterface,
        private statck: StackInterface
    ) {
    }
    stackState(): string[] {
        return this.statck.stackState()
    }

    getRegister(name: string): number {
        return this.registers.getRegister(name)
    }

    getRegisterByInstruction(register: number): number {
        return this.registers.getRegisterByInstruction(register)
    }

    setRegisterByInstruction(register: number, literal: number): void {
        this.registers.setRegisterByInstruction(register, literal)
    }
    registerState(){
        return this.registers.registerState()
    }
    setRegisterName(name: string, value: number): void {
        this.registers.setRegisterName(name, value)
    }
    BaseFamily(opcode: number, instruction: number){
        console.log("OPCODE: " + opcode)
        switch (opcode){
            case INSTRUCTIONS.MOV_LIT_REG: return IN.MovLitReg(instruction, this.registers)
            case INSTRUCTIONS.SET_INDEX_REGISTER: return this.registers.setRegisterName("I", (instruction & 0x0FFF))
            case INSTRUCTIONS.JUMP_OFFSET: return IN.JumpOffset(instruction, this.registers)
            case INSTRUCTIONS.RANDOM: return IN.Random(instruction, this.registers)
            case INSTRUCTIONS.EQUALS: return IN.Equals(instruction, this.registers)
            case INSTRUCTIONS.NOT_EQUALS: return IN.NotEquals(instruction, this.registers)
            case INSTRUCTIONS.EQUALS_LIT: return IN.EqualsLit(instruction, this.registers)
            case INSTRUCTIONS.NOT_EQUAL_LIT: return IN.NotEqualsLit(instruction, this.registers)
            case INSTRUCTIONS.ADD_LIT_TO_REGISTER: return IN.AddLitToRegister(instruction, this.registers)
            case INSTRUCTIONS.CALL_SUB: return IN.CallSub(instruction, this.registers, this.statck)
        }
    }

    BinaryFamily(instruction: number): void {
    }

    ZeroFamily(instruction: number): void {
    }
}




