import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";
import { LocalStored } from "./local-stored";

export class SystemColors {

    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager
     */
    constructor(_MainService, _SystemEventsManager) {
        let globalThis = this;
        SystemColors.#private_SYSEvent = _SystemEventsManager;
        SystemColors.#private_SYSService = _MainService;
        this.internal_event = _SystemEventsManager;
        this.MainService = _MainService;
        this.Colors = {
            backgroundColors: {}, 
            level: {
                level1: 'Color_1',
                level2: 'Color_2',
                level3: 'Color_3',
                level4: 'Color_4',
                level5: 'Color_5',
                level6: 'Color_6',
                level7: 'Color_7',
                level8: 'Color_8',
                level10: 'Color_11',
                level12: 'Color_12',
                level13: 'Color_13',
                level14: 'Color_14',
                level15: 'Color_15',
                level16: 'Color_16',
            }
        };

        // config
        this.blurFilterLevel = 7;
        this.blurFilterClassName = 'sys-blur-filter';
        this.blurFilterControl = this.MainService.LIB.nodeCreator({node: 'style', innerHTML: `
            .${this.blurFilterClassName} {
                -webkit-backdrop-filter: blur(${this.blurFilterLevel}px);
                backdrop-filter: blur(${this.blurFilterLevel}px);
            }
        `});

        this.TransparentRatio = 0.80;
        this.Transparent = true;

        this.internal_event.event.add('backgroundchange', function(event, element) {
            globalThis.setPrimaryImage(element);
            globalThis.internal_event.eventTriger('colorready', globalThis.Colors);
        });

        document.head.appendChild(this.blurFilterControl);

        this.elementsApplyFillter = {blur: [], color: []};

        // theme init
        SystemColors.#private_ThemeProcessor();

        this.internal_event.event.add('systhemechanged', function(event, theme) {
            globalThis.colorRWM(theme);
        });
        this.internal_event.event.add('appthemechanged', function(event, theme) {
            globalThis.colorRWM(theme);
        });
    }

    static ThemeColor = {
        AUTO: 0,
        LIGHT: 1,
        DARK: 2
    }

    static ApplicationTheme = {
        /**
         * @param {SystemColors.ThemeColor} value 
         */
        set Theme(value) {
            if (Number(value) != this.Theme) {
                LocalStored.set('theme_color_mode', value);
                SystemColors.#private_SystemColorStored.ThemeStored = value;
                SystemColors.#private_ThemeProcessor();
            }
        },
        get Theme() {
            return SystemColors.#private_SystemColorStored.ThemeStored;
        }
    }

