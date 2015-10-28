import $ from 'jquery';

export default class InlineImage {
    constructor(url) {
        this.width = 0;
        this.height = 0;
        this.element = document.createElement('img');
        this.element.onload = () => {
            this.width = this.element.width;
            this.height = this.element.height;
        };
        this.element.src = url;
    }

    getSuitableImageSize(width, height) {
        var rwidth = this.width;
        var rheight = this.height;

        if(width < rwidth){
            rheight = rheight * (width / rwidth);
            rwidth = width;
        }
        if(height < rheight){
            rwidth = rwidth * (height / rheight);
            rheight = height;
        }
        return {
            width: rwidth,
            height: rheight,
            top: (height - rheight) / 2,
            left: (width - rwidth) /2
        };
    }
};
