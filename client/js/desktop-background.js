export class DesktopBackground {
    /**
     * 
     * @param {MainService} _MainService 
     */
    constructor(_MainService) {
        this.MainService = _MainService;
        this.MainControl = this.MainService.LIB.nodeCreator({node: 'div', classList: 'desktop-background', dataset: {scaleType: '0'}});
        this.BackgroundImageFolder = './sources/background-images/';
        this.BackgroundImageScaleType = {
            Stretch: 0,
            Fit: 1,
            Tile: 2,
            Center: 3
        }
    }

    render() {
       return this.MainControl;
    }

    setBackgroundImage(fileName) {
        let file = `${this.BackgroundImageFolder}${fileName}`;
        this.MainControl.style.backgroundImage = `url(${file})`;
    }

    setBackgroundImageScale(scaleType) {
        if (this.MainControl.dataset.scaleType != scaleType) {
            this.MainControl.dataset.scaleType = scaleType;
        }
    }
}