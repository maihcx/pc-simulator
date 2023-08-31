import { Core } from "../../core";
import { SystemEventsManager } from "../../system-events-manager";
import { WindowExt } from "../../window-ext/window-ext";

export class FileExplorer extends WindowExt {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     * 
     */
    constructor(core, systemEventsManager) {
        super(core, systemEventsManager);

        this.Type = core.FormType.Window;

        let globalThis = this;
        this.MainControl.classList.add('start-menu');
        this.appName = 'File Explorer';
        this.appId = 'file-explorer';
    }
}