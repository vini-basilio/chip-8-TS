import {MemoryInsterface, RegistersInterface} from "../../../Interfaces/Contracts";
import {EmulatorMediator} from "../../EmulatorMediator/EmulatorMediator";

export const Draw = (instruction: number, registers: RegistersInterface, emulatorMediator: EmulatorMediator) => {
    const registerX = (instruction & 0x0F00) >> 8;
    const registerValueX = registers.getRegisterByInstruction(registerX);

    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    const rows = (instruction & 0x000F); // define o tamanho da linha

    const baseAddress = registers.getRegister("I")

    registers.setRegisterName("VF", 0);

    // TO-DO retirar esse inner loop como fiz com a tela
    for(let row = 0; row < rows; row++){

        const spriteByte = emulatorMediator.getUint8(baseAddress + row)

        for(let col = 0; col < 8; col++){
            const spritePixel = (spriteByte >> (7 - col)) & 1;

            const xOffset = (registerValueX + col) % 64;
            const yOffset = (registerValueY + row) % 32;

            const currentPixel = emulatorMediator.getPixel(yOffset, xOffset);
            const newPixel = spritePixel ^ currentPixel;

            emulatorMediator.setPixel(yOffset, xOffset, newPixel)

            if (currentPixel === 1 && newPixel === 0) {
                registers.setRegisterName("VF", 1);
            }
        }
    }
}

export const CallSub  = (instruction: number, registers: RegistersInterface, stack: MemoryInsterface) =>
{
    const currentStackPointer = registers.getRegister("SP")
    stack.setUint16(currentStackPointer, registers.getRegister("PC"))
    registers.setRegisterName("SP", currentStackPointer - 2)
    registers.setRegisterName("PC",(instruction & 0x0FFF))
}

export const AddLitToRegister  = (instruction: number, registers: RegistersInterface) =>
{
    const register = (instruction & 0x0F00) >> 8;
    const currentRegisterValue = registers.getRegisterByInstruction(register);
    const literal = (instruction & 0x00FF)
    const sum = literal + currentRegisterValue
    registers.setRegisterByInstruction(register, (sum & 0xFF));
}

export const NotEqualsLit  = (instruction: number, registers: RegistersInterface) =>
{
    const register = (instruction & 0x0F00) >> 8;
    const currentRegisterValue = registers.getRegisterByInstruction(register);
    const literalValue = (instruction & 0x00FF);
    const currentPC = registers.getRegister("PC")
    if(currentRegisterValue != literalValue) registers.setRegisterName("PC",  currentPC + 2)
}

export const EqualsLit  = (instruction: number, registers: RegistersInterface) =>
{
    const register = (instruction & 0x0F00) >> 8;
    const currentRegisterValue = registers.getRegisterByInstruction(register);
    const literalValue = (instruction & 0x00FF);
    const currentPC = registers.getRegister("PC")
    if(currentRegisterValue == literalValue) registers.setRegisterName("PC",  currentPC + 2)
}

export const NotEquals  = (instruction: number, registers: RegistersInterface) =>
{
    const registerX = (instruction & 0x0F00) >> 8;
    const currentRegisterX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const currentRegisterY = registers.getRegisterByInstruction(registerY);
    const currentPC = registers.getRegister("PC")
    if(currentRegisterX != currentRegisterY) registers.setRegisterName("PC",  currentPC + 2)
}

export const Equals  = (instruction: number, registers: RegistersInterface) =>
{
    const registerX = (instruction & 0x0F00) >> 8;
    const currentRegisterX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const currentRegisterY = registers.getRegisterByInstruction(registerY);
    const currentPC = registers.getRegister("PC")
    if(currentRegisterX == currentRegisterY) registers.setRegisterName("PC",  currentPC + 2)
}

export const MovLitReg  = (instruction: number,  registers: RegistersInterface) =>
{
    console.log("MOV_LIT_REG")
    const register = (instruction & 0x0F00) >> 8;
    const literal =  (instruction & 0x00FF)
    registers.setRegisterByInstruction(register, literal)
}
export const JumpOffset  = (instruction: number, registers: RegistersInterface) =>
{
    const base = registers.getRegister("V0")
    registers.setRegisterName("PC", base + (instruction & 0x0FFF))
}

export const Random  = (instruction: number, registers: RegistersInterface) =>
{
    const register = (instruction & 0x0F00) >> 8;
    const literal =  (instruction & 0x00FF)
    const randomNum = Math.floor(Math.random() * 256)
    const result = randomNum & literal
    registers.setRegisterByInstruction(register, result)
}