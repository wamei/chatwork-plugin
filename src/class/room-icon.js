import $ from 'jquery';
import * as Settings from '../feature/settings.js';

export default class RoomIcon {
    constructor(rid) {
        this.rid = rid;
    }

    get() {
        return Settings.get('w-room-icon-' + this.rid, '');
    }

    openSetting() {
        this.newImage = 'nochange';
        this.$default = $('<div class="controlContent">').empty().append(RL.rooms[this.rid].view.getIcon('html', 'medium', true));
        this.$prev = $('<div class="controlContent">').empty().append(RL.rooms[this.rid].view.getIcon('html', 'medium'));
        this.$new = $('<div class="controlContent">').empty();
        this.$input = $('<input type="file" style="width:100%">');
        this.$setting = $('<div class="_cwDGBase dialogBase" style="z-index: 1003;">')
            .append(
                $('<div class="_cwDGWrapper dialogContent" style="width: 650px; height: 250px; margin-top: 61px;">')
                    .append($('<h1 class="contentHl dialogContentH1 autotrim" style="display: block;">ルームアイコンの変更</h1>'))
                    .append($('<div class="_cwDGTitleButton windowButton linkIconStatus" style="display: block;"><span role="button" aria-label="閉じる" class="_cwDGButton icoFontCancel icoSizeLarge"></span></div>')
                            .on('click', () => {
                                this.closeSetting();
                            }))
                    .append($('<div style="" class="_cwDGFooter dialogContentFooter">')
                            .append($('<div role="button" aria-label="保存する" class="_cwDGButton button btnPrimary" data-idx="0">保存する</div>')
                                    .on('click', () => {
                                        this.setIcon();
                                        this.closeSetting();
                                    }))
                            .append($('<div role="button" aria-label="キャンセル" class="_cwDGButton _cwDGButtonCancel button buttonGray" data-idx="1">キャンセル</div></div>')
                                    .on('click', () => {
                                        this.closeSetting();
                                    }))
                           )
                    .append(
                        $('<div class="dialog floatWindowContent _cwDG" role="dialog" style="display: block; height: 337px; overflow: auto;">')
                            .append($('<div class="_cwFWContent" style="float:left;">')
                                    .append($('<div class="controlGroup">')
                                            .append('<label class="controlLabel" style="width:150px;">デフォルトアイコン</label>')
                                            .append(this.$default)))
                            .append($('<div class="_cwFWContent" style="float:left;">')
                                    .append($('<div class="controlGroup">')
                                            .append('<label class="controlLabel" style="width:150px;">現在のアイコン</label>')
                                            .append(this.$prev)))
                            .append($('<div class="_cwFWContent" style="float:left;">')
                                    .append($('<div class="controlGroup">')
                                            .append('<label class="controlLabel" style="width:150px;">新しいアイコン</label>')
                                            .append(this.$new)))
                            .append(this.$input
                                    .on('change', () => {
                                        this.readFileBase64();
                                    }))
                            .append('<br><br>')
                            .append($('<input type="button" value="デフォルトアイコンに戻す">')
                                    .on('click', () => {
                                        this.revertIcon();
                                    }))
                    )
            );
        this.$setting.appendTo($('body'));
    }

    closeSetting() {
        this.$setting.remove();
    }

    readFileBase64() {
        let file = this.$input[0].files[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e1) => {
                var str = e1.target.result;
                this.newImage = str;
                this.$new.empty().append('<img class="' + CW.view.getAvatarClass("medium") + '" src="' + str + '"/>');
            };
            reader.onerror = function(){
                alert('file load error');
            };
        }
    }

    setIcon() {
        let key = 'w-room-icon-' + this.rid;
        if (this.newImage == 'default' || this.newImage == '') {
            Settings.remove(key);
        } else if (this.newImage != 'nochange') {
            Settings.set('w-room-icon-' + this.rid, this.newImage);
        }
        RL.build();
    }

    revertIcon() {
        this.$new.empty().append(RL.rooms[this.rid].view.getIcon('html', 'medium', true));
        this.newImage = 'default';
    }
};