    static SystemTheme = {
        get Theme() {
            return SystemColors.ThemeColor[SystemColors.#private_SystemColorStored.WINDOW_MEDIA_CONTRUCTION.matches ? "DARK" : "LIGHT"];
        }
    }

    static #private_SYSEvent = null;
    static #private_SYSService = null;
    static #private_SystemColorStored = {
        ThemeStored: Number(LocalStored.get('theme_color_mode') ?? SystemColors.ThemeColor.AUTO),
        WINDOW_MEDIA_CONTRUCTION: window.matchMedia('(prefers-color-scheme: dark)'),
        RawArrayRGB: {Theme: 0, ArrayRGB: []},
        FilterApply: {backgroundColor: [], borderColor: []}
    }
    static #private_AutoTheme = {
        get isBinded() {
            return this.protect_isBinded;
        },
        set isBinded(value) {
            if (value == this.protect_isBinded) return;
            this.protect_isBinded = value;
            let SYSSERVICE = SystemColors.#private_SYSService;
            if (value == true) {
                let WINDOW_MEDIA_CONTRUCTION = SystemColors.#private_SystemColorStored.WINDOW_MEDIA_CONTRUCTION;
                SYSSERVICE.LIB.bindEvents(WINDOW_MEDIA_CONTRUCTION, {change: this.EVENT_WORKER_BINDING});
            }
            else {
                SYSSERVICE.LIB.unbindEvents(WINDOW_MEDIA_CONTRUCTION, {change: this.EVENT_WORKER_BINDING});
            }
        },
        protect_isBinded: false,
        EVENT_WORKER_BINDING: function(event) {
            if (SystemColors.#private_AutoTheme.isBinded) {
                SystemColors.#private_SYSEvent.eventTriger('systhemechanged', SystemColors.ThemeColor[event.matches ? "DARK" : "LIGHT"]);
            }
        }
    }
    static #private_ThemeProcessor() {
        let private_AutoTheme = SystemColors.#private_AutoTheme,
            WIN_MEDIA = SystemColors.#private_SystemColorStored.WINDOW_MEDIA_CONTRUCTION;
        if (this.ApplicationTheme.Theme == SystemColors.ThemeColor.AUTO) {
            private_AutoTheme.isBinded = true;
        }
        else {
            private_AutoTheme.isBinded = false;
            SystemColors.#private_SYSEvent.eventTriger('systhemechanged', SystemColors.ThemeColor[WIN_MEDIA.matches ? "DARK" : "LIGHT"]);
        }
        SystemColors.#private_SYSEvent.eventTriger('appthemechanged', SystemColors.ApplicationTheme.Theme);
    }

    /**
     * RWM (Remake With Wode)
     */
    colorRWM(colorMode) {
        if (colorMode == SystemColors.ThemeColor.AUTO) {
            colorMode = SystemColors.SystemTheme.Theme;
        }
        
        let colorData = SystemColors.#private_SystemColorStored.RawArrayRGB;
        if (colorMode != colorData.Theme) {
            colorData.ArrayRGB = colorData.ArrayRGB.reverse();
            colorData.Theme = colorMode;
            this.colorsBuilder(colorData.ArrayRGB);

            this.applyBackgroundColor();
            this.applyBorderColor();

        }
    }

    applyBlurFilter(...elements) {
        if (elements) {
            elements.forEach(element => {
                element && element.classList.add(this.blurFilterClassName);
            });
        }
    }

    applyBackgroundColor(colorlv, ...elements) {
        if (elements.length) {
            let rgba_string = '',
                rgbColor = this.Colors[colorlv]
            ;
            if (this.Transparent) {
                rgba_string = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${this.TransparentRatio})`;
            }
            else {
                rgba_string = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1)`;
            }
            SystemColors.#private_SystemColorStored.FilterApply.backgroundColor.push({items: elements, colorlv: colorlv});
            elements.forEach(element => {
                element && (element.style.backgroundColor = rgba_string);
            });
        }
        else {
            let globalThis = this;
            SystemColors.#private_SystemColorStored.FilterApply.backgroundColor.forEach(rawElement => {
                let rgba_string = '',
                    rgbColor = globalThis.Colors[rawElement.colorlv];
                ;
                if (this.Transparent) {
                    rgba_string = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${this.TransparentRatio})`;
                }
                else {
                    rgba_string = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1)`;
                }
                
                rawElement.items.forEach(element => {
                    element && (element.style.backgroundColor = rgba_string);
                });
            });
        }
    }

    applyBorderColor(colorlv, ...elements) {
        if (elements.length) {
            let rgbColor = this.Colors[colorlv],
                rgb_string = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
            ;
            SystemColors.#private_SystemColorStored.FilterApply.borderColor.push({items: elements, colorlv: colorlv});
            elements.forEach(element => {
                if (element) {
                    element.style.borderColor = rgb_string;
                }
            });
        }
        else {
            let globalThis = this;
            SystemColors.#private_SystemColorStored.FilterApply.borderColor.forEach(rawElement => {
                let rgbColor = globalThis.Colors[rawElement.colorlv],
                    rgb_string = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
                ;
                rawElement.items.forEach(element => {
                    element && (element.style.borderColor = rgb_string);
                });
            });
        }
    }

    setPrimaryImage(imgEl) {
        this.imgElement = imgEl;
        // let rgb = this.getAverageRGB(this.imgElement);
        let rgbArray = this.colorAnalysis(this.imgElement),
            sysTheme = SystemColors.SystemTheme.Theme;

        if (sysTheme == SystemColors.ThemeColor.LIGHT) {
            rgbArray = rgbArray.reverse();
        }
        SystemColors.#private_SystemColorStored.RawArrayRGB.ArrayRGB = rgbArray;
        SystemColors.#private_SystemColorStored.RawArrayRGB.Theme = sysTheme;
        this.colorsBuilder(rgbArray);
        // this.colorsBuilder(rgb);
        this.internal_event.eventTriger('colorchange', this.Colors);
    }

    colorsBuilder(rgbArray) {
        // this.Colors = {};
        for (let index = 1; index <= rgbArray.length; index++) {
            const color = rgbArray[index-1];
            this.Colors[[`Color_${index}`]] = color;
        }
    }

    getAverageRGB(imgEl) {
        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r:0,g:0,b:0},
            count = 0;
            
        if (!context) {
            return defaultRGB;
        }
        
        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
        context.drawImage(imgEl, 0, 0);
        try {
            data = context.getImageData(0, 0, width, height);
        } catch(e) {
            /* security error, img on diff domain */;
            return defaultRGB;
        }
        
        length = data.data.length;
        
        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }
        
        // ~~ used to floor values
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);
        
        return rgb;
        
    }

    colorAnalysis(imgEl, colorLevel = 0) {
        let height = 0, 
            width = 0, 
            canvas = document.createElement('canvas')
        ;

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgEl, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const buildRgb = (imageData) => {
            const rgbValues = [];
            for (let i = 0; i < imageData.length; i += 4) {
                const rgb = {
                    r: imageData[i],
                    g: imageData[i + 1],
                    b: imageData[i + 2],
                };
                rgbValues.push(rgb);
            }
            return rgbValues;
        };

        const findBiggestColorRange = (rgbValues) => {
            let rMin = Number.MAX_VALUE;
            let gMin = Number.MAX_VALUE;
            let bMin = Number.MAX_VALUE;
          
            let rMax = Number.MIN_VALUE;
            let gMax = Number.MIN_VALUE;
            let bMax = Number.MIN_VALUE;
          
            rgbValues.forEach((pixel) => {
                rMin = Math.min(rMin, pixel.r);
                gMin = Math.min(gMin, pixel.g);
                bMin = Math.min(bMin, pixel.b);
            
                rMax = Math.max(rMax, pixel.r);
                gMax = Math.max(gMax, pixel.g);
                bMax = Math.max(bMax, pixel.b);
            });
          
            const rRange = rMax - rMin;
            const gRange = gMax - gMin;
            const bRange = bMax - bMin;
          
            const biggestRange = Math.max(rRange, gRange, bRange);
            if (biggestRange === rRange) {
                return "r";
            } else if (biggestRange === gRange) {
                return "g";
            } else {
                return "b";
            }
        };

        const quantization = (rgbValues, depth) => {
            const MAX_DEPTH = 4;
          
            // Base case
            if (depth === MAX_DEPTH || rgbValues.length === 0) {
                const color = rgbValues.reduce(
                    (prev, curr) => {
                    prev.r += curr.r;
                    prev.g += curr.g;
                    prev.b += curr.b;
            
                    return prev;
                    },
                    {
                    r: 0,
                    g: 0,
                    b: 0,
                    }
                );
            
                color.r = Math.round(color.r / rgbValues.length);
                color.g = Math.round(color.g / rgbValues.length);
                color.b = Math.round(color.b / rgbValues.length);
            
                return [color];
            }
          
            /**
             *  Recursively do the following:
             *  1. Find the pixel channel (red,green or blue) with biggest difference/range
             *  2. Order by this channel
             *  3. Divide in half the rgb colors list
             *  4. Repeat process again, until desired depth or base case
             */
            const componentToSortBy = findBiggestColorRange(rgbValues);
            rgbValues.sort((p1, p2) => {
                return p1[componentToSortBy] - p2[componentToSortBy];
            });
          
            const mid = rgbValues.length / 2;
            return [
                ...quantization(rgbValues.slice(0, mid), depth + 1),
                ...quantization(rgbValues.slice(mid + 1), depth + 1),
            ];
        };

        return quantization(buildRgb(imageData.data), colorLevel)
    }
}