import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";

export class Display {
    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_MainService, _SystemEventsManager) {
        this.MainService = _MainService;
    }

    render(...controls) {
        let my_render = this.MainService.LIB.nodeCreator({node: 'div', classList: 'main-window'}),
            controlsRender = [];
        controls.forEach(control => {
            this.MainService.Controls.add(control, control.constructor.name);
            controlsRender.push(control.render());
        });
        my_render.append(...controlsRender);
        document.body.appendChild(my_render);
    }
}