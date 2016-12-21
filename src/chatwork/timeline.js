import $ from 'jquery';
import * as Notification from '../feature/notification.js';
import * as Settings from '../feature/settings.js';

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

    let lastUpdatedTime = null;
    let oldLoadOld = TimeLine.prototype.loadOld;
    TimeLine.prototype.loadOld = function(b) {
        let list = Settings.get('w-filter-mention-list', []);
        let index = list.indexOf(RM.id - 0);
        let now = new Date().getTime();
        if (index != -1 && now - lastUpdatedTime < 1000) {
            return;
        }
        lastUpdatedTime = now;
        oldLoadOld.apply(this, arguments);
    };
});
