import $ from 'jquery';
import * as Settings from '../feature/settings.js';
import RoomIcon from '../class/room-icon.js';

var RoomIconList = {};

export function change(rid) {
    getRoomIcon(rid).openSetting();
}

export function get(type, rid, value, isOriginal) {
    let roomIcon = getRoomIcon(rid);
    let url = roomIcon.get();
    switch (type) {
    case "html":
        let $v = $(value).attr('onclick', 'RoomView.prototype.changeIcon('+rid+')');
        if (!isOriginal && url != '') {
            $v.attr('src', url);
        }
        return $('<p>').append($v).html();
    }
    if (!isOriginal && url != '') {
        return url;
    }
    return value;
}

function getRoomIcon(rid) {
    let roomIcon = RoomIconList[rid];

    if (!roomIcon) {
        RoomIconList[rid] = new RoomIcon(rid);
        roomIcon = RoomIconList[rid];
    }
    return roomIcon;
}
