import {MemoryInsterface, RegistersInterface, StackInterface} from "../../../Interfaces/Contracts";
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

export const CallRet = (registers: RegistersInterface, stack: StackInterface)=> {
    const stackPointer = registers.getRegister("SP")
    const stackPCValue = stack.getUint16(stackPointer)
    registers.setRegisterName("PC", stackPCValue)
    registers.setRegisterName("SP", stackPointer + 2)
}

export const RegYToRegX = (instruction: number, registers: RegistersInterface) => {
    // Carrega no REG X o valor do REG Y
    const registerX = (instruction & 0x0F00) >> 8;
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    registers.setRegisterByInstruction(registerX, registerValueY)
}

export const RegXOrRegY = (instruction: number, registers: RegistersInterface) => {
    // Seta o REG X com valor da operacao REG X OR REG Y
    // Y nao e afetado
    const registerX = (instruction & 0x0F00) >> 8;
    const registerValueX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    registers.setRegisterByInstruction(registerX, (registerValueX | registerValueY))
}
export const RegXAndRegY = (instruction: number, registers: RegistersInterface) => {
    // Seta o REG X com o valor da operacao REG X AND REG Y
    // Y nao e afetado
    const registerX = (instruction & 0x0F00) >> 8;
    const registerValueX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    registers.setRegisterByInstruction(registerX, (registerValueX & registerValueY))
}

export const RegXXorRegY = (instruction: number, registers: RegistersInterface) => {
    // Seta o REG X com o valor da operacao REG X XOR REG Y
    // Y nao e afetado
    const registerX = (instruction & 0x0F00) >> 8;
    const registerValueX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    registers.setRegisterByInstruction(registerX, (registerValueX ^ registerValueY))
}
export const RegXPlusRegY = (instruction: number, registers: RegistersInterface) => {
    // Adiciona ao REG X o valor REG X SUM REG Y
    // Diferente de 0x7, flag deve ser atualizado com overflow ou nao
    const registerX = (instruction & 0x0F00) >> 8;
    const registerValueX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);

    const sum = registerValueX + registerValueY;
    const overflow = sum > 255 ? 1 : 0;
    registers.setRegisterName("VF", overflow)
    registers.setRegisterByInstruction(registerX, (sum & 0xFF))
}

export const RegXMinusRegY = (instruction: number, registers: RegistersInterface) => {
    // Adiciona ao REG X o valor REG X - REG Y

    const registerX = (instruction & 0x0F00) >> 8;
    const registerValueX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);

    const diff = registerValueX - registerValueY;

    registers.setRegisterByInstruction(registerX, diff)
}

export const RegYMinusRegX = (instruction: number, registers: RegistersInterface) => {
    // Adiciona ao REG X o valor REG Y - REG X

    const registerX = (instruction & 0x0F00) >> 8;
    const registerValueX = registers.getRegisterByInstruction(registerX);
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    const diff = registerValueY - registerValueX;

    registers.setRegisterByInstruction(registerX, diff)
}

export const ShiftRight =  (instruction: number, registers: RegistersInterface) => {
    const registerX = (instruction & 0x0F00) >> 8;
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    registers.setRegisterName("VF", (registerValueY & 0x1))
    const result = registerValueY >> 1
    registers.setRegisterByInstruction(registerX, result)
}
export const ShiftLeft =  (instruction: number, registers: RegistersInterface) => {
    const registerX = (instruction & 0x0F00) >> 8;
    const registerY = (instruction & 0x00F0) >> 4;
    const registerValueY = registers.getRegisterByInstruction(registerY);
    registers.setRegisterName("VF", (registerValueY & 0x80) >> 7)
    const result = registerValueY << 1
    registers.setRegisterByInstruction(registerX, result)
}