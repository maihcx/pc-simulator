import { LocalStored } from "./local-stored";
import { SystemEventsManager } from './system-events-manager';
import { Core } from './core';
import { Desktop } from './desktop';
import { Display } from './display';
import { Taskbar } from './taskbar';
import { DesktopBackground } from './desktop-background';
import { Locales } from './locales';
import { SystemColors } from './system-colors';
import { IconControl } from './subitems/taskbar-icon';
import { CenterConsole } from "./center-console";
import { AppCenter } from "./app-center";
import { ControlTypes } from "./enum/control-types";

import { WidgetStartMenu } from "./widget/widget-start-menu";
import { FileExplorer } from "./app/file-explorer/file-explorer";

window.onload = async function() {
    const eventManager = new SystemEventsManager(),
          core = new Core(),
          locales = new Locales(core, eventManager)
    ;
    

    core.LIB.queueExcuteTasking([
        function(resolve) {
            // load language
            locales.load(function() {
                console.log('language ready');
                resolve();
            });
        }, function(masterResolve) {
            const display = new Display(core, eventManager),
                  systemColors = new SystemColors(core, eventManager),
                  desktop = new Desktop(core, eventManager),
                  desktopBackground = new DesktopBackground(core, eventManager),
                  consolebar = new CenterConsole(core, eventManager, locales),
                  taskbar = new Taskbar(core, eventManager),
                  appCenter = new AppCenter(core, eventManager, systemColors)
                ;

            // class load
            core.CSSControlClassLoad(Display);
            core.CSSControlClassLoad(Desktop);
            core.CSSControlClassLoad(DesktopBackground);
            core.CSSControlClassLoad(CenterConsole);
            core.CSSControlClassLoad(Taskbar);
            core.CSSControlClassLoad(AppCenter);
            
            core.LIB.queueExcuteTasking([
                function(resolve) {
                    // background image load
                    eventManager.event.add('colorchange', function(event, Colors) {
                        console.log('system color ready');
                        resolve();
                    });

                    eventManager.event.add('backgroundchange', function(event, Colors) {
                        console.log('background image ready');
                    });

                    desktopBackground.setBackgroundImage('wall1.jpg');
                    desktopBackground.setBackgroundImageScale(desktopBackground.BackgroundImageScaleType.Center);
                }, function(resolve) {
                    let taskbarElement = taskbar.getSubTaskbar(),
                        SVGFolder = './sources/icons/';
                
                    // taskbar icons
                    taskbarIconSetup();
                    // end taskbar icons
                
                    // set primary color for controls
                    consolebar.setAppCursorColor({
                        background: systemColors.getBackgroundColorClass(systemColors.Colors.level.level3),
                        hover: systemColors.getHoverColorClass(systemColors.Colors.level.level7),
                        textColor: systemColors.getTextColorClass(systemColors.Colors.level.level21)
                    });
                
                    systemColors.applyBlurFilter(taskbarElement, consolebar.appCursorGroup);
                    systemColors.applyBackgroundColor(systemColors.Colors.level.level3, taskbarElement, consolebar.appCursorGroup);
                    systemColors.applyBorderColor(systemColors.Colors.level.level5, taskbarElement, consolebar.appCursorGroup);
                
                    // init desktop widget
                    desktop.addControl(...appCenter.show());
                
                    // eventManager.event.add('systhemechanged', function(event, element) {
                        
                    // });
                    
                    function taskbarIconSetup() {
                        let smartIconInit = [];

                        let startIcon = new IconControl(core, eventManager, appCenter);
                        startIcon.setIconSVG(SVGFolder + 'window-icon.svg');
                        startIcon.controlType = ControlTypes.Widget;
                        startIcon.Control = WidgetStartMenu;
                        taskbar.TaskbarIcons.add(startIcon);
                        smartIconInit.push(startIcon.MainControl);
                
                        let searchIcon = new IconControl(core, eventManager, appCenter);
                        searchIcon.setIconSVG(SVGFolder + 'search-icon.svg');
                        taskbar.TaskbarIcons.add(searchIcon);
                        smartIconInit.push(searchIcon.MainControl);
                
                        let explorerIcon = new IconControl(core, eventManager, appCenter);
                        explorerIcon.setIconSVG(SVGFolder + 'folder-explorer.svg');
                        explorerIcon.controlType = ControlTypes.Window;
                        explorerIcon.Control = FileExplorer;
                        taskbar.TaskbarIcons.add(explorerIcon);
                        smartIconInit.push(explorerIcon.MainControl);
                
                        systemColors.applyActiveBackgroundColor(systemColors.Colors.level.level11, ...smartIconInit);
                        systemColors.applyHoverBackgroundColor(systemColors.Colors.level.level9, ...smartIconInit);
                    };
        
                    console.log('extension ready');
                    resolve();
                }, function(resolve) {
                    // locales.set(locales.languages.en_us);
                    console.log(locales.get('welcome'));
        
                    display.render(desktopBackground, consolebar, desktop, taskbar);
                    resolve();
                    masterResolve();
                }
            ])
        }
    ]);
}