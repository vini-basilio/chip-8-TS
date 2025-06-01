export default class CHIP8Screen {

    columns: number;
    rows: number;

    pixelsState : number[][]

    squareSide: number;

    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {


        const BACKGROUND_COLOR = "background-color: #1a1a1a";

        this.columns = 64;
        this.rows = 32;

        // "VRAM"
        this.pixelsState = this.CreateScreenInitialState(this.rows, this.columns)
        this.squareSide = 15;

        this.canvas = canvas;

        this.canvas.height = this.squareSide * this.rows;
        this.canvas.width = this.squareSide * this.columns;

        // @ts-ignore
        this.canvas.style = BACKGROUND_COLOR;

    }
    CreateScreenInitialState = (rows: number, cols: number): number[][] => {

        const state: number[][] = new Array(rows)
        for(let i = 0; i < rows; i++){
            state[i] = new Array(cols).fill(0)
        }
        return state;
    }

    getPixel(rows: number, cols: number){
        const row  = this.pixelsState[rows]

        const result  = row[cols]
        return  result;

    }
    setPixel(rows: number, cols: number, state: number){
            this.pixelsState[rows][cols] = state;
    }

    DrawScreen = () => {

        if (this.canvas.getContext) {
            const ctx = this.canvas.getContext("2d");

            if(ctx){
                let row = 0;
                let col = 0;

                ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                for(let index = 0; index < this.rows * this.columns ; index++){

                    ctx.fillStyle = 'transparent';
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;

                    if (this.pixelsState[row][col] == 1) {
                        let x = col * this.squareSide;
                        let y = row * this.squareSide;

                        ctx.fillRect(x, y, this.squareSide, this.squareSide);
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