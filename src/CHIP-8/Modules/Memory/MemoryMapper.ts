/*
Esse recurso e legal. Achei nos tutoriais do https://www.youtube.com/@LowByteProductions

A ideia e que a funcao de map te devolva uma unmap function. Ou, unsubscribe

*/
import {MemoryMapperInterface, Region} from "../../Interfaces/Contracts";
export class MemoryMapper implements MemoryMapperInterface{
    regions: Region[];
    memory: DataView;

    constructor(memory: DataView) {
        this.regions = new Array();
        this.memory = memory
    }

    map(newDevice: Region){
        this.regions.unshift(newDevice);
    // unsubscribe fn
    return () =>  this.regions = this.regions.filter(x => x !== newDevice);
    }

    private findRegion(address: number){
        const region = this.regions.find(r => address >= r.start && address <= r.end)
        if(!region){
            throw new Error(`No memory region found for address ${address}`);
        }
        return region;
    }
    // agora precisamos reexportar as funcoes do DataView
    // Usaremos uma camada de acesso
    getUint16(address: number){
        const region = this.findRegion(address)
        const finalAddress = region.remap
        ? address - region.start : address;
        return this.memory.getUint16(finalAddress)
    }
    setUint16(address: number, value: number){
        const region = this.findRegion(address)
        const finalAddress = region.remap
            ? address - region.start : address;
        return this.memory.setUint16(finalAddress, value)
    }
    getUint8(address: number){
        const region = this.findRegion(address)
        const finalAddress = region.remap
            ? address - region.start : address;
        return this.memory.getUint8(finalAddress)
    }
    setUint8(address: number, value: number){
        const region = this.findRegion(address)
        const finalAddress = region.remap
            ? address - region.start : address;
        return this.memory.setUint8(finalAddress, value)
    }
}
