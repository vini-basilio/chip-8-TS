export type CreateMemory = (sizeBytes: number) => DataView

export interface ScreenDeviceInterface {

    columns: number;
    rows: number;
    squareSide: number;
    vram: number[][]
    canvas: HTMLCanvasElement;

    getPixel(rows: number, cols: number): number
    setPixel(rows: number, cols: number, state: number): void
    DrawScreen(): void
}

export interface MemoryMapperInterface  {
    regions: Region[];
    memory: DataView;

    map(newDevice: Region): void
    getUint8(address: number): number
    getUint16(address: number): number
    setUint8(address: number, value: number): void
    setUint16(address: number, value: number): void
}
export type Region = {
    start: number;
    end: number;
    remap: boolean;
}