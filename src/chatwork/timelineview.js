import $ from 'jquery';
import * as InlineImage from '../feature/inline-image.js';
import * as Stamp from '../feature/stamp.js';
import * as Highlight from '../feature/highlight.js';
import * as Filter from '../feature/filter.js';

$(function () {
    let oldGMP = TimeLineView.prototype.getMessagePanel;
    TimeLineView.prototype.getMessagePanel = function (a, b) {
        return Highlight.replace(Stamp.replace(InlineImage.replace(oldGMP.apply(this, arguments))));
    };

    let oldRTL = TimeLineView.prototype.renderTimeLine;
    TimeLineView.prototype.renderTimeLine = function (a, f) {
        oldRTL.apply(this, arguments);
        InlineImage.delegateModalEvent();
        Stamp.delegateStampEvent();
        Filter.mention(RM.id);
    };

    var a = 0, b = 0;
    TimeLineView.prototype.build = function(d) {
        var e = $C("#_timeLine"),
        g = $.extend({
            smoothScroll: !1,
            scrollTo: null,
            everScroll: !1,
            highlight: !1,
            jumpToCallback: function() {},
            sendingId: null
        }, d),
            d = g.scrollTo,
            i = $("#_messageIdEnd"),
            j = 0;
        if (i.length > 0) j = i.offset().top;
        var i = "",
            k = 0;
        k++;
        this.model.chat_list.length < this.model.room.chat_num ? (k++, i += '<div class="timeLineLoading"><img src="./imagenew/all/common/loader/img_loader_white.gif" />' + L.chat_loading + "</div>", this.model.has_old = this.model.room.buildtime ? !0 : !1) : this.model.has_old = !1;
        var k = this.model,
            h = [],
            m = null,
            l = 0,
            o = k.chat_list.length;
        if (a != k.room.id) this.start_index = 0;
        if (d && d != "End")
            for (var q =
                     0; q < o; q++)
                if (l = k.chat_list[q], d == l.id) {
                    m = q;
                    this.start_index = m - 1000;
                    break
                }
        if (a == k.room.id)
            if (g.everScroll) {
                var u = $C("#_timeLine").offset().top;
                if (!m)
                    for (var n = [], q = 0; q < o; q++) {
                        l = k.chat_list[q];
                        l.msg !== "[deleted]" && (n.push(q), 1000 < n.length && n.shift());
                        var x = $("#_messageId" + l.id);
                        if (x.length > 0 && u < x.offset().top) {
                            if (!k.has_new_message && !d) {
                                if (!k.has_old && q == 0) return !1;
                                d = l.id
                            }
                            m = q;
                            break
                        }
                    }
                l = typeof n[0] === "number" ? n[0] : m - 1000
            } else l = this.start_index;
        else l = m !== null ? m - 1000 : o - 2000;
        l < 0 && (l = 0);
        n = 0;
        for (q = l; q < o; q++)
            if (!(ST.data.show_delmessage ==
                  0 && k.chat_list[q].msg == "[deleted]") && (k.chat_list[q] && (h.push(k.chat_list[q]), n++), n >= 2000)) break;
        this.start_index = l;
        h.length > 1000 && h[h.length - 1].id != k.chat_list[o - 1].id ? (d == "End" && (d = !1), this.has_new = !0) : this.has_new = !1;
        n = k.sending_chat_list;
        if (n.length)
            for (q = 0; q < n.length; q++)(l = n[q]) && h.push(l);
        n = ST.data.show_delmessage == 0 ? this.model.getChatListWithoutDeleted().length : this.model.getChatList().length;
        q = this.model.room.getUnreadNum();
        i += this.getTimeLine(h, {
            unreadFrom: n - q,
            readLock: k.room.read_lock,
            editId: CS.chatedit_id,
            selectId: b
        });
        i += '<div id="_messageIdEnd" class="actionBarSpacer"></div>';
        var t = 0;
        g.smoothScroll && (t = g.sendingId ? 70 : 2000);
        h = !1;
        n = i;
        if (CW.last_timeline_buildkey != n) {
            this.renderTimeLine(e, i);
            if (a != k.room.id) a = k.room.id, b = 0;
            k.has_new_message = !1;
            g.sendingId && $C("#_timeLine").find("._sendingMessage img:last").hide().fadeIn(3E3);
            CW.last_timeline_buildkey = n;
            d || j < $C("#_chatSendArea").offset().top + 50 && (d = "End");
            if ((this.model.room.rswitch || d) && d) {
                var A = this,
                w = $("#_messageId" + d);
                w.length && (g.highlight && (b = d),
                             h = !0,
                             function() {
                                 var a = !1,
                                     b = function() {
                                         a = !0
                                     },
                                     d = $C("#_timeLine");
                                 d.one("scroll", b).scrollTo(w, t, function() {
                                     g.highlight && A.highlight(w);
                                     g.jumpToCallback()
                                 });
                                 setTimeout(function() {
                                     a || (d.unbind("scroll", b), d.trigger("scroll"))
                                 }, 0)
                             }())
            }
            AC.hasUnknown() && AC.getUnknown(function(a) {
                for (var b in a) $("._nameAid" + b).text(a[b].name)
            })
        } else d && (A = this, w = $("#_messageId" + d), w.length && (h = !0, $C("#_timeLine").scrollTo(w, t, function() {
            g.highlight && A.highlight(w);
            g.jumpToCallback()
        })));
        k.has_old && !h && setTimeout(function() {
            $C("#_timeLine").trigger("scroll")
        },
            100)
    };
});
