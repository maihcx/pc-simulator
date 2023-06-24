import { Locales } from "./locales";
import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";

export class CenterConsole {
    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager 
     * @param {Locales} _Locales 
     */
    constructor(_MainService, _SystemEventsManager, _Locales) {
        let globalThis = this,
            LIB = _MainService.LIB
        ;
        this.Locales = _Locales;
        this.MainService = _MainService;
        this.MainControl = LIB.nodeCreator({node: 'div', classList: 'center-console-view'});

        // render panels
        this.LeftControl = LIB.nodeCreator({node: 'div', classList: 'left-console-view-content'});
        this.CenterControl = LIB.nodeCreator({node: 'div', classList: 'center-console-view-content'});
        this.RightControl = LIB.nodeCreator({node: 'div', classList: 'right-console-view-content'});

        this.SystemAppNames = [
            'Desktop'
        ]

        this.appCursor = {
            add: function(appName, iconLink, title, windowApp) {
                let appCursors = globalThis.#private_Stored.appCursor,
                    AppPanel = null, AppIcon = null, AppTitle = null, AppWindow = null;
                if (!appCursors[appName]) {
                    AppPanel = LIB.nodeCreator({node: 'div', classList: ['app-cursor-item']});
                    AppIcon = LIB.nodeCreator({node: 'div', classList: ['icon-cursor-item'], style: {backgroundImage: `url(${iconLink})`}});
                    AppTitle = LIB.nodeCreator({node: 'div', classList: ['title-cursor-item'], textContent: title});
                    appCursors[appName] = {EAppPanel: AppPanel, EAppIcon: AppIcon, EAppTitle: AppTitle, AppWindow: AppWindow, isSystemApp: globalThis.SystemAppNames.indexOf(appName) != -1};

                    AppPanel.append(AppIcon, AppTitle);
                    globalThis.appCursorPanel.appendChild(AppPanel);
                }
            }
        }

        // center control cursor
        this.#private_MakeCenterCursor();

        // right control cursor
        this.#private_MakeRightCursor();

        this.MainControl.append(this.LeftControl, this.CenterControl, this.RightControl);
    }

    #private_Stored = {
        appCursor: {}
    }

    setAppOpened(app) {

    }

    #private_MakeRightCursor() {
        let globalThis = this,
            LIB = globalThis.MainService.LIB
        ;
        
        // datetime
        let dateTimeView = LIB.nodeCreator({node: 'div', classList: 'date-time-view'}),
            dateView = LIB.nodeCreator({node: 'div', classList: 'date-view'}),
            timeView = LIB.nodeCreator({node: 'div', classList: 'time-view'})
        ;
        dateTimeView.append(dateView, timeView);
        setInterval(() => {
            dateView.textContent = LIB.dateTimeNow('dd/mm/yy');
            timeView.textContent = LIB.dateTimeNow('h:i:s');
        }, 1000);

        this.RightControl.append(dateTimeView);
    }

    // makeAppCursor(iconLink, title) {

    // }

    #private_MakeCenterCursor() {
        let globalThis = this,
            LIB = globalThis.MainService.LIB
        ;
        // cursor app open
        this.appCursorPanel = LIB.nodeCreator({node: 'div', classList: 'app-cursor-panel'});
        this.appCursor.add('Desktop', './sources/icons/window-icon.svg', globalThis.Locales.get('desktop'), null);

        this.CenterControl.append(this.appCursorPanel);
    }

    render() {
        return this.MainControl;
    }

    getSubTaskbar() {
        return this.Subcontrol;
    }
    
    setTaskbarColor(color_str) {

    }
}