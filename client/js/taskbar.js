import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class Taskbar {
    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_Core, _SystemEventsManager) {
        let global_this = this;
        this.Core = _Core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: 'taskbar-view'});
        this.Subcontrol = this.Core.LIB.nodeCreator({node: 'div', classList: 'taskbar-view-content'});
        this.MainControl.appendChild(this.Subcontrol)
        this.TaskbarIcons = {
            add: function(TIconElement) {
                global_this.Subcontrol.appendChild(TIconElement.render());
            }
        }
    }

    render() {
        return this.MainControl;
    }

    getSubTaskbar() {
        return this.Subcontrol;
    }
    
    setTaskbarColor(color_str) {

    }
}