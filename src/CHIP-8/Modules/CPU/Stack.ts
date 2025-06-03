import {StackInterface} from "../../Interfaces/Contracts";
import {CreateMemory} from "../Memory/CreateMemory";

export class Stack implements StackInterface{
    stack: DataView;
    constructor(sizeStack: number) {
        this.stack = CreateMemory(sizeStack * 2)
    }

    getUint16(bytes: number): number {
        return this.stack.getUint16(bytes)
    }

    getUint8(bytes: number): number {
        return this.stack.getUint8(bytes)
    }

    setUint16(bytes: number, value: number): void {
        this.stack.setUint16(bytes, value)
    }

    setUint8(bytes: number, value: number): void {
        this.stack.setUint8(bytes, value)
    }
    stackState(){
        const stackState = []
        for(let i = 0; i < this.stack.byteLength; i += 2 ){
            const cc = this.stack.getUint16(i)
            stackState.push(cc.toString(16).padStart(4, '0x').toUpperCase());
        }
        return stackState;
    }
}