import $ from 'jquery';
import * as RoomIcon from '../feature/room-icon.js';
import AutoreadButton from '../class/autoread-button.js';

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

    var oldRVB = RoomView.prototype.build;
    RoomView.prototype.build = function(){
        oldRVB.apply(this, arguments);
        var rid = parseInt(this.model.id);
        $('#_roomTitle').children('._roomTitleText.autotrim').after(
            new AutoreadButton(rid).render()
        );
    };
});
