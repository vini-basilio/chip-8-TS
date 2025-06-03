import {DisplayAbstrat} from "../../Interfaces/Contracts";
import { CreateMemory } from "../Memory/CreateMemory";

export default class Display extends DisplayAbstrat{
    columns: number;
    rows: number;
    squareSide: number;
    vram: DataView;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, memorySize: number ) {
        super(canvas, memorySize);
        this.columns = 64;
        this.rows = 32;

        // "VRAM"
        this.vram = CreateMemory(memorySize)
        this.squareSide = 15;

        this.canvas = canvas;

        this.canvas.height = this.squareSide * this.rows;
        this.canvas.width = this.squareSide * this.columns;

    }

    getPixel(row: number, col: number){
        return  this.vram.getUint8(row * this.columns + col);
    }
    setPixel(row: number, col: number, state: number){
        this.vram.setUint8(row * this.columns + col, state)
    }
    ClearScreen(){
        for(let index = 0; index < this.rows * this.columns ; index++){
            this.vram.setUint8(index, 0)
        }
        this.DrawScreen();
    }
    DrawScreen() {

        if (this.canvas.getContext) {
            const ctx = this.canvas.getContext("2d");

            if(ctx){
                let row = 0;
                let col = 0;

                ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                for(let index = 0; index < this.rows * this.columns ; index++){

                    if (this.vram.getUint8(index) == 1) {
                        const x = col * this.squareSide;
                        const y = row * this.squareSide;

                        ctx.fillStyle = '#66FF66';
                        ctx.shadowColor = '#66FF66';
                        ctx.shadowBlur = 10;

                        ctx.fillRect(x, y, this.squareSide, this.squareSide)
                    }

                    if(col < this.columns - 1) {
                        col++
                    } else {
                        row++;
                        col = 0;
                    }
                }
            }
        }
    }
}