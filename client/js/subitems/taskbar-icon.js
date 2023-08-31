import { Core } from "../core";
import { SystemEventsManager } from "../system-events-manager";

export class IconControl {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        let globalThis = this;
        this.Core = core;
        this.MainControl = core.LIB.nodeCreator({node: 'div', classList: ['control-element', 'normal']});
        this.IconControl = core.LIB.nodeCreator({node: 'div', classList: ['icon-element']});
        // if (!core.LIB.isNullOrEmpty(IconClass)) {
        //     this.MainControl.classList.add(IconClass);
        // }
        this.MainControl.appendChild(this.IconControl);

        this.onOpen = {
            add: function(callback) {
                if (!callback) return false;
                globalThis.#private_IconStored.event.push(callback);
                return true;
            }
        }

        this.Control = null;
        this.controlType = IconControl.controlType.widget;

        this.Core.LIB.bindEvents(this.MainControl, {
            mousedown: function(event) {
                event.stopPropagation();
            },
            click: function(event) {
                event.stopPropagation();
                if (globalThis.controlType == IconControl.controlType.widget) {
                    if (globalThis.Control) {
                        if (!globalThis.Control.isShow) {
                            systemEventsManager.eventTriger('widgetclose');
                            globalThis.Control.open(null, globalThis.MainControl);
                        }
                        else {
                            systemEventsManager.eventTriger('widgetclose');
                        }
                    }
                    else {
                        systemEventsManager.eventTriger('widgetclose');
                    }
                }
                else if (globalThis.controlType == IconControl.controlType.window) {
                    if (globalThis.Control) {
                        if (!globalThis.Control.isShow) {
                            systemEventsManager.eventTriger('blurallwindows');
                            globalThis.Control.open(null, globalThis.MainControl);
                        }
                        else {
                            systemEventsManager.eventTriger('blurallwindows');
                        }
                    }
                    else {
                        systemEventsManager.eventTriger('blurallwindows');
                    }
                }
                let events = globalThis.#private_IconStored.event;
                if (events.length) {
                    events.forEach(event => {
                        event && (event(globalThis));
                    });
                }
            }
        });
    }

    setIconSVG(iconLink) {
        this.IconControl.style.backgroundImage = `url(${iconLink})`;
    }

    #private_IconStored = {
        event: []
    }

    render() {
        return this.MainControl;
    }

    static controlType = {
        widget: 0,
        window: 1
    }
}