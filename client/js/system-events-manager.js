export class SystemEventsManager {
    constructor() {
        let globalThis = this;
        this.event = {
            add: function(type, callback, option = null) {
                !globalThis.#private_EventStored[type] && (globalThis.#private_EventStored[type] = []);
                globalThis.#private_EventStored[type].push({callback: callback, option: option});
            }
        }
        this.TimerEvent = {
            set: function(key = 'sys_timing') {
                return {
                    setEvent(event) {
                        globalThis.#private_TimerStored.event[key] = event;
                        return this;
                    }, run() {
                        clearTimeout(globalThis.#private_TimerStored.timer[key]);
                        globalThis.#private_TimerStored.timer[key] = setTimeout(() => {
                            globalThis.#private_TimerStored.event[key]();
                        }, 200);
                        
                        return this;
                    }
                }

            }
        }
    }

    #private_EventStored = {}
    #private_TimerStored = {event: {}, timer: {}}

    eventTriger(evType, ...eventData) {
        if (!this.#private_EventStored[evType]) return false;
        let evStored = this.#private_EventStored[evType];
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