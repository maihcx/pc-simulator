import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class Desktop {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        let global_this = this;
        this.Core = core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: 'desktop-view'});
        this.DesktopIcons = {
            add: function(DIconElement) {
                global_this.MainControl.appendChild(DIconElement.render());
            }
        }
    }

    render() {
        return this.MainControl;
    }

    addControl(...controls) {
        this.MainControl.append(...controls);
    }
}