import { Core } from "../core";
import { SystemEventsManager } from "../system-events-manager";
import { Widget } from "./widget";

export class WidgetStartMenu extends Widget {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        super(core, systemEventsManager);
        this.Type = core.FormType.WidgetTasbar;

        let globalThis = this;
        this.MainControl.classList.add('start-menu');

        core.CSSWidgetClassLoad(WidgetStartMenu);

        
    }
}