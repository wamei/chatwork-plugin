import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    var oldUpdateRoomData = RL.updateRoomData;
    RL.updateRoomData = function(a){
        var b = this;
        oldUpdateRoomData.call(this, a);
        for (var i in a) {
            var room = RL.rooms[i];
            if (room == void 0 || a[i].chat_list == null) {
                continue;
            }
            var unread = room.getUnreadNum();
            var chats = room.timeline.chat_list;
            for(var e = chats.length-1, l = e; l > e - unread; l--){
                if(chats[l] == void 0){
                    continue;
                }
                if (Notification.isInfo(chats[l])) {
                    if(chats[l].w_mention){
                        continue;
                    }
                    chats[l].w_mention = true;
                    room.read_num += 1;
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
        }
        b.build();
    };
});
