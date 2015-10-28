import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    let oldGetRoomItemPanel = RL.view.getRoomItemPanel;
    RL.view.getRoomItemPanel = function(b, d){
        return Notification.addIgnoreButton(oldGetRoomItemPanel.apply(this, arguments), parseInt(this.model.rooms[b].id));
    };
});
