import { Core } from "../core";
import { SystemEventsManager } from "../system-events-manager";
import { Widget } from "./widget";

export class WidgetStartMenu extends Widget {
    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_Core, _SystemEventsManager) {
        super(_Core, _SystemEventsManager);
        this.Type = _Core.FormType.WidgetTasbar;

        let globalThis = this;
        this.MainControl.classList.add('start-menu');

        _Core.CSSWidgetClassLoad(WidgetStartMenu);

        
    }
}