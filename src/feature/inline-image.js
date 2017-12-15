import $ from 'jquery';
import ModalImage from '../class/modal-image.js';
import * as Settings from '../feature/settings.js';

var ImageCollection = {};

export function apply($el) {
    if (!Settings.get('w-inline-image')) {
        return;
    }
    let conditions = Settings.get('w-inline-image-domain').split(' ');
    let condition = '';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] != '') {
            condition += ', a[href^="' + conditions[i] + '"]';
        }
    }
    $el.find('a[href$=".gif"], a[href$=".png"], a[href$=".jpeg"], a[href$=".jpg"]' + condition).not(':has(div)')
        .each(function(){
            let src = $(this).attr('href');
            let img = ImageCollection[src];

            if (!img) {
                ImageCollection[src] = new ModalImage(src);
                img = ImageCollection[src];
            }
            $(this).css('overflow', 'visible');

            img.render().appendTo(this);
        });
    $(".popup_image").on('click', function(event){
        event.preventDefault();
        ImageCollection[$(this).attr('src')].show();
    });
}

let $displaySettings = $('label[for="_shortenUrl"]').parent().parent();
Settings.addCheckBox('w-inline-image', '画像のインライン展開', $displaySettings, function(){
    Settings.reloadTimeline();
}, true);
Settings.addInputBox('w-inline-image-domain', '画像展開ドメイン', 'マッチさせるURLを半角スペース区切り', $displaySettings, function(){
    Settings.reloadTimeline();
}, '');
