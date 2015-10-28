import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    var oldGetRoomItemPanel = RL.view.getRoomItemPanel;
    RL.view.getRoomItemPanel = function(b, d){
        var l = $(oldGetRoomItemPanel.apply(this, arguments));
        var rid = parseInt(this.model.rooms[b].id);
        l = Notification.addIgnoreButton(l, rid);
        return l.wrap('<p>').parent().html();
    };
});
