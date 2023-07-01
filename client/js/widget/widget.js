import { Core } from "../core";
import { SystemEventsManager } from "../system-events-manager";

export class Widget {
    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_Core, _SystemEventsManager) {
        let globalThis = this;
        this.Core = _Core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: ['widget-item']});

        this.Type = _Core.FormType.WidgetWindow;

        _Core.LIB.bindEvents(this.MainControl, {
            mousedown: function(event) {
                event.stopPropagation();
            }
        });

        _SystemEventsManager.event.add('widgetclose', function() {
            globalThis.close();
        });

        this.isShow = false;
    }

    #private_WidgetStored = {
        iconElement: null
    }

    render() {
        return this.MainControl;
    }

    close() {
        let globalThis = this;
        if (globalThis.isShow) {
            globalThis.Core.effector(this.MainControl).hideSwipe({queue: 'widget_eff', type: 'bottom'});
            globalThis.isShow = false;
            let element = globalThis.#private_WidgetStored.iconElement;
            if (element) {
                element.classList.remove('active');
            }
        }
    }

    open(event, element) {
        let parentPanel = this.MainControl.parentElement,
            globalThis = this;
        parentPanel.classList.remove('taskbar-widget', 'window-widget');
        if (globalThis.Type == globalThis.Core.FormType.WidgetTasbar) {
            parentPanel.classList.add('taskbar-widget');
        }
        else {
            parentPanel.classList.add('window-widget');
        }
        globalThis.Core.effector(globalThis.MainControl).showSwipe({queue: 'widget_eff', type: 'bottom'});
        globalThis.isShow = true;
        if (element) {
            element.classList.add('active');
            globalThis.#private_WidgetStored.iconElement = element;
        }
    }
}