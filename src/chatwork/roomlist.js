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
            if (Notification.isAutoreadRoom(parseInt(i))) {
                var h = RL.rooms[i];
                CW.get("gateway.php", {
                    cmd: "read",
                    room_id: h.id,
                    mid: h.mid
                }, function(){
                    RL.build();
                }, function(){
                });
                room.read_num += unread;
                room.mention_num = 0;
                continue;
            }
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
