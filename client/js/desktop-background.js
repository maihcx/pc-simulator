import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class DesktopBackground {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        let globalThis = this;
        this.internal_event = systemEventsManager;
        this.Core = core;
        this.MainControl = this.Core.LIB.nodeCreator({node: 'div', classList: 'desktop-background', dataset: {scaleType: '0'}});
        this.BackgroundImageElement = this.Core.LIB.nodeCreator({node: 'img', classList: 'desktop-background-img'});
        this.MainControl.appendChild(this.BackgroundImageElement);
        this.BackgroundImageFolder = './sources/background-images/';
        this.BackgroundImageScaleType = {
            Stretch: 0,
            Fit: 1,
            Tile: 2,
            Center: 3
        }
    }

    render() {
       return this.MainControl;
    }

    setBackgroundImage(fileName, onComplete = null) {
        let file = `${this.BackgroundImageFolder}${fileName}`,
            globalThis = this
        ;
        var img = new Image();
        img.src = file;
        img.onload = function () {
            globalThis.BackgroundImageElement.src = img.src;
            globalThis.internal_event.eventTriger('backgroundchange', globalThis.BackgroundImageElement);
            onComplete && onComplete();
        }
    }

    setBackgroundImageScale(scaleType) {
        if (this.MainControl.dataset.scaleType != scaleType) {
            this.MainControl.dataset.scaleType = scaleType;
        }
    }
}