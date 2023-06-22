import { MainService } from "./main-service";
import { SystemEventsManager } from "./system-events-manager";

export class SystemColors {

    /**
     * 
     * @param {MainService} _MainService 
     * @param {SystemEventsManager} _SystemEventsManager
     */
    constructor(_MainService, _SystemEventsManager) {
        let globalThis = this;
        this.internal_event = _SystemEventsManager;
        this.MainService = _MainService;
        this.Colors = {backgroundColors: {}};

        // config
        this.blurFilterLevel = 20;
        this.blurFilterClassName = 'sys-blur-filter';
        this.blurFilterControl = this.MainService.LIB.nodeCreator({node: 'style', innerHTML: `
            .${this.blurFilterClassName} {
                -webkit-backdrop-filter: blur(${this.blurFilterLevel}px);
                backdrop-filter: blur(${this.blurFilterLevel}px);
            }
        `});

        this.TransparentRatio = 0.90;
        this.Transparent = true;

        this.internal_event.event.add('backgroundchange', function(event, element) {
            globalThis.setPrimaryImage(element);
            globalThis.internal_event.eventTriger('colorready', globalThis.Colors);
        });

        document.head.appendChild(this.blurFilterControl);

        this.elementsApplyFillter = {blur: [], color: []};
    }

    applyBlurFilter(...elements) {
        if (elements) {
            elements.forEach(element => {
                element && element.classList.add(this.blurFilterClassName);
            });
        }
    }

    applyBackgroundColor(rgbColor, ...elements) {
        if (elements) {
            let rgba_string = ''
            if (this.Transparent) {
                rgba_string = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${this.TransparentRatio})`;
            }
            else {
                rgba_string = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1)`;
            }
            elements.forEach(element => {
                element && (element.style.backgroundColor = rgba_string);
            });
        }
    }

    applyBorderColor(rgbColor, ...elements) {
        if (elements) {
            let rgb_string = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
            elements.forEach(element => {
                if (element) {
                    element.style.borderColor = rgb_string;
                }
            });
        }
    }

    setPrimaryImage(imgEl) {
        this.imgElement = imgEl;
        // let rgb = this.getAverageRGB(this.imgElement);
        this.colorsBuilder(this.colorAnalysis(this.imgElement));
        // this.colorsBuilder(rgb);
        this.internal_event.eventTriger('colorchange', this.Colors);
    }

    colorsBuilder(rgbArray) {
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

    colorAnalysis(imgEl, colorLevel = 1) {
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