import $ from 'jquery';
import InlineImage from './inline-image.js';

export default class ModalImage extends InlineImage{
    constructor(url) {
        super(url);
    }

    render() {
        let timeline = $('#_timeLine');
        let ss = this.getSuitableImageSize(timeline.width(), timeline.height());
        let inlineHeight = ss.height == 0 ? 200 : (ss.height > 200 ? 200 : ss.height);

        return $('<img style="display:block;max-height:' + inlineHeight + 'px;" src="' + this.element.src + '" class="popup_image">');
    }

    show() {
        let ss = this.getSuitableImageSize($(window).width(), $(window).height());

        this.modal = $('<div>')
            .append($('<div style="background-color:black;opacity:0.6;position:absolute;top:0;width:100%;height:100%;z-index:101;">'))
            .append($('<img style="position:absolute;top:0;width:' + ss.width + 'px;height:' + ss.height + 'px;margin:' + ss.top + 'px ' + ss.left + 'px;z-index:102;" src="' + this.element.src + '">'))
            .click(() => {
                this.hide();
            });
        $('body').append(this.modal);
    }

    hide() {
        this.modal.remove();
        this.modal = null;
    }
};
