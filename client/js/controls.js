import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";
import { Locales } from "./locales";

export class Controls {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     * @param {Locales} locales 
     */
    constructor(core, systemEventsManager, locales) {
        let globalThis = this;
        this.core = core;
        this.systemEventsManager = systemEventsManager;
        this.locales = locales;
        
        this.MainControl = core.LIB.nodeCreator({node: 'div', classList: 'control-element'});

        // #region properties

        this.properties = {
            // #region active state
            get active() {
                return globalThis.MainControl.classList.contains('active');
            },
            set active(activeStatus) {
                let mainCtrlClass = globalThis.MainControl.classList;
                if (activeStatus) {
                    mainCtrlClass.add('active');
                }
                else {
                    mainCtrlClass.remove('active');
                }
            }
            // #endregion

            // #region appInfor
            ,get appInfor() {
                return globalThis.#private_Storage.appInfor;
            },
            set appInfor(objAppInfor = globalThis.#private_Storage.appInfor) {
                globalThis.#private_Storage.appInfor = objAppInfor;
            }
            // #endregion
        }

        // #endregion

        this.appSession = {
            sessionCode: null,
            signDevCode: null
        }
    }

    #private_Storage = {appInfor: {
        appName: 'New App',
        appCode: '74876046e2337ba3880db747fb57a9e5'
    }};

    detroyEvents() {
        
    }

    detroyWindow() {

    }

    show() {
        this.MainControl.classList.add('show');
    }

    hide() {
        this.MainControl.classList.remove('show');
    }

    close() {
        this.detroyEvents();
        this.detroyWindow();
    }
}