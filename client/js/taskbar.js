import { MainService } from "./main-service";

export class Taskbar {
    /**
     * 
     * @param {MainService} _MainService 
     */
    constructor(_MainService) {
        let global_this = this;
        this.MainService = _MainService;
        this.MainControl = this.MainService.LIB.nodeCreator({node: 'div', classList: 'taskbar-view'});
        this.TaskbarIcons = {
            add: function(TIconElement) {
                global_this.MainControl.appendChild(TIconElement.render());
            }
        }
    }

    render() {
        return this.MainControl;
    }
}