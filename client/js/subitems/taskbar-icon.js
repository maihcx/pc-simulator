import { MainService } from "../main-service";

export class IconControl {
    /**
     * 
     * @param {MainService} _MainService 
     */
    constructor(_MainService) {
        let globalThis = this;
        this.MainService = _MainService;
        this.MainControl = _MainService.LIB.nodeCreator({node: 'div', classList: ['control-element', 'normal']});
        this.IconControl = _MainService.LIB.nodeCreator({node: 'div', classList: ['icon-element']});
        // if (!_MainService.LIB.isNullOrEmpty(IconClass)) {
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

        this.MainService.LIB.bindEvents(this.MainControl, {
            mouseup: function() {
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