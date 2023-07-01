import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class Desktop {
    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_Core, _SystemEventsManager) {
        let global_this = this;
        this.Core = _Core;
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