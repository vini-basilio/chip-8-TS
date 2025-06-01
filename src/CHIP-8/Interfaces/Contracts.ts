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