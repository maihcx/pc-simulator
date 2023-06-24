import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";

export class Taskbar {
    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_MainService, _SystemEventsManager) {
        let global_this = this;
        this.MainService = _MainService;
        this.MainControl = this.MainService.LIB.nodeCreator({node: 'div', classList: 'taskbar-view'});
        this.Subcontrol = this.MainService.LIB.nodeCreator({node: 'div', classList: 'taskbar-view-content'});
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