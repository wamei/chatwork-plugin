import $ from 'jquery';
import InlineImage from './inline-image.js';
import * as Settings from '../feature/settings.js';

export default class Stamp extends InlineImage{
    constructor(base, key) {
        super(base + key);
        this.key = key;
    }

    render() {
        let timeline = $('#_timeLine');
        let ss = this.getSuitableImageSize(timeline.width(), 150);
        let inlineHeight = ss.height == 0 ? 150 : (ss.height > 150 ? 150 : ss.height);
        return '<div style="height:'+inlineHeight+'px;display:inline-block;"><img src="'+this.element.src+'" style="max-height:150px;" class="w-stamp" data-key="'+this.key+'"></div>';
    }

    click() {
        this.add(true);
    }

    add(showConfirm = false) {
        let list = Settings.get('w-stamp-list', []);
        if (list.indexOf(this.key) != -1) {
            return;
        }
        if(!showConfirm || window.confirm('このスタンプを追加しますか？')) {
            list.push(this.key);
            Settings.set('w-stamp-list', list);
        }
    }

    remove(showConfirm = false) {
        let list = Settings.get('w-stamp-list', []);
        let index = list.indexOf(this.key);
        if (index == -1) {
            return;
        }
        if(!showConfirm || window.confirm('このスタンプを削除しますか？')) {
            list.splice(index, 1);
            Settings.set('w-stamp-list', list);
        }
    }
};
