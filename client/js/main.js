import { MainService } from './main-service';
import { Desktop } from './desktop';
import { Display } from './display';
import { Taskbar } from './taskbar';
import { DesktopBackground } from './desktop-background';

window.onload = function() {
    const mainService = new MainService(),
          display = new Display(mainService),
          desktop = new Desktop(mainService),
          desktopBackground = new DesktopBackground(mainService),
          taskbar = new Taskbar(mainService)
    ;

    mainService.CSSClassLoad(Display);
    mainService.CSSClassLoad(Desktop);
    mainService.CSSClassLoad(DesktopBackground);
    mainService.CSSClassLoad(Taskbar);

    display.render(desktopBackground, desktop, taskbar)

    desktopBackground.setBackgroundImage('1.jpg');
    desktopBackground.setBackgroundImageScale(desktopBackground.BackgroundImageScaleType.Center)
}