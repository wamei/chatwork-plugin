import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    let oldGetRoomItemPanel = RL.view.getRoomItemPanel;
    RL.view.getRoomItemPanel = function(b, d){
        let rid = parseInt(this.model.rooms[b].id);
        let l = $(oldGetRoomItemPanel.apply(this, arguments));
        l = Notification.addIgnoreButton(l, rid);
        return l.wrap('<p>').parent().html();
    };
});
