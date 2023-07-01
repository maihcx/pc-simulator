import { Core } from "./core";

export class Control {
    /**
     * 
     * @param {Core} _Core 
     */
    constructor(_Core) {
        this.MainControl = _Core.LIB.nodeCreator({node: 'div', classList: 'control-element'})
    }
}