import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class Taskbar {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        let global_this = this;
        this.Core = core;
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