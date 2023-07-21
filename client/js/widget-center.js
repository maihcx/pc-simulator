import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class WidgetCenter {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        this.Core = core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: ['widget-frame']});
    }

    render() {
        return this.MainControl;
    }

    addWidget(widget) {
        this.MainControl.appendChild(widget.render());
    }
}