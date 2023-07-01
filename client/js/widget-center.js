import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class WidgetCenter {
    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_Core, _SystemEventsManager) {
        this.Core = _Core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: ['widget-frame']});
    }

    render() {
        return this.MainControl;
    }

    addWidget(widget) {
        this.MainControl.appendChild(widget.render());
    }
}