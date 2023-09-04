import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class Display {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        let globalThis = this;
        this.Core = core;
        this.MainControl = core.LIB.nodeCreator({node: 'div', classList: 'main-window'});
        document.body.appendChild(this.MainControl);

        core.LIB.bindEvents(this.MainControl, {mousedown: function(event) {
            event.stopPropagation();
            systemEventsManager.eventTriger('widgetclose');
            systemEventsManager.eventTriger('blurallwindows');
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