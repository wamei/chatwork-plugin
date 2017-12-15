import $ from 'jquery';
import * as Settings from '../feature/settings.js';

$(function(){
    var wameiz_display_mode = true;
    $('#_categoryDisplay').html('').css('visibility', 'hidden').appendTo('#_roomListArea');
    $('#_chatCagegorySystemList').html('');
    RL.__proto__.my_filter_category = {};
    RL.__proto__.my_filter_category_unread = {};
    var oldBuild = RL.build;
    RL.build = function(){
        var b = this;
        if(!wameiz_display_mode){
            b.filter_category = 'all';
            oldBuild();
            return;
        }
        if (b.has_update) return b.load();
        else {
            var a = b.getSortedRoomList();
            b.filtered_room_list = [];
            b.filtered_room_list_id = [];
            b.my_filter_category = {};
            b.my_filter_category_unread = {};
            var sortedCategory = b.getSortedCategoryList();
            for(var i = 0; i <  sortedCategory.length; i++){
                addRoom(sortedCategory[i]);
            }
            addRoom('all', true);
            b.view.build(b.filtered_room_list, b.filtered_room_list_id, b.filter_toonly || b.filter_readonly || b.filter_taskonly);
            b.view.updateSumNumbers();
            if (b.lazy_select)
                if (b.rooms[b.lazy_select] != void 0) b.selectRoom(b.lazy_select, b.lazy_select_chat), b.lazy_select = 0, b.lazy_select_chat = 0;
            else {
                if (RM) b.lazy_select = 0, b.lazy_select_chat = 0, CW.alert(L.chatroom_error_no_member, function () {
                    b.selectRoom(RM.id);
                })
            } else b.rebuild_room &&
                RM && RM.build();
            b.rebuild_room = !1;
        }
        function IsExists(array, value) {
            for (var i =0, len = array.length; i < len; i++) {
                if (value == array[i]) {
                    return true;
                }
            }
            return false;
        }
        function addRoom(fc, dup){
            var d = null,
                e = !1,
                k = {};
            b.unread_room_sum = 0;
            b.mention_room_sum = 0;
            b.mytask_room_sum = 0;
            b.unread_total = 0;
            b.mytask_total = 0;
            b.my_filter_category_unread[fc] = 0;
            if (fc && !b.category_defaults[fc])
                for (var e = !0, d = 0, i = b.category_dat[fc].list.length; d < i; d++) k[b.category_dat[fc].list[d]] = !0;
            i = [];
            b.filter_word && (i = CW.splitWithSpace(b.filter_word));
            for (var h = 0; h < a.length; h++)
                if (a[h] != void 0) {
                    var d = b.rooms[a[h]],
                        j = d.getUnreadNum(),
                        n = 0;
                    j > 0 && (b.unread_total += j, b.unread_room_sum++, n = d.getMentionNum(), n > 0 && b.mention_room_sum++);
                    d.mytask_num > 0 && (b.mytask_total += d.mytask_num, b.mytask_room_sum++);
                    if (i.length > 0) {
                        j = d.getName();
                        if (!j) continue;
                        if (d.type == "contact") {
                            if (!AC.isMatchedWithKeyList(i, d.getAccountId())) continue
                        } else if (!CW.isMatchedWithKeyList(i, j)) continue
                    } else {// if (!RM || !(d.id == RM.id && b.filter_remain_flag[d.id] != void 0)) {
                        if (e) {
                            if (k[d.id] != !0) continue
                        } else {
                            if (fc == "contact" && d.type != "contact") continue;
                            if (fc == "group" && d.type != "group") continue;
                            if (fc == "mytask" && d.mytask_num == 0) continue
                        } if (b.filter_readonly && j == 0) continue;
                        if (b.filter_toonly && n ==
                            0) continue;
                        if (b.filter_taskonly && d.mytask_num == 0) continue;
                        if (b.filter_internalonly && !d.isInternal()) continue
                    }
                    if(dup && IsExists(b.filtered_room_list, a[h])) continue;
                    b.my_filter_category_unread[fc] += j;
                    b.filter_remain_flag[d.id] = !0;
                    b.filtered_room_list.push(a[h]);
                    b.filtered_room_list_id.push(fc);
                }
        }
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
        if(!wameiz_display_mode){
            oldSC.apply(this, arguments);
            return;
        }
        var b = this;
        oldSC.apply(this, arguments);
        var position = $('#_categoryDisplay_' + b.filter_category).position().top - $('#_roomListArea').position().top + $('#_roomListArea').scrollTop();
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
        if(!wameiz_display_mode){
            oldViewBuild.apply(this, arguments);
            return;
        }
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
                        d += '<div id="_categoryDisplay_' + id[g] + '" class="chatCategoryTitle" style="cursor: pointer; background-color: rgb(211, 211, 211);"><span id="_categoryDisplayTitle_' + id[g] + '" class="categoryDisplayTitle">' + name + '</span>'+unread+'</div><ul role="list" class="menuListTitle cwTextUnselectable" id="_categoryDisplayList_'+id[g]+'" style="display:block;">';
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
