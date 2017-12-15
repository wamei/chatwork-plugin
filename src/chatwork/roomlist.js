import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    let oldUpdateRoomData = RL.updateRoomData;
    RL.updateRoomData = function(a){
        let b = this;
        oldUpdateRoomData.call(this, a);
        for (var i in a) {
            let room = RL.rooms[i];
            if (room == void 0 || a[i].chat_list == null) {
                continue;
            }
            let unread = room.getUnreadNum();
            let chats = room.timeline.chat_list;
            let checked_index = room.timeline.checked || 0;
            let unread_index = chats.length - 1 - unread;
            let start = Math.max(checked_index, unread_index);
            for(var l = chats.length - 1; l > start; l--){
                if(chats[l] == void 0){
                    continue;
                }
                if (Notification.isTreatedTo(chats[l])) {
                    if(chats[l].w_mention){
                        continue;
                    }
                    chats[l].w_mention = true;
                    room.mention_num += 1;
                    continue;
                }
            }
            room.timeline.checked = chats.length - 1;
        }
        b.build();
    };
});
