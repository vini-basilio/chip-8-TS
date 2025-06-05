import {
    CpuMediatorInterface,
    EventEmitterIOInterface,
    RegistersInterface,
    StackInterface
} from "../../Interfaces/Contracts";
import {INSTRUCTIONS} from "./Instructions/Codes/instructions";
import * as IN from "./Instructions/implementations/OriginalImplementation";
import {
    AddIndex,
    BinaryToDecimal,
    CallRet,
    FontCharacter,
    GetKey,
    IsKeyRegNotPressing,
    IsKeyRegPressing,
    Load,
    RegXAndRegY,
    RegXMinusRegY,
    RegXOrRegY,
    RegXPlusRegY,
    RegXXorRegY,
    RegYMinusRegX,
    RegYToRegX,
    SetDelayReg,
    SetRegDelay,
    ShiftLeft,
    ShiftRight,
    Store
} from "./Instructions/implementations/OriginalImplementation";
import {EmulatorMediator} from "../EmulatorMediator/EmulatorMediator";
import {IndexLong, LoadRegs, SaveRegs} from "./Instructions/implementations/OctoImplementations";
import {OCO_IN} from "./Instructions/Codes/octoInstructions";


export class CpuMediator implements CpuMediatorInterface {
    keyboardState: number[]
    delayTimer: number

    constructor(
        private registers: RegistersInterface,
        private stack: StackInterface,
        emitter: EventEmitterIOInterface
    ) {
        this.keyboardState = new Array(16).fill(0)
        emitter.on("keyboardStateChange", this.handleInterrupt);
        this.delayTimer = 0;

    }

    SetRegistersInitalState() {
        this.registers.setRegisterName("PC", 0x200)
        this.registers.setRegisterName("SP", this.stack.StackSize() - 2)
    }

    TimersUpdate() {
        if (this.delayTimer > 0) {
            this.delayTimer--;
        }
    }

    handleInterrupt = (
        key: number,
        state: number,
    ) => {
        this.keyboardState[key] = state
    };

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

    registerState() {
        return this.registers.registerState()
    }

    setRegisterName(name: string, value: number): void {
        this.registers.setRegisterName(name, value)
    }

    LongMode(address: number) {
        this.registers.setRegisterName("I", address)
    }

    BaseFamily(opcode: number, instruction: number) {
        switch (opcode) {
            case INSTRUCTIONS.MOV_LIT_REG:
                return IN.MovLitReg(instruction, this.registers)
            case INSTRUCTIONS.SET_INDEX_REGISTER:
                return this.registers.setRegisterName("I", (instruction & 0x0FFF))
            case INSTRUCTIONS.JUMP_OFFSET:
                return IN.JumpOffset(instruction, this.registers)
            case INSTRUCTIONS.RANDOM:
                return IN.Random(instruction, this.registers)
            case INSTRUCTIONS.EQUALS:
                return IN.Equals(instruction, this.registers)
            case INSTRUCTIONS.NOT_EQUALS:
                return IN.NotEquals(instruction, this.registers)
            case INSTRUCTIONS.EQUALS_LIT:
                return IN.EqualsLit(instruction, this.registers)
            case INSTRUCTIONS.NOT_EQUAL_LIT:
                return IN.NotEqualsLit(instruction, this.registers)
            case INSTRUCTIONS.ADD_LIT_TO_REGISTER:
                return IN.AddLitToRegister(instruction, this.registers)
            case INSTRUCTIONS.CALL_SUB:
                return IN.CallSub(instruction, this.registers, this.stack)
            case INSTRUCTIONS.JUMP: {
                this.setRegisterName("PC", (instruction & 0x0FFF))
                break;
            }
            default:
                throw new Error(`OPCODE not founded ${opcode}`)
        }
    }

    FFamily(instruction: number, emulatorMediator: EmulatorMediator) {
        switch ((instruction & 0x00FF)) {
            case INSTRUCTIONS.SET_REG_CURRENT_DELAY:
                return SetRegDelay(instruction, this.registers, this.delayTimer)
            case INSTRUCTIONS.SET_DELAY_CURRENT_REF:
                return SetDelayReg(instruction, this.registers, this.setDelayTime)
            case INSTRUCTIONS.GET_KEY:
                return GetKey(instruction, this.registers, this.keyboardState)
            case INSTRUCTIONS.FONT_CHARACTER:
                return FontCharacter(instruction, this.registers)
            case INSTRUCTIONS.BINARY_DECIMAL:
                return BinaryToDecimal(instruction, this.registers, emulatorMediator)
            case INSTRUCTIONS.STORE_MEMO:
                return Store(instruction, this.registers, emulatorMediator)
            case INSTRUCTIONS.LOAD_MEMO:
                return Load(instruction, this.registers, emulatorMediator)
            case INSTRUCTIONS.ADD_REG_INDEX:
                return AddIndex(instruction, this.registers)
            default:
                return IndexLong(instruction, this.registers)
        }
    }

    FiveFamily(instruction: number, emulatorMediator: EmulatorMediator) {
        switch ((instruction & 0x000F)) {
            case OCO_IN.SAVE_RAGE:
                return SaveRegs(instruction, this.registers, emulatorMediator)
            case OCO_IN.LOAD_RAGE:
                return LoadRegs(instruction, this.registers, emulatorMediator)
            default:
        }
        // switch ((instruction & 0x00FF)) {
        //     case OCO_IN.SAVE_FLAGS:
        //         return SaveRegs(instruction, this.registers, emulatorMediator)
        //     case OCO_IN.LOAD_FLAGS:
        //         return LoadRegs(instruction, this.registers, emulatorMediator)
        //     default:
        // }
    }

    EFamily(instruction: number): any {
        switch ((instruction & 0x00FF)) {
            case INSTRUCTIONS.KEY_EQUALS_REG:
                return IsKeyRegPressing(instruction, this.registers, this.keyboardState)
            case INSTRUCTIONS.KEY_NOT_EQUALS_REG:
                return IsKeyRegNotPressing(instruction, this.registers, this.keyboardState)
            default:
                throw new Error(`OPCODE not founded ${instruction.toString(16)}`)
        }
    }

    ZeroFamily(instruction: number, display: EmulatorMediator): void {
        switch ((instruction & 0x0FFF)) {
            case INSTRUCTIONS.CLEAR_SCREEN:
                return display.ClearScreen();
            case INSTRUCTIONS.CALL_RET:
                return CallRet(this.registers, this.stack)
            default:
                throw new Error("OPCODE not founded")
        }
    }

    BinaryFamily(instruction: number): void {
        switch ((instruction & 0x000F)) {
            case 0x0:
                return RegYToRegX(instruction, this.registers)
            case 0x1:
                return RegXOrRegY(instruction, this.registers)
            case 0x2:
                return RegXAndRegY(instruction, this.registers)
            case 0x3:
                return RegXXorRegY(instruction, this.registers)
            case 0x4:
                return RegXPlusRegY(instruction, this.registers)
            case 0x5:
                return RegXMinusRegY(instruction, this.registers)
            case 0x7:
                return RegYMinusRegX(instruction, this.registers)
            case 0x6:
                return ShiftRight(instruction, this.registers)
            case 0xE:
                return ShiftLeft(instruction, this.registers)
            default:
                throw new Error(`OPCODE not founded ${(instruction & 0x000F)}`)
        }
    }

    private setDelayTime = (n: number) => {
        this.delayTimer = n;
    }
}




