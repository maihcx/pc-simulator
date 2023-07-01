import { Core } from "../core";
import { SystemEventsManager } from "../system-events-manager";

export class IconControl {
    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_Core, _SystemEventsManager) {
        let globalThis = this;
        this.Core = _Core;
        this.MainControl = _Core.LIB.nodeCreator({node: 'div', classList: ['control-element', 'normal']});
        this.IconControl = _Core.LIB.nodeCreator({node: 'div', classList: ['icon-element']});
        // if (!_Core.LIB.isNullOrEmpty(IconClass)) {
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

        this.Widget = null;

        this.Core.LIB.bindEvents(this.MainControl, {
            mousedown: function(event) {
                event.stopPropagation();
            },
            click: function(event) {
                event.stopPropagation();
                if (globalThis.Widget) {
                    if (!globalThis.Widget.isShow) {
                        _SystemEventsManager.eventTriger('widgetclose');
                        globalThis.Widget.open(null, globalThis.MainControl);
                    }
                    else {
                        _SystemEventsManager.eventTriger('widgetclose');
                    }
                }
                else {
                    _SystemEventsManager.eventTriger('widgetclose');
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
}