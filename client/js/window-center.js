import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class WindowCenter {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        this.Core = core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: ['window-frame']});
    }

    render() {
        return this.MainControl;
    }

    addWindow(window) {
        this.MainControl.appendChild(window.render());
    }
}