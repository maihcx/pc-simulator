import { MainService } from "../main-service";

export class IconControl {
    /**
     * 
     * @param {MainService} _MainService 
     */
    constructor(_MainService, IconClass) {
        this.MainService = _MainService;
        this.MainControl = _MainService.LIB.nodeCreator({node: 'div', classList: ['control-element', 'icon-element']});
        if (!_MainService.LIB.isNullOrEmpty(IconClass)) {
            this.MainControl.classList.add(IconClass);
        }
    }

    render() {
        return this.MainControl;
    }
}