import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";

export class Locales {

    /**
     * 
     * @param {Core} core 
     * @param {SystemEventsManager} systemEventsManager 
     */
    constructor(core, systemEventsManager) {
        this.Core = core;
        this.languages = {
            vi_vn: {id: 'vi_vn', lang: 'vi-vn', name: 'Tiếng Việt - Việt Nam'},
            en_us: {id: 'en_us', lang: 'en-us', name: 'English - United States'},
        };
        this.default = this.languages.en_us;
        this.displayLang = this.getCurrentLang();
        this.localesFolder = './client/js/langs/';
        this.localesFile = `${this.localesFolder}${this.displayLang.lang}.json`;
        this.LanguageData = {};
        // this.load();
    }

    #private_CustomLangs = []

    getCurrentLang() {
        return this.languages[localStorage.getItem("locales") ?? this.default.id]
    }

    set(lang = null) {
        if (lang) {
            localStorage.setItem("locales", lang.id);

            this.load();
        }
    }

    get(keyword) {
        return this.LanguageData[keyword];
    }

    load(onComplete = null) {
        this.displayLang = this.getCurrentLang();
        this.localesFile = `${this.localesFolder}${this.displayLang.lang}.json`;
        let globalThis = this;

        this.Core.LIB.queueExcuteTasking([
            function(resolve) {
                globalThis.Core.LIB.XHRSendRequest({
                    method: 'GET', url: globalThis.localesFile, async: true,
                    event: {
                        done: function(obj) {
                            obj && (globalThis.LanguageData = JSON.parse(obj.data));

                            resolve();
                        }
                    }
                })
            }, function(resolve) {
                (onComplete) && onComplete();

                resolve();
            }
        ])
    }
}