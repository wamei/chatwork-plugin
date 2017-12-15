import $ from 'jquery';
import * as Settings from '../feature/settings.js';

export function isTreatedTo(chat) {
    if (chat === void 0) {
        return false;
    }
    let keywordString = Settings.get('w-notification-word', '');
    let KEYWORD = new RegExp(keywordString, "gm");
    if (keywordString != '' && KEYWORD.test(chat.msg)) {
        return true;
    }
    return false;
}

let $displaySettings = $('label[for="_notifierOnlyto"]').parent().parent();
Settings.addInputBox('w-notification-word', '下記キーワードを含む場合TO扱いにする', 'JSの正規表現で記述', $displaySettings, function(){}, '');
