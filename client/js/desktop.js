import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";

export class Desktop {
    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_MainService, _SystemEventsManager) {
        let global_this = this;
        this.MainService = _MainService;
        this.MainControl = this.MainService.LIB.nodeCreator({node: 'div', classList: 'desktop-view'});
        this.DesktopIcons = {
            add: function(DIconElement) {
                global_this.MainControl.appendChild(DIconElement.render());
            }
        }
    }

    render() {
        return this.MainControl;
    }
}