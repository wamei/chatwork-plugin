import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    let oldSetMention = TimeLine.prototype.setMention;
    TimeLine.prototype.setMention = function(b){
        let chat = this.chat_id2chat_dat[b];
        if (Notification.isTreatedTo(chat)) {
            chat.mn = !0;
            return;
        }
        oldSetMention.apply(this, arguments);
    };
});
