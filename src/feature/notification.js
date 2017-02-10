import $ from 'jquery';
import * as Settings from '../feature/settings.js';
import IgnoreButton from '../class/ignore-button.js';

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

export function isInfo(chat) {
    if (chat === void 0) {
        return false;
    }
    if (chat.msg.indexOf("[info][title][dtext:chatroom_chat_edited]") != -1 ||
        chat.msg.indexOf("[info][dtext:chatroom_member_is]") != -1 ||
        chat.msg.indexOf("[info][dtext:chatroom_chat_joined]") != -1 ||
        chat.msg.indexOf("チャット情報を変更しました") != -1 ||
        chat.msg.indexOf("が退席しました") != -1 ||
        chat.msg.indexOf("チャットに参加しました") != -1) {
        return true;
    }
    return false;
}

export function isIgnoredRoom(roomId) {
    if (roomId === void 0) {
        return false;
    }
    let list = Settings.get('w-ignored-room-list', '');
    if (list.indexOf(roomId) != -1) {
        return true;
    }
    return false;
}

export function isAutoreadRoom(roomId) {
    if (roomId === void 0) {
        return false;
    }
    let list = Settings.get('w-autoread-room-list', '');
    if (list.indexOf(roomId) != -1) {
        return true;
    }
    return false;
}

export function render(htmlString, rid) {
    let $el = $(htmlString);
    $el.find('.roomListItem__roomName').prepend(new IgnoreButton(rid).render());
    if(isAutoreadRoom(rid)){
        $el.css('color', '#aaaaaa');
    }else{
        $el.css('color', '');
    }
    return $el.wrap('<p>').parent().html();
}

$('#_roomListArea').on('click', 'img.w_notifier', function() {
    let rid = parseInt($(this).attr('data-rid'));

    let list = Settings.get('w-ignored-room-list', []);
    let index = list.indexOf(rid);

    if(index != -1){
        list.splice(index, 1);
        $(".w_notifier.w_"+rid).attr('src', IgnoreButton.notifier_on);
    }else{
        list.push(rid);
        $(".w_notifier.w_"+rid).attr('src', IgnoreButton.notifier_off);
    }
    Settings.set('w-ignored-room-list', list);

    event.stopPropagation();
    event.preventDefault();
    return false;
});

let $displaySettings = $('label[for="_notifierOnlyto"]').parent().parent();
Settings.addInputBox('w-notification-word', '下記キーワードを含む場合TO扱いにする', 'JSの正規表現で記述', $displaySettings, function(){}, '');
