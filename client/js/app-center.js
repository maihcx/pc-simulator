import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";
import { ControlTypes } from "./enum/control-types";
import { SystemColors } from "./system-colors";

export class AppCenter {
    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     * @param {SystemColors} systemColors 
     */
    constructor(core, systemEventsManager, systemColors) {
        this.Core = core;
        this.WidgetFrame = this.Core.LIB.nodeCreator({node: 'div', classList: ['widget-frame']});
        this.WindowFrame = this.Core.LIB.nodeCreator({node: 'div', classList: ['window-frame']});

        this.controls = {};
        this.SystemColors = systemColors;
    }

    show() {
        return [this.WidgetFrame, this.WindowFrame];
    }

    addControl(controlGroup, controlType, controlContent) {
        controlType = controlType.name;
        (!this.controls[controlGroup]) && (this.controls[controlGroup] = {});
        (!this.controls[controlGroup][controlType]) && (this.controls[controlGroup][controlType] = {});

        let key = this.Core.LIB.keyCreator();
        this.controls[controlGroup][controlType][key] = controlContent;
        controlContent.appKey = key;
        controlContent.render().dataset.appKey = key;

        if (controlGroup == ControlTypes.Widget) {
            this.WidgetFrame.append(controlContent.render());
        }
        else if (controlGroup == ControlTypes.Window) {
            this.WindowFrame.append(controlContent.render());
        }

        this.SystemColors.applyBlurFilter(controlContent.render());
        this.SystemColors.applyBackgroundColor(this.SystemColors.Colors.level.level3, controlContent.render());
        this.SystemColors.applyBorderColor(this.SystemColors.Colors.level.level5, controlContent.render());
    }

    getControl(controlGroup = null, controlType = null, controlKey = null) {
        if (!controlGroup && controlGroup !== 0) return false;
        let controlByGroup = this.controls[controlGroup];
        if (controlByGroup && controlType && controlKey) {
            return controlByGroup[controlType.name][controlKey];
        }
        if (controlByGroup && controlType) {
            return controlByGroup[controlType.name];
        }
        return controlByGroup;
    }
}