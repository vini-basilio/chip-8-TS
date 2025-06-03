import {
        DisplayAbstrat,
        EmulatorMediatorInterface,
        RomLoaderInterface
} from "../../Interfaces/Contracts";

export class EmulatorMediator  implements EmulatorMediatorInterface {
    constructor(
        private ram: DataView,
        private display: DisplayAbstrat,
        private romLoader: RomLoaderInterface
        // private timer: Timer
    ) {}
    // RAM
    getUint8(bytes: number): number {
       return this.ram.getUint8(bytes);
    }
    setUint8(bytes: number, value: number): void {
        console.log("Rodei")
        this.ram.setUint8(bytes, value)
    }
    getUint16(bytes: number): number {
        return this.ram.getUint16(bytes);
    }
    setUint16(bytes: number, value: number): void {
        this.ram.setUint16(bytes, value)
    }
    private loadROM = (Uint8Buffer: Uint8Array)=> {
        Uint8Buffer.forEach((n: number, index: number) => {
            this.ram.setUint8(index + 0x200, n);
        })
    }
    // LoaderRomInput
    LoaderListener(
                input: HTMLElement,
                output: HTMLElement
    ){
        this.romLoader.LoaderListener(input, output, this.loadROM);
    }
    // Display
    ClearScreen(): void {
        this.display.ClearScreen();
    }

    DrawScreen(): void {
        this.display.DrawScreen();
    }

    getPixel(rows: number, cols: number): number {
        return this.display.getPixel(rows, cols)
    }

    setPixel(rows: number, cols: number, state: number): void {
        this.display.setPixel(rows, cols, state)
    }
}