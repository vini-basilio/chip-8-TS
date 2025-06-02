export type CreateMemoryInterface = (sizeBytes: number) => DataView

export interface ScreenDeviceInterface {

    getPixel(rows: number, cols: number): number
    setPixel(rows: number, cols: number, state: number): void
    ClearScreen(): void
    DrawScreen(): void
}

export interface MemoryMapperInterface  {
    regions: Region[];
    memory: DataView;

    map(
        device: any,
        start: number,
        end: number,
        remap: boolean
    ): void
    getUint8(address: number): number
    getUint16(address: number): number
    setUint8(address: number, value: number): void
    setUint16(address: number, value: number): void
}
export type Region = {
    device: any;
    start: number;
    end: number;
    remap: boolean;
}