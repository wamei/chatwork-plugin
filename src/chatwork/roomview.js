import $ from 'jquery';
import * as RoomIcon from '../feature/room-icon.js';

$(function () {
    RoomView.prototype.changeIcon = function(rid) {
        window.event.stopPropagation();
        RoomIcon.change(rid);
    };

    let oldRoomViewGetIcon = RoomView.prototype.getIcon;
    RoomView.prototype.getIcon = function(a, b, c = false) {
        let ret = oldRoomViewGetIcon.apply(this, arguments);
        return RoomIcon.get(a, this.model.id, ret, c);
    };
});
