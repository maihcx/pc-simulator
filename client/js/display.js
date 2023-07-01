import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class Display {
    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_Core, _SystemEventsManager) {
        let globalThis = this;
        this.Core = _Core;
        this.MainControl = _Core.LIB.nodeCreator({node: 'div', classList: 'main-window'});
        document.body.appendChild(this.MainControl);

        _Core.LIB.bindEvents(this.MainControl, {mousedown: function(event) {
            event.stopPropagation();
            _SystemEventsManager.eventTriger('widgetclose');
        }})
    }

    render(...controls) {
        let controlsRender = [];
        controls.forEach(control => {
            this.Core.Controls.add(control, control.constructor.name);
            controlsRender.push(control.render());
        });
        this.MainControl.append(...controlsRender);
    }
}