export class SystemEventsManager {
    constructor() {
        let globalThis = this;
        this.eventStored = {};
        this.event = {
            add: function(type, callback, option = null) {
                !globalThis.eventStored[type] && (globalThis.eventStored[type] = []);
                globalThis.eventStored[type].push({callback: callback, option: option});
            }
        }
    }

    eventTriger(evType, ...eventData) {
        if (!this.eventStored[evType]) return false;
        let evStored = this.eventStored[evType];
        if (evStored.length > 0) {
            for (let index = 0; index < evStored.length; index++) {
                const event_data = evStored[index];
                if (event_data) {
                    event_data.callback(this, ...eventData);
                    if (event_data.option) {
                        if (event_data.option.once) {
                            delete evStored[index];
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }
}