import { Locales } from "./locales";
import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class CenterConsole {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     * @param {Locales} locales 
     */
    constructor(core, systemEventsManager, locales) {
        let globalThis = this,
            LIB = core.LIB
        ;
        this.Locales = locales;
        this.Core = core;
        this.internal_event = systemEventsManager;
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
                let cursorStored = globalThis.#private_Stored,
                    appCursors = cursorStored.appCursor,
                    hoverCursorColor = cursorStored.appCursorColor.hover,
                    AppPanel = null, AppIcon = null, AppTitle = null, AppWindow = null;
                if (!appCursors[appName]) {
                    AppPanel = LIB.nodeCreator({node: 'div', classList: ['app-cursor-item']});
                    AppIcon = LIB.nodeCreator({node: 'div', classList: ['icon-cursor-item'], style: {backgroundImage: `url(${iconLink})`}});
                    AppTitle = LIB.nodeCreator({node: 'div', classList: ['title-cursor-item'], textContent: title});

                    if (hoverCursorColor) {
                        AppPanel.classList.add(hoverCursorColor);
                    }

                    windowApp.AppName = appName;
                    windowApp.AppPanel = AppPanel;
                    windowApp.AppIcon = AppIcon;
                    windowApp.AppTitle = AppTitle;
                    windowApp.isSystemApp = globalThis.SystemAppNames.indexOf(appName) != -1;
                    AppWindow = windowApp;

                    appCursors[appName] = {AppPanel: AppPanel, AppIcon: AppIcon, AppTitle: AppTitle, AppWindow: AppWindow, isSystemApp: AppWindow.isSystemApp};
                    // globalThis.#private_buildControlerForCursor(appCursors[appName]);

                    AppPanel.append(AppIcon, AppTitle);
                    globalThis.appCursorPanel.appendChild(AppPanel);

                    let activeOfApp = appCursors[appName].AppWindow.active;
                    appCursors[appName].AppWindow.active = function(appView) {
                        activeOfApp(appView);
                        globalThis.setActiveHeader(appView);
                    }
                    
                    LIB.bindEvents(AppPanel, {
                        click: function(event) {
                            event.stopPropagation();
                            appCursors[appName].AppWindow.active(appCursors[appName].AppWindow);
                        }
                    })
                }
                return appCursors[appName];
            }
        }

        // center control cursor
        this.#private_MakeCenterCursor();

        // right control cursor
        this.#private_MakeRightCursor();

        this.MainControl.append(this.LeftControl, this.CenterControl, this.RightControl);

        this.internal_event.event.add('themechanged', function(event, theme) {

        });
    }

    // #private_buildControlerForCursor(appCursor) {
    //     let control = {
    //         show: function() {

    //         }, hide: function() {

    //         }, close: function() {

    //         }, active: function() {
    //             appCursor.
    //         }, inActive: function() {

    //         }
    //     }
    //     appCursor.controler = control;
    // }

    #private_Stored = {
        appCursor: {},
        appCursorColor: {
            background: null,
            hover: null,
            textColor: null
        }
    }
    
    #private_getAllApp(withoutAppName = null) {
        let globalThis = this;
        return Object.fromEntries(Object.entries(globalThis.#private_Stored.appCursor).filter(([key, value]) => key !== withoutAppName));
    }

    #private_getApp(appName) {
        let globalThis = this;
        return globalThis.#private_Stored.appCursor[appName];
    }

    // setAppOpened(app) {

    // }
    
    // setActiveApp(app) {
    //     let globalThis = this;
    //     this.#private_getAllApp
    // }

    #private_MakeRightCursor() {
        let globalThis = this,
            LIB = globalThis.Core.LIB
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
            LIB = globalThis.Core.LIB
        ;
        // cursor app open
        this.appCursorGroup = LIB.nodeCreator({node: 'div', classList: 'app-cursor-group'});
        this.appCursorPanel = LIB.nodeCreator({node: 'div', classList: 'app-cursor-panel'});
        this.appCursorTitle = LIB.nodeCreator({node: 'div', classList: 'app-cursor-title', textContent: globalThis.Locales.get('applications')});
        this.internal_event.event.add('colorchange', function(event, Colors) {
            let desktopApp = globalThis.appCursor.add('Desktop', './sources/icons/window-icon.svg', globalThis.Locales.get('desktop'), {
                active: function(appView) {
                    let allApps = globalThis.#private_getAllApp();
                    for (let AppName in allApps) {
                        const app = allApps[AppName];
                        if (appView.AppName == AppName) {
                            appView.AppPanel.classList.add('active');
                        }
                        else {
                            app.hide();
                        }
                    }
                }
            });
            desktopApp.AppWindow.active(desktopApp.AppWindow);
        }, {once: true});
        
        // });
        this.appCursorGroup.append(this.appCursorTitle, this.appCursorPanel);
        this.CenterControl.append(this.appCursorGroup);
    }

    setActiveHeader(app) {
        app.AppPanel.classList.add(this.#private_Stored.appCursorColor.background);
    }

    render() {
        return this.MainControl;
    }
    
    setAppCursorColor(colorSet) {
        if (colorSet) {
            let old_back_class2apply = this.#private_Stored.appCursorColor.background,
                old_hover_class2apply = this.#private_Stored.appCursorColor.hover,
                old_textColor_class2apply = this.#private_Stored.appCursorColor.hover;

            let allApps = this.#private_getAllApp();
            for (let AppName in allApps) {
                const app = allApps[AppName];
                
                if (old_back_class2apply && app.AppPanel.classList.contains(old_back_class2apply)) {
                    app.AppPanel.classList.remove(old_back_class2apply);
                    app.AppPanel.classList.add(colorSet.background);
                }
                if (colorSet.hover) {
                    if (old_hover_class2apply && app.AppPanel.classList.contains(old_hover_class2apply)) {
                        app.AppPanel.classList.remove(old_hover_class2apply);
                    }
                    app.AppPanel.classList.add(colorSet.hover);
                }
            }

            if (old_textColor_class2apply) {
                this.MainControl.classList.remove(old_textColor_class2apply);
            }
            this.MainControl.classList.add(colorSet.textColor);

            colorSet.background && (this.#private_Stored.appCursorColor.background = colorSet.background);
            colorSet.hover && (this.#private_Stored.appCursorColor.hover = colorSet.hover);
            colorSet.textColor && (this.#private_Stored.appCursorColor.textColor = colorSet.textColor);
        }
    }
}