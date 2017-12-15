import $ from 'jquery';
import * as Settings from '../feature/settings.js';

$(function(){
    var preserved_category = [
        'all',
        'contact',
        'group',
        'mute'
    ];
    $('#_categoryDisplay').html('').css('visibility', 'hidden').appendTo('#_roomListArea');
    $('#_chatCagegorySystemList').html('');
    RL.__proto__.filtered_room_list_id = [];
    RL.__proto__.my_filter_category = {};
    RL.__proto__.my_filter_category_unread = {};
    var oldBuild = RL.build;
    RL.build = function(e) {
        var t = this;
        if (e = e || !1, t.has_update) return t.load();
        var n = t.getSortedRoomList();
        t.filtered_room_list = [];
        // wamei------------------
        t.filtered_room_list_id = [];
        t.my_filter_category = {};
        t.my_filter_category_unread = {};
        var sortedCategory = t.getSortedCategoryList();
        for(var i = 0; i <  sortedCategory.length; i++){
            addRoom(sortedCategory[i], true);
        }
        addRoom('all', false);
        function addRoom(fc, dup){
            var a = null,
            r = !1,
            s = {};
            t.unread_room_sum = 0, t.mention_room_sum = 0, t.mytask_room_sum = 0, t.unread_total = 0, t.mytask_total = 0;
            t.mytask_total = 0; // wamei add
            t.my_filter_category_unread[fc] = 0; // wamei add
            if (fc && !t.category_defaults[fc]) { // wamei replace
                r = !0;
                for (var l = 0, c = t.category_dat[fc].list.length; l < c; l++) s[t.category_dat[fc].list[l]] = !0; // wamei replace
            }
            var u = [];
            t.filter_word && (u = CW.splitWithSpace(t.filter_word));
            for (var d = 0; d < n.length; d++)
                if (void 0 != n[d]) {
                    var p = (a = t.rooms[n[d]]).getUnreadNum(),
                    _ = 0;
                    if (p > 0 && (t.unread_total += p, t.unread_room_sum++, (_ = a.getMentionNum()) > 0 && t.mention_room_sum++),
                        a.mytask_num > 0 && (t.mytask_total += a.mytask_num, t.mytask_room_sum++), u.length > 0) {
                        var h = a.getName();
                        if (!h) continue;
                        if ("contact" == a.type) {
                            if (!AC.isMatchedWithKeyList(u, a.getAccountId())) continue
                        } else if (!CW.isMatchedWithKeyList(u, h)) continue
                    } else { // if (!RM || a.id != RM.id || void 0 == t.filter_remain_flag[a.id]) {
                        if (r) {
                            if (1 != s[a.id]) continue
                        } else {
                            if ("contact" == t.filter_category && "contact" != a.type) continue;
                            if ("group" == t.filter_category && "group" != a.type) continue;
                            if ("mytask" == t.filter_category && 0 == a.mytask_num) continue;
                            if ("mute" == t.filter_category && 0 == a.mute) continue
                        }
                        if (t.filter_readonly && 0 == p) continue;
                        if (t.filter_toonly && 0 == _) continue;
                        if (t.filter_taskonly && 0 == a.mytask_num) continue;
                        if (t.filter_internalonly && !a.isInternal()) continue
                    }
                    if(!dup && t.filtered_room_list.includes(n[d])) continue; // wamei add
                    if ("mute" == t.filter_category && 0 == a.mute) continue; // wamei add
                    if ("contact" == t.filter_category && "contact" != a.type) continue; // wamei add
                    if ("group" == t.filter_category && "group" != a.type) continue; // wamei add
                    if ("mytask" == t.filter_category && 0 == a.mytask_num) continue; // wamei add
                    t.my_filter_category_unread[fc] += p; // wamei add
                    t.filtered_room_list_id.push(fc); // wamei add
                    t.filter_remain_flag[a.id] = !0,
                    t.filtered_room_list.push(n[d])
                }
        }
        //------------------------
        t.view.build(t.filtered_room_list, t.filtered_room_list_id, t.filter_toonly || t.filter_readonly || t.filter_taskonly || t.filter_internalonly), t.view.updateSumNumbers(), // wamei replace
        t.view.setFilterTitle(),
        t.lazy_select ? void 0 != t.rooms[t.lazy_select] ? (t.selectRoom(t.lazy_select, t.lazy_select_chat),
                                                            t.view.scrollToRoom(t.lazy_select, 100),
                                                            t.lazy_select = 0, t.lazy_select_chat = "") : RM && (t.lazy_select = 0, t.lazy_select_chat = "",
                                                                                                                   CW.alert("メンバーが居ません", function() {
                                                                                                                       t.selectRoom(RM.id)
                                                                                                                   })) : !e && t.rebuild_room && RM && RM.build(), e || (t.rebuild_room = !1)
    };
    RL.view.mySelectCategoryToggle = function(id){
        var a = this;
        if(!a.model.my_filter_category[id]){
            a.model.my_filter_category[id] = id;
        }else{
            delete a.model.my_filter_category[id];
        }
        Settings.set("w-ui_category_list", JSON.stringify(a.model.my_filter_category));
    };
    RL.view.mySelectCategory = function(id, show){
        var a = this;
        if(show){
            a.model.my_filter_category[id] = id;
        }else{
            delete a.model.my_filter_category[id];
        }
        Settings.set("w-ui_category_list", JSON.stringify(a.model.my_filter_category));
    };
    var oldSC = RL.selectCategory;
    RL.selectCategory = function(){
        var b = this;
        oldSC.apply(this, arguments);
        RL.view.setFilterTitle();
        var position = 0;
        if (!preserved_category.includes(b.filter_category)) {
            position = $('#_categoryDisplay_' + b.filter_category).position().top - $('#_roomListArea').position().top + $('#_roomListArea').scrollTop();
        }
        $('#_roomListArea').animate({scrollTop: position}, {queue : false});
    };
    RoomView.prototype.readFileBase64 = function(e) {
        var file = e.target.files[0]
        if(file)
        {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e1){
                var str = e1.target.result;
                $("#wameiz_change_room_icon_file").attr('data-wameiz_change_room_icon_file', str);
                $('#wameiz_change_room_icon_new')
                    .empty()
                    .append('<img class="' + CW.view.getAvatarClass("medium") + '" src="' + str + '"/>');
            };
            reader.onerror = function(){
                alert('file load error');
            };
        }
    }
    var oldViewBuild = RL.view.build;
    RL.view.build = function(b, id, show){
        var a = this;
        a.model.prepareRM();
        var prevId = 0;
        var d = "",
            e = b.length,
            f = e;
        if (e) {
            var ui_category_list = Settings.get('w-ui_category_list');
            if(ui_category_list){
                a.model.my_filter_category = JSON.parse(ui_category_list);
            }
            $C("#_chatListEmptyArea").hide();
            if (e > a.room_show_limit) f = a.room_show_limit;
            for (var g = 0; g < f; g++){
                if(b[g] != void 0){
                    if(id && id[g] != prevId){
                        if(prevId != 0){
                            d += '</ul>';
                        }
                        prevId = id[g];
                        var name;
                        if(id[g] == 'all'){
                            name = 'その他のチャット一覧';
                        }else{
                            name = $C("#_chatCategoryUserList").find("[data-cat-id=" + id[g] + "]").find("span._categoryName").text();
                        }
                        var unread = '';
                        if(a.model.my_filter_category[id[g]] && a.model.my_filter_category_unread[id[g]] > 0 && !show){
                            unread = '<ul class="menuListTitle w_category_unread_'+id[g]+'" style="position:absolute;right:3px;top:0px;"><li><ul class="incomplete"><li role="listitem" class="_unreadBadge unread"><span class="icoFontActionUnread"></span>'+a.model.my_filter_category_unread[id[g]]+'</li></ul></li></ul>';
                        }
                        d += '<div id="_categoryDisplay_' + id[g] + '" class="chatCategoryTitle" style="cursor: pointer; background-color: rgb(211, 211, 211);"><span style="margin: 8px;" id="_categoryDisplayTitle_' + id[g] + '" class="categoryDisplayTitle">' + name + '</span>'+unread+'</div><ul role="list" class="menuListTitle cwTextUnselectable" id="_categoryDisplayList_'+id[g]+'" style="display:block;">';
                    }
                    d += a.getRoomItemPanel(b[g]);
                }
            }
            e > f && (d += '<div class="roomLimitOver"><div>' + L.chat_rest_roomtip + (e - a.room_show_limit) +
                '</div><div id="_roomMore" class="button">' + L.chat_show_more + "</div></div>");
            $C("#_roomListItems").html(d);
            if(id){
                if(!show){
                var categoryList = a.model.getSortedCategoryList();
                categoryList.push('all');
                for(var i = 0; i < categoryList.length; i++){
                    (function(key){
                        $("#_categoryDisplay_"+key).click(function (event) {
                            $('.w_category_unread_' + key).hide();
                            $("#_categoryDisplayList_"+key).animate({height: 'toggle'}, 300, function(){
                                a.mySelectCategoryToggle(key);
                                a.model.build();
                            });
                            event.stopPropagation();
                        });
                    })(categoryList[i]);
                }
                for(var key in a.model.my_filter_category){
                    $("#_categoryDisplayList_"+key).hide();
                }}
            }
            b = RL.getFocusedRoomId();
            b > 0 && a.model.focusRoom(b);
        } else $C("#_roomListItems").quickEmpty(), $C("#_chatListEmptyArea ._chatListEmpty").hide(), a.model.filter_readonly ? $C("#_chatListUnreadEmpty").show() : a.model.filter_toonly ? $C("#_chatListToEmpty").show() : a.model.filter_taskonly && $C("#_chatListTaskEmpty").show(), $C("#_chatListEmptyArea").show();
    };
    RL.build();
});
