import {CpuMediatorInterface, EventEmitterIOInterface} from "../../Interfaces/Contracts";
import {EmulatorMediator} from "../EmulatorMediator/EmulatorMediator";
import * as IN from "./Instructions/implementations/OriginalImplementation";

export class ControlUnit {
    TIMER_INTERVAL: number;
    CPU_CYCLES_PER_FRAME: number;
    lastTimerUpdate: number;

    constructor(
        private cpuEmulatorMediator: CpuMediatorInterface,
        private emulatorMediator: EmulatorMediator,
        private emitter: EventEmitterIOInterface
    ) {
        this.TIMER_INTERVAL = 1000 / 60
        this.CPU_CYCLES_PER_FRAME = 8
        this.lastTimerUpdate = performance.now()
        emitter.on("start", () => {
            this.loop()
        });
    };

    loop = () => {
        for (let i = 0; i < this.CPU_CYCLES_PER_FRAME; i++) {
            this.step()
        }
        const now = performance.now()
        if (now - this.lastTimerUpdate >= this.TIMER_INTERVAL) {
            this.cpuEmulatorMediator.TimersUpdate()
            this.lastTimerUpdate = now
            this.emulatorMediator.DrawScreen()
        }
        requestAnimationFrame(this.loop);
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

    decode(instruction: number) {
        return (instruction & 0xF000) >> 12;
    }

    execute(opcode: number, instruction: number) {
        switch (opcode) {
            case 0x0:
                return this.cpuEmulatorMediator.ZeroFamily(instruction, this.emulatorMediator)
            case 0x8:
                return this.cpuEmulatorMediator.BinaryFamily(instruction)
            case 0xD:
                return IN.Draw(instruction, this.cpuEmulatorMediator, this.emulatorMediator)
            case 0xE:
                return this.cpuEmulatorMediator.EFamily(instruction)
            case 0xF:
                return this.cpuEmulatorMediator.FFamily(instruction, this.emulatorMediator)
            case 0x5:
                return this.cpuEmulatorMediator.FiveFamily(instruction, this.emulatorMediator)
            default:
                return this.cpuEmulatorMediator.BaseFamily(opcode, instruction)
        }
    }

    // Atuamente, ainda nao tenho ciclos automaticos, torna mais facil debugar
    step() {
        const instruction = this.fetch();
        const opcode = this.decode(instruction);
        this.execute(opcode, instruction)
    }

    debug() {
        const registers = this.cpuEmulatorMediator.registerState()
        const stackState = this.cpuEmulatorMediator.stackState()
        return [registers, stackState];
    }
}