import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";

export class Locales {

    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager 
     */
    constructor(_MainService, _SystemEventsManager) {
        this.MainService = _MainService;
        this.languages = {
            vi_vn: {id: 'vi_vn', lang: 'vi-vn', name: 'Tiếng Việt - Việt Nam'},
            en_us: {id: 'en_us', lang: 'en-us', name: 'English - United States'},
        };
        this.default = this.languages.en_us;
        this.displayLang = this.getCurrentLang();
        this.localesFolder = './client/js/langs/';
        this.localesFile = `${this.localesFolder}${this.displayLang.lang}.json`;
        this.LanguageData = {};
        this.load();
    }

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

    load() {
        this.displayLang = this.getCurrentLang();
        this.localesFile = `${this.localesFolder}${this.displayLang.lang}.json`;
        let globalThis = this;

        this.MainService.LIB.XHRSendRequest({
            method: 'GET', url: this.localesFile,async: false,
            event: {
                done: function(obj) {
                    obj && (globalThis.LanguageData = JSON.parse(obj.data));
                }
            }
        })
    }
}