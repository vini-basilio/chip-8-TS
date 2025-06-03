import {CpuMediatorInterface, RegistersInterface, StackInterface} from "../../Interfaces/Contracts";
import {INSTRUCTIONS} from "./Instructions/instructions";
import * as IN from "./Instructions/InstructionsImplementation";
import {EmulatorMediator} from "../EmulatorMediator/EmulatorMediator";
import {
    CallRet,
    RegXAndRegY, RegXMinusRegY,
    RegXOrRegY,
    RegXPlusRegY,
    RegXXorRegY, RegYMinusRegX,
    RegYToRegX, ShiftLeft, ShiftRight
} from "./Instructions/InstructionsImplementation";

export class CpuMediator implements CpuMediatorInterface {
    constructor(
        private registers: RegistersInterface,
        private stack: StackInterface
    ) {
    }
    stackState(): string[] {
        return this.stack.stackState()
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
            case INSTRUCTIONS.CALL_SUB: return IN.CallSub(instruction, this.registers, this.stack)
            default: throw new Error("OPCODE not founded")
        }
    }

    BinaryFamily(instruction: number, display: EmulatorMediator): void {
        switch ((instruction & 0x0FFF)){
            case INSTRUCTIONS.CLEAR_SCREEN: return display.ClearScreen();
            case INSTRUCTIONS.CALL_RET: return CallRet(this.registers, this.stack)
            default: throw new Error("OPCODE not founded")
        }
    }

    ZeroFamily(instruction: number): void {
        switch ((instruction & 0x000F)){
            case 0x0: return RegYToRegX(instruction, this.registers)
            case 0x1: return RegXOrRegY(instruction, this.registers)
            case 0x2: return RegXAndRegY(instruction, this.registers)
            case 0x3: return RegXXorRegY(instruction, this.registers)
            case 0x4: return RegXPlusRegY(instruction, this.registers)
            case 0x5: return RegXMinusRegY(instruction, this.registers)
            case 0x7: return RegYMinusRegX(instruction, this.registers)
            case 0x6: return ShiftRight(instruction, this.registers)
            case 0xE: return ShiftLeft(instruction, this.registers)
            default: throw new Error("OPCODE not founded")
        }
    }
}




