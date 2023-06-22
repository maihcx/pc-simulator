import { MainService } from './main-service';
import { Desktop } from './desktop';
import { Display } from './display';
import { Taskbar } from './taskbar';
import { DesktopBackground } from './desktop-background';
import { Locales } from './locales';
import { SystemEventsManager } from './system-events-manager';
import { SystemColors } from './system-colors';

window.onload = function() {
    const eventManager = new SystemEventsManager(),
          mainService = new MainService(),
          locales = new Locales(mainService, eventManager),
          display = new Display(mainService, eventManager),
          systemColors = new SystemColors(mainService, eventManager),
          desktop = new Desktop(mainService, eventManager),
          desktopBackground = new DesktopBackground(mainService, eventManager),
          taskbar = new Taskbar(mainService, eventManager)
    ;

    mainService.CSSClassLoad(Display);
    mainService.CSSClassLoad(Desktop);
    mainService.CSSClassLoad(DesktopBackground);
    mainService.CSSClassLoad(Taskbar);

    display.render(desktopBackground, desktop, taskbar);

    desktopBackground.setBackgroundImage('1.jpg');
    desktopBackground.setBackgroundImageScale(desktopBackground.BackgroundImageScaleType.Center);

    // locales.set(locales.languages.en_us);
    console.log(locales.get('welcome'));

    // set primary color for controls
    let taskbarElement = taskbar.getSubTaskbar();
    eventManager.event.add('colorchange', function(event, Colors) {
        systemColors.applyBlurFilter(taskbarElement);
        systemColors.applyBackgroundColor(systemColors.Colors.Color_2, taskbarElement);
        systemColors.applyBorderColor(systemColors.Colors.Color_3, taskbarElement);
        // systemColors.applyPrimaryColor(taskbarElement);
    }, {once: true})
}