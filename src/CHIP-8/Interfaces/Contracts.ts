import {EmulatorMediator} from "../Modules/EmulatorMediator/EmulatorMediator";

export type CreateMemoryInterface = (sizeBytes: number) => DataView

export abstract class DisplayAbstrat implements DisplayMethods {
    protected canvas!: HTMLCanvasElement;
    protected memorySize!: number;

    constructor(canvas: HTMLCanvasElement, memorySize: number) {
        this.canvas = canvas;
        this.memorySize = memorySize;
    }

    abstract getPixel(rows: number, cols: number): number

    abstract setPixel(rows: number, cols: number, state: number): void

    abstract ClearScreen(): void

    abstract DrawScreen(): void
}

export interface DisplayMethods {

    getPixel(rows: number, cols: number): number

    setPixel(rows: number, cols: number, state: number): void

    ClearScreen(): void

    DrawScreen(): void
}

export interface MemoryInsterface {
    getUint8(bytes: number): number;

    setUint8(bytes: number, value: number): void;

    getUint16(bytes: number): number;

    setUint16(bytes: number, value: number): void;
}

export interface EmulatorMediatorInterface extends RomLoaderInterface,
    DisplayMethods,
    MemoryInsterface {
}

export interface RomLoaderInterface {
    LoaderListener(
        input: HTMLElement,
        output: HTMLElement,
        loadRom: (arr: Uint8Array) => void): void;
}

export interface StackInterface extends MemoryInsterface {
    stackState(): string[];

    StackSize(): number;
}

export interface RegistersInterface {
    registerState(): string[];

    getRegister(name: string): number;

    getRegisterByInstruction(register: number): number;

    setRegisterName(name: string, value: number): void;

    setRegisterByInstruction(register: number, literal: number): void;
}

export interface CpuMediatorInterface extends RegistersInterface {
    stackState(): string[];

    TimersUpdate(): void;

    LongMode(address: number): void;

    SetRegistersInitalState(): void;

    FiveFamily(instruction: number, emulatorMediator: EmulatorMediator): void

    ZeroFamily(instruction: number, display: EmulatorMediator): void;

    BinaryFamily(instruction: number): void;

    BaseFamily(opcode: number, instruction: number): void;

    FFamily(instruction: number, emulatorMediator: EmulatorMediatorInterface): void;

    EFamily(instruction: number): void;
}

export interface EventEmitterIOInterface {
    on(event: string, listener: CallableFunction): void

    emit(event: string, ...args: unknown[]): void
}