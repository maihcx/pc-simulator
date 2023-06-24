import { LocalStored } from "./local-stored";
import { SystemEventsManager } from './system-events-manager';
import { MainService } from './main-service';
import { Desktop } from './desktop';
import { Display } from './display';
import { Taskbar } from './taskbar';
import { DesktopBackground } from './desktop-background';
import { Locales } from './locales';
import { SystemColors } from './system-colors';
import { IconControl } from './subitems/taskbar-icon';
import { CenterConsole } from "./center-console";

window.onload = function() {
    const eventManager = new SystemEventsManager(),
          mainService = new MainService(),
          locales = new Locales(mainService, eventManager),
          display = new Display(mainService, eventManager),
          systemColors = new SystemColors(mainService, eventManager),
          desktop = new Desktop(mainService, eventManager),
          desktopBackground = new DesktopBackground(mainService, eventManager),
          consolebar = new CenterConsole(mainService, eventManager, locales),
          taskbar = new Taskbar(mainService, eventManager)
    ;

    mainService.CSSClassLoad(Display);
    mainService.CSSClassLoad(Desktop);
    mainService.CSSClassLoad(DesktopBackground);
    mainService.CSSClassLoad(CenterConsole);
    mainService.CSSClassLoad(Taskbar);

    desktopBackground.setBackgroundImage('wall1.jpg');
    desktopBackground.setBackgroundImageScale(desktopBackground.BackgroundImageScaleType.Center);

    // locales.set(locales.languages.en_us);
    console.log(locales.get('welcome'));

    let taskbarElement = taskbar.getSubTaskbar(),
        SVGFolder = './sources/icons/';

    //#taskbar icons

        taskbarIconSetup();

    //#end taskbar icons

    // set primary color for controls
    eventManager.event.add('colorchange', function(event, Colors) {
        systemColors.applyBlurFilter(taskbarElement);
        systemColors.applyBackgroundColor(systemColors.Colors.level.level2, taskbarElement);
        systemColors.applyBorderColor(systemColors.Colors.level.level9, taskbarElement);
        // systemColors.applyPrimaryColor(taskbarElement);

        display.render(desktopBackground, consolebar, desktop, taskbar);
    }, {once: true});

    eventManager.event.add('systhemechanged', function(event, element) {
        
    });

    
    function taskbarIconSetup() {
        let startIcon = new IconControl(mainService);
        startIcon.setIconSVG(SVGFolder + 'window-icon.svg');
        taskbar.TaskbarIcons.add(startIcon);

        let searchIcon = new IconControl(mainService);
        searchIcon.setIconSVG(SVGFolder + 'search-icon.svg');
        taskbar.TaskbarIcons.add(searchIcon);

        let explorerIcon = new IconControl(mainService);
        explorerIcon.setIconSVG(SVGFolder + 'folder-explorer.svg');
        taskbar.TaskbarIcons.add(explorerIcon);
    };
}