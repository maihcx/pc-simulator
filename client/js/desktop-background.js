import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";

export class DesktopBackground {
    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_MainService, _SystemEventsManager) {
        let globalThis = this;
        this.internal_event = _SystemEventsManager;
        this.MainService = _MainService;
        this.MainControl = this.MainService.LIB.nodeCreator({node: 'div', classList: 'desktop-background', dataset: {scaleType: '0'}});
        this.BackgroundImageElement = this.MainService.LIB.nodeCreator({node: 'img', classList: 'desktop-background-img'});
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

    setBackgroundImage(fileName) {
        let file = `${this.BackgroundImageFolder}${fileName}`,
            globalThis = this
        ;
        var img = new Image();
        img.src = file;
        img.onload = function () {
            globalThis.BackgroundImageElement.src = img.src;
            globalThis.internal_event.eventTriger('backgroundchange', globalThis.BackgroundImageElement);
        }
    }

    setBackgroundImageScale(scaleType) {
        if (this.MainControl.dataset.scaleType != scaleType) {
            this.MainControl.dataset.scaleType = scaleType;
        }
    }
}