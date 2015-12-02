import $ from 'jquery';
import * as Settings from '../feature/settings.js';

$(function(){
    var wameiz_display_mode = true;
    $('#_categoryDisplay').html('').css('visibility', 'hidden').appendTo('#_roomListArea');
    $('#_chatCagegorySystemList').html('');
    RL.my_filter_category = new Object();
    RL.my_filter_category_unread = new Object();
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
            b.my_filter_category_unread = new Object();
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
        if(a.model.my_filter_category[id] == null){
            a.model.my_filter_category[id] = id;
        }else{
            delete a.model.my_filter_category[id];
        }
        $.cookie("ui_category_list", JSON.stringify(a.model.my_filter_category), {
            expires: 3650
        });
    };
    RL.view.mySelectCategory = function(id, show){
        var a = this;
        if(show){
            a.model.my_filter_category[id] = id;
        }else{
            delete a.model.my_filter_category[id];
        }
        $.cookie("ui_category_list", JSON.stringify(a.model.my_filter_category), {
            expires: 3650
        });
    };
    var oldSC = RL.selectCategory;
    RL.selectCategory = function(a){
        if(!wameiz_display_mode){
            oldSC(a);
            return;
        }
        var b = this;
        oldSC(a);
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
                            name = $C("#_chatCategoryList").find("[data-cat-id=" + id[g] + "]").find("span._categoryName").text();
                        }
                        var unread = '';
                        if(a.model.my_filter_category[id[g]] && a.model.my_filter_category_unread[id[g]] > 0 && !show){
                            unread = '<ul class="incomplete" style="position:absolute;right:3px;top:0px;"><li role="listitem" class="_unreadBadge unread"><span class="icoFontActionUnread"></span>'+a.model.my_filter_category_unread[id[g]]+'</li></ul>';
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
                var ui_category_list = $.cookie('ui_category_list');
                if(ui_category_list !== undefined){
                    a.model.my_filter_category = JSON.parse(ui_category_list);
                }
                if(!show){
                var categoryList = a.model.getSortedCategoryList();
                categoryList.push('all');
                for(var i = 0; i < categoryList.length; i++){
                    (function(key){
                        $("#_categoryDisplay_"+key).click(function (event) {
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
    RL.myGetSortedRoomList = function(checked){
        var b = this;
        var d = [], e = [], k;
        for (k in b.rooms){
            checked[k] ? e.push(k) : d.push(k);
        }
        d = b.sortByName(d);
        e = b.sortByName(e);
        var a = 0;
        for (k = d.length; a < k; a++)
            e.push(d[a]);
        return e
    };
    RL.view.myPrepareCategory = function() {
        var a = this;
        var b = [], d = {}, e = [], f = $("#_newcatRoomlist"), g = $("#_chatCategoryList").cwToolTip({
            fixHeight: !0
        });
        $('#_sideContentTitleText').unbind().on('click', function(){
            wameiz_display_mode = !wameiz_display_mode;
            RL.build();
        });
        var m = $("#_newcatRoomfilter").cwSearchBox({
            placeholder: L.chat_search,
            update: function() {
                var a = RL.myGetSortedRoomList(d), g = 0, n = "";
                b = this.getVal().toLowerCase();
                e = [];
                for (var m = 0, l = a.length; m < l; m++) {
                    var p = RL.rooms[a[m]], r = p.getName();
                    if (!(b && r.toLowerCase().indexOf(b)===-1)) {
                        e.push(p.id);
                        if (e.length >= 200)
                            break;
                        r = $.cwCheckBox.create(!!d[p.id], "", p.id, {
                            id: "_newcatCheck" + p.id,
                            "class": "_newcatCheck"
                        });
                        n += '<tr class="_newcatRoom _cwSelectableRow"><td class="check">' + r + '</td><td class="_newcatRoom_name"><span class="ui_room_icon">' + p.getIcon() + "</span></td><td>" + CW.getRoomName(p.id) + "</td></tr>"
                    }
                }
                // n[g++] = "";
                f.html(n)
            }
        }), l = $("#_chatCategoryAddContent").cwDialog({
            width: 650,
            open: function(b) {
                if (this.data.cat_id = b) {
                    for (var e = a.model.category_dat[b], b = e.name, e = e.list, f = 0, h = e.length; f < h; f++)
                        d[e[f]]=!0;
                    this.setOption({
                        title: L.chat_category_edit + ": " + escape_html(b),
                        buttonLabels: [L.button_save_long, L.button_cancel]
                    })
                } else
                    this.setOption({
                        title: L.chat_category_create,
                        buttonLabels: [L.button_create_long, L.button_cancel]
                    });
                $("#_categoryName").val("");
                $("#_newcatSelectNum").empty();
                m.setVal("");
            },
            close: function() {
                b = [];
                d = {};
                e = []
            },
            buttonLabels: [L.button_create_long, L.button_cancel],
            buttonSubmit: 0,
            buttonCancel: 1,
            buttonClick: function(b) {
                if (b === 0) {
                    var b = [], e = $("#_categoryName").val();
                    e || b.push(L.chat_category_error_no_name);
                    var f = [], h;
                    for (h in d)
                        d[h] && f.push(h);
                    f.length || b.push(L.chat_category_error_no_chats);
                    if (b.length)
                        CW.alert(b.join("\n"));
                    else {
                        h = {
                            name: e,
                            r: f
                        };
                        this.data.cat_id ? (h.cmd = "edit_category", h.cat_id = this.data.cat_id) : h.cmd = "add_category";
                        var j = this;
                        CW.postSync("gateway.php", h, function(b) {
                            for (var d in b.cat_dat)
                                a.model.category_dat[d] = b.cat_dat[d];
                            a.model.buildCategory();
                            a.model.selectCategory(d);
                            j.close()
                        })
                    }
                }
            }
        });
        var r = function(a, b) {
            var e;
            e = $.isArray(a) ? a : [a];
            for (var f = 0, h = e.length; f < h; f++) {
                var j = e[f], g = $("#_newcatCheck" + j);
                g.length && (g = g.cwCheckBox(), b ? g.check() : g.unCheck());
                d[j]=!!b
            }
            e = 0;
            for (f in d)
                d[f] && e++;
            e ? $("#_newcatSelectNum").html(e + L.multiselect_label) : $("#_newcatSelectNum").empty()
        };
        $("#_newcatRoomlist").on("cwCheckBox_update", function(a, b, d) {
            r(d, b);
            return !1
        });
        $("#_newcatCheckAll").cwCheckBox({
            update: function() {
                r(e,
                this.isChecked())
            }
        });
        $("#_chatCategoryList").on("click", "._categoryEdit", function() {
            var b = $(this).closest("li._chatCategoryItem").attr("data-cat-id"), d = a.model.category_dat[b].name;
            l.open(b);
            $("#_categoryName").val(d);
            r(a.model.category_dat[b].list, !0)
        }).on("click", "._categoryDelete", function() {
            var b = $(this).parents("li._chatCategoryItem"), d = b.data("cat-id"), b = b.find("._categoryName").text();
            CW.view.confirmDelete(L.chat_category_confirm_delete.replace(/%%category_name%%/, b), function() {
                CW.postSync("gateway.php",
                {
                    cmd: "delete_category",
                    cat_id: d
                }, function() {
                    a.model.category_dat[d] != void 0 && delete a.model.category_dat[d];
                    a.model.buildCategory()
                })
            })
        })
    };
    RL.view.myPrepareCategory();
    RL.build();

    $('#_logo').before(
        $('<div style="position:relative;top:-20px;">').append(
            $('<div id="wameiz_historyBack" class="_showDescription" aria-label="戻る" style="cursor:pointer; margin:5px;">')
                .append(
                    $('<img class="normal" width="32" height="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gkSBSkRO91XaAAAATxJREFUaN7t2mFRxDAQxfG3pyBSKgEk4AAkoOQkVAI4QAISkNBz8OfLlSnQMmmZgcm+PAX9dZvMbhqpp6fnaIB7KyyAC3bkGitsevBXbFowUIAnVpIV+8pGrLCpwDXYNGBgAN6oSBbsRGWssE2DgZu92GbBc198JP/97HFw4hlb/TLDCStJpx3Yc+vY6goDo6QUw3s4YX/8pK+tYirsZoWBIulF0pBtmgsn7DdwduynNQwM2bEfFV5gi5InnLAzeHLBzmv4TtLFBey3hld26WIBdkF7d1qWvXR29OZ4GBEXSbeSni0qbHvikQ2999SyefRp19uJeJD0KLe0/Ofhz9EZKj3ZgOf+2+b/8BF0po2sCp1t9x5sbvEshw6be1o16MzNySo6e0dWrG7TLocOK/AS7TZ0nNXT09Pzi7wDttbdOVSILHgAAAAASUVORK5CYII=">')
                ).append(
                    $('<img style="display:none;" class="hover" width="32" height="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gkSBhYVZigHFAAAAXlJREFUaN7t2rGRwjAQBdCPhwJowjklHJnDowM7d0IlTpRDCYTKKOGcqwmXQGIYMYxvsCwZfa22Ar/ZlbW7IyBHjhyuobSpv/0NxcrY87fB25WwZwB1DFVWSMIGB8eGDVbSSpvdeF5/Y/txbgNhbwD2Md4UhSSsVzAD1htYabMH8Bc71ssZHrE3ADuGbq+QhF0EVtr8sGGdwWNfTIcFgA3rELAKmB07q6SVNh079uMMxzgEBAOnhP0XPLaKXUrYSTBLX+wFnDL2DZw69uVasvriZLHPDDMOAc5gSdhHSYvBPsBHAIMUsLwzzLy98HEPJ4+W3WmJ7KVTR09uPNqqHAAcAFxFZFjsxiM19NytJT161iK+rcoGwElMhq1M13Bc2bZVuaHJsPXRFwBN8iU9gR5EgC30gQm9+AVAW5U9E9rLkwcmtLdHLRa6FwFmQXt/emgNHb0IcOzoYI9LLfSFvrV0aEWfQwdla+mQ7Sa2TGOlTHfIkSNHjgVxB6sJnIWhakkCAAAAAElFTkSuQmCC">')
                ).on('click', function(){
                    window.history.back();
                })
                .on('mouseover', function(){
                    $(this).children('.normal').hide();
                    $(this).children('.hover').show();
                })
                .on('mouseout', function(){
                    $(this).children('.hover').hide();
                    $(this).children('.normal').show();
                }),
            $('<div id="wameiz_historyNext" class="_showDescription" aria-label="進む" style="cursor:pointer; margin:5px;">')
                .append(
                    $('<img class="normal" width="32" height="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gkSBS4blEkosQAAAUVJREFUaN7t2lFVwzAYxfH79SAACzioBJCAg04CSiahcwAOkNA6QMLq4PKysjK2LgEOh9yb/3sffidJmy0BarXab0aycwPTCs1jvRvYA82v9W5gknwmeesEJslBEs319NC8nhaaab2RbJ3AJLmXQDOv8tHMb0/y3gnMn+y/gyQLniCbiNjlPNAU/groc0e6dPCM3rpM6WW7iNg4jPBcl/JLSwn8gV7biipN6WUjgIeImNRHeK4F8HpupFXBF9HK4CW6VV/Dp02HNT26gI9oIzAATI0TFsDjjdV0jhgbJ6zDZ+kTVh08ArhbYpXBVnvpi1hF8MsaFgCUPktW/3gkYVXAyVgF8FMO9l/01ycPpYK7YufkNw7SuqIXYT0fVsYmgnWwCeBBCnsFbHVPa3C6iaeLPQPupbEnYKv70h7YA3iLWq1WS+wdlg/QgweyRFEAAAAASUVORK5CYII=">')
                ).append(
                    $('<img style="display:none;" class="hover" width="32" height="32" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gkSBhYfhv3uCgAAAXdJREFUaN7t2rFxg0AQheFfjAugBDsgpwQ7I7Q7kHICuxIn5NCBHZKpBJPTBB3IifDg0QiD4PDe7r0G0Derg7cMEBISsmaKut1veb1IgLncEh0JGXRZ1G1pCQyw3wIdCTvSztHSwD36o6jb2AoY4Bk4ukBLBQOkLtCSwU7Q0sE9+quo29QKGOD+POnUChggXgPtE3iIfrQCHqJv6t+7om5PHi9bhzxLKu0TXrRp+Q7u0e+WwACvU5cOLeDJm5Ym8A96rIpqAwPsx/q3RvDo0qEVfBWtGTxEp1bAF2jfq+WcdMBThJ3EwNESuANe7iz9nfMsaSJLWAt36V9Y7eAGeBhiNYOb82Q7C9XyKlYj+HMMC6DpsVTlWXKw8gJgElYLeDJWA/htDhZg99+/eMG2NvslvM8TvgnrI7hbgvXtsXTRizVPeBWsL+DVsD6AmzWx0s9w81cv1jRhJ1ipYGdYieDKJVbaGa7m9mKfJ7wJVkTmfJ8REhIS8g2CS54vm/jkDwAAAABJRU5ErkJggg==">')
                ).on('click', function(){
                    window.history.forward();
                })
                .on('mouseover', function(){
                    $(this).children('.normal').hide();
                    $(this).children('.hover').show();
                })
                .on('mouseout', function(){
                    $(this).children('.hover').hide();
                    $(this).children('.normal').show();
                })));
});
