import $ from 'jquery';
import Stamp from '../class/stamp.js';
import StampList from '../class/stamp-list.js';
import * as Settings from '../feature/settings.js';

var ImageCollection = {};

var stampList = new StampList();

export function replace(htmlString) {
    let base = Settings.get('w-stamp-url');
    return htmlString.replace(/\(stamp ([\s\S]+?)\)/g, function(all, key){
        if (base == '') {
            return all;
        }
        let img = ImageCollection[key];

        if (!img) {
            ImageCollection[key] = new Stamp(Settings.get('w-stamp-url'), key);
            img = ImageCollection[key];
        }

        return img.render();
    });
}

export function delegateStampEvent() {
    $(".w-stamp").on('click', function(event){
        event.preventDefault();
        ImageCollection[$(this).attr('data-key')].click();
    });
}

function reload_stamp() {
    stampList.remove();
    if (Settings.get('w-stamp-url', '') != '') {
        stampList.render();
    }
}

let $displaySettings = $('label[for="_shortenUrl"]').parent().parent();
Settings.addInputBox('w-stamp-url', 'スタンプ保存先URL', 'スタンプ画像を保存しているURL', $displaySettings, function(){
    Settings.reloadTimeline();
    reload_stamp();
}, '');
reload_stamp();
