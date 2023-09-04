import { Core } from "../core";
import { SystemEventsManager } from "../system-events-manager";
import { AppCenter } from "../app-center";
import { ControlTypes } from "../enum/control-types";

export class IconControl {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     * @param {AppCenter} appCenter 
     */
    constructor(core, systemEventsManager, appCenter) {
        let globalThis = this;
        this.Core = core;
        this.SystemEventsManager = systemEventsManager;
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
        this.controlType = ControlTypes.Widget;
        this.AppCenter = appCenter;

        this.Core.LIB.bindEvents(this.MainControl, {
            mousedown: function(event) {
                event.stopPropagation();
            },
            click: function(event) {
                event.stopPropagation();

                let controlType = globalThis.Control,
                    controlContent = appCenter.getControl(globalThis.controlType, controlType)
                ;

                if (controlType) {
                    if (controlContent && (!event.shiftKey || globalThis.controlType === ControlTypes.Widget)) {
                        let controlKeys = Object.keys(controlContent);
                        if (controlKeys.length == 1) {
                            controlContent = controlContent[controlKeys[0]];
                        }
                        else {
                            controlContent = controlContent[controlKeys[0]];
                        }
                    }
                    else {
                        controlContent = new globalThis.Control(globalThis.Core, globalThis.SystemEventsManager);
                        appCenter.addControl(globalThis.controlType, controlType, controlContent);
                    }
                }

                systemEventsManager.eventTriger('blurallwindows', controlContent);
                systemEventsManager.eventTriger('widgetclose', controlContent);
                if (controlType) {
                    controlContent.open(null, globalThis.MainControl);
                }
                if (globalThis.controlType == ControlTypes.Window) {
                    controlContent.focus();
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