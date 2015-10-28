import $ from 'jquery';
import * as Settings from '../feature/settings.js';

const notifier_on = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gYbATo7edivqwAAAepJREFUWMPtl7FLJDEUxn/jbiNYXSeCYOF4cAhbKQFBsJBtlRVtrpAThS2t8idMZSt3CHaCIFgqFguCMCCKBwcH5uAK4bgFK2FhQZDYvGKYTdZRZ2caHwzJhJf3vSTfey8JrLWUKUOULKU7QJlHYK2lmlU5jOJxYAmYAaaAEWkBboGOtJfAsdHqLovdwFpLEAT9gFeBTWDhlQtsAT+MVof9dsDrQBjFNeC7rPg9cglsGa1+uhwY8qz6G3CVAzhi40psvhwFYRRvA3tAJUe+VYA9se3nQBjFC8BZzuBJeQIWjVatHg6EUTwM/AHGBhx9/4BJo1U3zYFGAeAIRsPFga+eCefArHzn7xjHhZVMRDWP8prRqi0cWQP+v3EcF1ZyBz71YXAefVxYSRL+BSYcyqfAuvT3gfobx5PSNlqNpmtBC3Ali7pnG187npRr1xHsFFgIj3ocMFr9Bo4LAL8FDnypuAncDxD8UaLk0emAhM8y0B0Q+Hq6KjrLcRjFdeAkR/AOsGK0Os1UjmVCnoT7nAZ3ZcKkLHkqWdYq2RXgXaNV3E/R50AjVb02JE/MAfPAODCdmnMH/AJi4MJolWkXezggV7Eb+T0AmkarhyJvxasSiltGq4HnhaonXL4Yre4pQsp+mAQfj9OyHXgGDUPJfoJO3VAAAAAASUVORK5CYII=';
const notifier_off = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gYbATkg2JA1hAAAAdxJREFUWMPtl7FLHUEQxn+nNgGrdCEgpAgJSMAqaQKCDOG1yhNtLERRsMwfkjZEBDshELCMhI8HgiCIwYAQkEAKIShYCcIDQTbNFMe93eep9+4aB47dW2bnm939ZmY3CyHQpAzRsDTuAE0eQQiBkbLKZjYGTANvgVfAqLcAJ8CVtwfAtqTTMnazEAJZlvUDngNWgKk7LrADrEv62m8Hkg6Y2QTwxVf8EDkAViX9ijkwlFj1EnBYAThu49Bt3h4FZvYR2ACGK+TbMLDhttMcMLMp4EfF4Hm5AT5I6vRwwMyeAH+A5wOOvn/AS0ndIgfaNYDjGO0YBxYSE3aBd/7tPmCcGFY+EU0klOclnTtH5oGze44Tw8rvwNM+DK6iTwwrT8K/wIuI8g6w6P1NoHXP8bycS3pWrAUdIJYsWoltvOt4Xn7GjuBTjYXwW48Dkn4D2zWAnwBbqVS8BlwMEPzao+Q66oCHzwzQHRD4YrEqRsuxmbWA7xWCXwGzknZKlWOfUCXhXhfBY5kwL9OJSla2SnYd+LOk/X6KKQfaheq17HniPTAJjAFvCnNOgWNgH9iTVGoXezjgV7Ej/90C1iRd1nkrnvNQXJU08LwwkgiXcUkX1CFNP0yyx8dp0w78B5WJzMv8p27yAAAAAElFTkSuQmCC';

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

export function addIgnoreButton($el, rid) {
    let n = $('<img style="cursor:pointer;position:relative;background:transparent;border:none;box-shadow:none;" class="_showDescription w_notifier w_'+rid+'" data-rid="'+rid+'" width="14px" height="14px" aria-label="通知機能のON/OFFが行えます">');

    let list = Settings.get('w-ignored-room-list', []);
    if(list.indexOf(rid) != -1){
        n.attr('src', notifier_off);
    }else{
        n.attr('src', notifier_on);
    }

    $el.find('.chatListTitleArea').prepend(n);
    return $el;
}

$('#_roomListArea').on('click', 'img.w_notifier', function() {
    let rid = parseInt($(this).attr('data-rid'));

    let list = Settings.get('w-ignored-room-list', []);
    let index = list.indexOf(rid);

    if(index != -1){
        list.splice(index, 1);
        $(".w_notifier.w_"+rid).attr('src', notifier_on);
    }else{
        list.push(rid);
        $(".w_notifier.w_"+rid).attr('src', notifier_off);
    }
    Settings.set('w-ignored-room-list', list);

    event.stopPropagation();
    event.preventDefault();
    return false;
});

let $displaySettings = $('label[for="_notifierOnlyto"]').parent().parent();
Settings.addInputBox('w-notification-word', '下記キーワードを含む場合TO扱いにする', 'JSの正規表現で記述', $displaySettings, function(){}, '');
