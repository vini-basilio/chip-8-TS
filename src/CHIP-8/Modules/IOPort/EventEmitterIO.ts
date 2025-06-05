import {EventEmitterIOInterface} from "../../Interfaces/Contracts";

export class EventEmitterIO implements  EventEmitterIOInterface{
    private events: Map<string, CallableFunction[]>;
    constructor() {
        this.events = new Map<string, CallableFunction[]>()
    }

    on(event:string, listener: CallableFunction){
        if(!this.events.has(event)) this.events.set(event, [])
        const allEventsHandlers = this.events.get(event)
        allEventsHandlers.push(listener)
    }

    emit(event: string, ...args: unknown[]){
        if(!this.events.has(event)) return
        const listeners = this.events.get(event)
        console.log(this.events)
        for(const listener of listeners){
                listener(...args);
        }
    }
}