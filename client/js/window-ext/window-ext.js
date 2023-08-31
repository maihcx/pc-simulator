import { Core } from "../core";
import { SystemEventsManager } from "../system-events-manager";

export class WindowExt {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        let globalThis = this;
        this.Core = core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: ['window-item', 'focus']});

        this.Type = core.FormType.WidgetWindow;

        core.LIB.bindEvents(this.MainControl, {
            mousedown: function(event) {
                event.stopPropagation();

                globalThis.MainControl.classList.add('focus');
            }
        });

        systemEventsManager.event.add('blurallwindow', function() {
            globalThis.blur();
        });

        this.isFocus = false;
        this.isShow = false;
        this.SEC_appId = 'window-ext';
        this.SEC_appName = 'Window Ext';

        this.Core.CSSLoadCustom(`./client/js/window-ext/`, WindowExt);
    }

    get appId() {
        return this.SEC_appId;
    }
    set appId(value) {
        this.SEC_appId = value;
        this.Core.CSSLoadCustom(`./client/js/app/${value}/`, this.constructor);
    }

    get appName() {
        return this.SEC_appName;
    }
    set appName(value) {
        this.SEC_appName = value;
    }

    #private_WindowStored = {
        iconElement: null
    }

    render() {
        return this.MainControl;
    }

    blur() {
        let globalThis = this;
        if (globalThis.isFocus) {
            globalThis.MainControl.classList.remove('focus');
            // globalThis.Core.effector(this.MainControl).hideSwipe({queue: 'widget_eff', type: 'bottom'});
            globalThis.isFocus = false;
            let element = globalThis.#private_WindowStored.iconElement;
            if (element) {
                element.classList.remove('active');
            }
        }
    }

    open(event, element) {
        let globalThis = this;
        globalThis.Core.effector(globalThis.MainControl).showSwipe({queue: 'widget_eff', type: 'bottom'});
        globalThis.isShow = true;
        
        if (element) {
            element.classList.add('active');
            globalThis.#private_WindowStored.iconElement = element;
        }
    }
}