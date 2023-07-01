import { Core } from "./core";
import { SystemEventsManager } from "./system-events-manager";
import { LocalStored } from "./local-stored";

export class SystemColors {

    /**
     * 
     * @param {Core} _Core 
     * @param {SystemEventsManager} _SystemEventsManager
     */
    constructor(_Core, _SystemEventsManager) {
        let globalThis = this,
            LIB = _Core.LIB;
        SystemColors.#private_SYSEvent = _SystemEventsManager;
        SystemColors.#private_SYSService = _Core;
        this.internal_event = _SystemEventsManager;
        this.Core = _Core;
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
                level9: 'Color_9',
                level10: 'Color_10',
                level11: 'Color_11',
                level12: 'Color_12',
                level13: 'Color_13',
                level14: 'Color_14',
                level15: 'Color_15',
                level16: 'Color_16',
                level17: 'Color_17',
                level18: 'Color_18',
                level19: 'Color_19',
                level20: 'Color_20',
                level21: 'Color_21'
            }
        };

        // config
        this.blurFilterLevel = 15;
        this.blurFilterClassName = 'sys-blur-filter';
        this.blurFilterControl = LIB.nodeCreator({node: 'style', innerHTML: `
            .${this.blurFilterClassName} {
                -webkit-backdrop-filter: blur(${this.blurFilterLevel}px);
                backdrop-filter: blur(${this.blurFilterLevel}px);
            }
        `});

        this.TransparentRatio = 0.70;
        this.Transparent = true;

        // color apply
        this.colorFilter = LIB.nodeCreator({node: 'style'});

        this.internal_event.event.add('backgroundchange', function(event, element) {
            globalThis.setPrimaryImage(element);
            globalThis.internal_event.eventTriger('colorready', globalThis.Colors);
        });

        document.head.append(this.blurFilterControl, this.colorFilter);

        this.elementsApplyFillter = {blur: [], color: []};

        // theme init
        SystemColors.#private_ThemeProcessor();

        this.internal_event.event.add('systhemechanged', function(event, theme) {
            globalThis.colorRWM(theme);
        });
        this.internal_event.event.add('appthemechanged', function(event, theme) {
            globalThis.colorRWM(theme);
        });
        this.internal_event.event.add('themechanged', function(event, theme) {
            globalThis.attachedToSystem();
        });

        this.attachedToSystem();
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

    getTheme() {
        if (SystemColors.#private_SystemColorStored.ThemeStored == SystemColors.ThemeColor.AUTO) {
            return SystemColors.SystemTheme.Theme;
        }
        else {
            return SystemColors.ApplicationTheme.Theme;
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
                SystemColors.#private_SYSEvent.eventTriger('themechanged', SystemColors.ThemeColor[event.matches ? "DARK" : "LIGHT"]);
            }
        }
    }
    static #private_ThemeProcessor() {
        let private_AutoTheme = SystemColors.#private_AutoTheme,
            WIN_MEDIA = SystemColors.#private_SystemColorStored.WINDOW_MEDIA_CONTRUCTION,
            sysTheme = SystemColors.ThemeColor[WIN_MEDIA.matches ? "DARK" : "LIGHT"],
            appTheme = SystemColors.ApplicationTheme.Theme;
        if (appTheme == SystemColors.ThemeColor.AUTO) {
            private_AutoTheme.isBinded = true;
        }
        else {
            private_AutoTheme.isBinded = false;
            SystemColors.#private_SYSEvent.eventTriger('systhemechanged', sysTheme);
            SystemColors.#private_SYSEvent.eventTriger('themechanged', appTheme);
        }
        SystemColors.#private_SYSEvent.eventTriger('appthemechanged', appTheme);
    }

    attachedToSystem() {
        let themeValue = '',
            unthemeValue = '';
        switch (this.getTheme()) {
            case 1:
                themeValue = 'light-theme';
                unthemeValue = 'dark-theme';
                break;

            case 2:
                themeValue = 'dark-theme'
                unthemeValue = 'light-theme';
                break;
        }
        document.documentElement.classList.add(themeValue);
        document.documentElement.classList.remove(unthemeValue);
    }

    getBackgroundColorClass(colorlv) {
        if (this.Transparent) {
            colorlv = 'T-' + colorlv;
        }
        return `bg-${colorlv}`;
    }

    getBorderColorClass(colorlv) {
        return `bd-${colorlv}`;
    }

    getHoverColorClass(colorlv) {
        return `hv-${colorlv}`;
    }

    getActiveColorClass(colorlv) {
        return `at-${colorlv}`;
    }
    
    getTextColorClass(colorlv) {
        return `text-${colorlv}`;
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
            SystemColors.#private_SystemColorStored.FilterApply.backgroundColor.push({items: elements, colorlv: colorlv});
            if (this.Transparent) {
                colorlv = 'T-' + colorlv;
            }
            elements.forEach(element => {
                element && (element.classList.add(`bg-${colorlv}`));
            });
        }
    }

    applyActiveBackgroundColor(colorlv, ...elements) {
        if (elements.length) {
            SystemColors.#private_SystemColorStored.FilterApply.backgroundColor.push({items: elements, colorlv: colorlv});
            if (this.Transparent) {
                colorlv = 'T-' + colorlv;
            }
            elements.forEach(element => {
                element && (element.classList.add(`at-${colorlv}`));
            });
        }
    }

    applyHoverBackgroundColor(colorlv, ...elements) {
        if (elements.length) {
            SystemColors.#private_SystemColorStored.FilterApply.backgroundColor.push({items: elements, colorlv: colorlv});
            if (this.Transparent) {
                colorlv = 'T-' + colorlv;
            }
            elements.forEach(element => {
                element && (element.classList.add(`hv-${colorlv}`));
            });
        }
    }

    applyBorderColor(colorlv, ...elements) {
        if (elements.length) {
            SystemColors.#private_SystemColorStored.FilterApply.borderColor.push({items: elements, colorlv: colorlv});
            elements.forEach(element => {
                if (element) {
                    element.classList.add(`bd-${colorlv}`);
                }
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
        let html_filter = '',
            html_filter_bg = '',
            html_filter_bd = '',
            html_filter_hv = '',
            html_filter_at = '',
            html_textcolor = ''
        ;
        for (let index = 1; index <= rgbArray.length; index++) {
            const rawColor = rgbArray[index-1],
                  colorRGB = `rgb(${rawColor.r}, ${rawColor.g}, ${rawColor.b})`,
                  colorRGBA = `rgba(${rawColor.r}, ${rawColor.g}, ${rawColor.b}, ${this.TransparentRatio})`
                ;
            this.Colors[[`Color_${index}`]] = rawColor;

            html_filter_hv += `
                .hv-Color_${index}:hover {
                    background-color: ${colorRGB};
                }
                .hv-T-Color_${index}:hover {
                    background-color: ${colorRGBA};
                }
            `;

            html_filter_bd += `
                .bd-Color_${index} {
                    border-color: ${colorRGB};
                }
            `;
            
            html_filter_bg += `
                .bg-Color_${index} {
                    background-color: ${colorRGB};
                }
                .bg-T-Color_${index} {
                    background-color: ${colorRGBA};
                }
            `;

            html_filter_at += `
                .at-Color_${index}:active, .at-Color_${index}.active {
                    background-color: ${colorRGB} !important;
                }
                .at-T-Color_${index}:active, .at-T-Color_${index}.active {
                    background-color: ${colorRGBA} !important;
                }
            `;

            html_textcolor += `
                .text-Color_${index} {
                    color: ${colorRGB};
                }
            `;
        }
        html_filter = html_filter_hv + html_filter_bd + html_filter_bg + html_filter_at + html_textcolor;
        this.colorFilter.innerHTML = html_filter;
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
        // let height = 0, 
        //     width = 0, 
        //     canvas = document.createElement('canvas')
        // ;

        // height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        // width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        // const ctx = canvas.getContext("2d");
        // ctx.drawImage(imgEl, 0, 0);

        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // const buildRgb = (imageData) => {
        //     const rgbValues = [];
        //     for (let i = 0; i < imageData.length; i += 4) {
        //         const rgb = {
        //             r: imageData[i],
        //             g: imageData[i + 1],
        //             b: imageData[i + 2],
        //         };
        //         rgbValues.push(rgb);
        //     }
        //     return rgbValues;
        // };

        // const findBiggestColorRange = (rgbValues) => {
        //     let rMin = Number.MAX_VALUE;
        //     let gMin = Number.MAX_VALUE;
        //     let bMin = Number.MAX_VALUE;
          
        //     let rMax = Number.MIN_VALUE;
        //     let gMax = Number.MIN_VALUE;
        //     let bMax = Number.MIN_VALUE;
          
        //     rgbValues.forEach((pixel) => {
        //         rMin = Math.min(rMin, pixel.r);
        //         gMin = Math.min(gMin, pixel.g);
        //         bMin = Math.min(bMin, pixel.b);
            
        //         rMax = Math.max(rMax, pixel.r);
        //         gMax = Math.max(gMax, pixel.g);
        //         bMax = Math.max(bMax, pixel.b);
        //     });
          
        //     const rRange = rMax - rMin;
        //     const gRange = gMax - gMin;
        //     const bRange = bMax - bMin;
          
        //     const biggestRange = Math.max(rRange, gRange, bRange);
        //     if (biggestRange === rRange) {
        //         return "r";
        //     } else if (biggestRange === gRange) {
        //         return "g";
        //     } else {
        //         return "b";
        //     }
        // };

        // const quantization = (rgbValues, depth) => {
        //     const MAX_DEPTH = 4;
          
        //     // Base case
        //     if (depth === MAX_DEPTH || rgbValues.length === 0) {
        //         const color = rgbValues.reduce(
        //             (prev, curr) => {
        //             prev.r += curr.r;
        //             prev.g += curr.g;
        //             prev.b += curr.b;
            
        //             return prev;
        //             },
        //             {
        //             r: 0,
        //             g: 0,
        //             b: 0,
        //             }
        //         );
            
        //         color.r = Math.round(color.r / rgbValues.length);
        //         color.g = Math.round(color.g / rgbValues.length);
        //         color.b = Math.round(color.b / rgbValues.length);
            
        //         return [color];
        //     }
          
        //     /**
        //      *  Recursively do the following:
        //      *  1. Find the pixel channel (red,green or blue) with biggest difference/range
        //      *  2. Order by this channel
        //      *  3. Divide in half the rgb colors list
        //      *  4. Repeat process again, until desired depth or base case
        //      */
        //     const componentToSortBy = findBiggestColorRange(rgbValues);
        //     rgbValues.sort((p1, p2) => {
        //         return p1[componentToSortBy] - p2[componentToSortBy];
        //     });
          
        //     const mid = rgbValues.length / 2;
        //     return [
        //         ...quantization(rgbValues.slice(0, mid), depth + 1),
        //         ...quantization(rgbValues.slice(mid + 1), depth + 1),
        //     ];
        // };

        // let colorArray = quantization(buildRgb(imageData.data), colorLevel),
        //     lastCount = colorArray.length - 1
        // ;
        // let light_color = this.generateColor({r: 255, g: 255, b: 255}, {r: colorArray[lastCount].r, g: colorArray[lastCount].g, b: colorArray[lastCount].b}, 3),
        //     dark_color = this.generateColor({r: colorArray[0].r, g: colorArray[0].g, b: colorArray[0].b}, {r: 0, g: 0, b: 0}, 3)
        // ;
        // colorArray.push(...light_color);
        // colorArray.unshift(...dark_color);
        // return colorArray;

        let colorArray = [];
        colorArray.push(this.getAverageRGB(imgEl));
        let light_color = this.generateColor({r: 255, g: 255, b: 255}, {r: colorArray[0].r, g: colorArray[0].g, b: colorArray[0].b}, 10),
            dark_color = this.generateColor({r: colorArray[0].r, g: colorArray[0].g, b: colorArray[0].b}, {r: 0, g: 0, b: 0}, 10)
        ;
        colorArray.push(...light_color);
        colorArray.unshift(...dark_color);
        return colorArray;
    }

    generateColor(colorStart,colorEnd,colorCount){
    
        // The number of colors to compute
        var len = colorCount;
    
        //Alpha blending amount
        var alpha = 0.0;
    
        var saida = [];
        
        for (let i = 0; i < len; i++) {
            var c = {};
            alpha += (1.0/len);
            
            c.r = colorStart.r * alpha + (1 - alpha) * colorEnd.r;
            c.g = colorStart.g * alpha + (1 - alpha) * colorEnd.g;
            c.b = colorStart.b * alpha + (1 - alpha) * colorEnd.b;
    
            saida.push(c);
            
        }
        
        return saida;
        
    }
}