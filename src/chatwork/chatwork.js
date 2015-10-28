import $ from 'jquery';
import * as Notification from '../feature/notification.js';

$(function () {
    let oldPopup = CW.popup;
    CW.popup = function(b, f, d, e){
        let chat = {
            msg: d
        };
        if (Notification.isInfo(chat) ||
            Notification.isIgnoredRoom(parseInt(e))) {
            if(wfocus){
                return;
            }
            wfocus = !0;
            setTimeout(function(){
                wfocus = !1;
            }, 200);
            return;
        }
        oldPopup.apply(this, arguments);
    };
});
