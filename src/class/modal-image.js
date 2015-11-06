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

        return $('<div style="position:relative;max-width:100%;">')
            .append(
                $('<iframe style="width:100%;height:' + inlineHeight + 'px;" sandbox seamless srcdoc="<style>html{overflow:hidden;}body{padding:0px;margin:0px;}</style><img style=\'display:inline-block;max-height:' + inlineHeight + 'px;\'  src=\'' + this.element.src + '\'>">')
            )
            .append(
                $('<div style="background-color:white;opacity:0.0001;z-index:50;position:absolute;top:0;width:100%;height:' + inlineHeight + 'px;" class="popup_image" data-image="' + this.element.src + '">')
            );
    }

    show() {
        let ss = this.getSuitableImageSize($(window).width(), $(window).height());

        this.modal = $('<div>')
            .append($('<div style="background-color:black;opacity:0.6;position:absolute;top:0;width:100%;height:100%;z-index:101;">'))
            .append($('<iframe style="position:absolute;top:0;width:' + ss.width + 'px;height:' + ss.height + 'px;margin:' + ss.top + 'px ' + ss.left + 'px;z-index:102;" sandbox seamless srcdoc="<style>html{overflow:hidden;}body{padding:0px;margin:0px;}</style><img style=\'display:inline-block;max-height:100%;\'  src=\'' + this.element.src + '\'>">'))
            .append($('<div style="background-color:white;opacity:0.0001;position:absolute;top:0;width:100%;height:100%;z-index:103;">'))
            .click(() => {
                this.hide();
            });
        $('body').append(this.modal);
    }

    hide() {
        this.modal.remove();
    }
};
