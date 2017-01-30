import $ from 'jquery';
import * as Notification from '../feature/notification.js';
import * as Settings from '../feature/settings.js';

$(function () {
    var changeSetMention = function() {
        if (!RM || !RM.timeline) {
            setTimeout(changeSetMention, 10);
            return;
        }
        let oldSetMention = RM.timeline.__proto__.setMention;
        RM.timeline.__proto__.setMention = function(b){
            let chat = this.chat_id2chat_dat[b];
            if (Notification.isTreatedTo(chat)) {
                chat.mn = !0;
                return;
            }
            oldSetMention.apply(this, arguments);
        };
    };
    changeSetMention();
});
