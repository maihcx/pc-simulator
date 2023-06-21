import { MainService } from "./main-service";

export class Control {
    /**
     * 
     * @param {MainService} _MainService 
     */
    constructor(_MainService) {
        this.MainControl = _MainService.LIB.nodeCreator({node: 'div', classList: 'control-element'})
    }
}