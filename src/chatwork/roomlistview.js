import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    let oldGetRoomItemPanel = RL.view.getRoomItemPanel;
    RL.view.getRoomItemPanel = function(b, d){
        var rid = parseInt(this.model.rooms[b].id);
        return Notification.render(oldGetRoomItemPanel.apply(this, arguments), rid);
    };
});
