import { MainService } from "./main-service";

export class Desktop {
    /**
     * 
     * @param {MainService} _MainService 
     */
    constructor(_MainService) {
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