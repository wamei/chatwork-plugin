import $ from 'jquery';
import * as Settings from '../feature/settings.js';

export default class AutoreadButton {

    constructor(rid) {
        this.rid = rid;
        this.$icon = $('<span class="icoFontActionUnread icoSizeLarge"></span>');
        this.$li = $('<li role="button" class="_showDescription" aria-label="自動既読機能のON/OFFが行えます" style="cursor:pointer;"></li>');
        this.$el = $('<ul style="display:inline-block;margin-right:10px;"></ul>');
        this.$el.append(this.$li.append(this.$icon));
        this.setColor();
        this.$el.on('click', () => {
            let list = Settings.get('w-autoread-room-list', []);
            let index = list.indexOf(this.rid);

            if(index != -1){
                list.splice(index, 1);
            }else{
                if (window.confirm('このチャットを自動既読モードにしますか？\n※通知OFFと組み合わせるとTOも拾えなくなります！※')) {
                    list.push(rid);
                }
            }
            Settings.set('w-autoread-room-list', list);
            this.setColor();
            RL.build();
        });
    }

    setColor() {
        let list = Settings.get('w-autoread-room-list', []);
        if(list.indexOf(this.rid) != -1){
            this.$icon.css({color: '#444444'});
        }else{
            this.$icon.css({color: '#00558c'});
        }
    }

    render() {
        return this.$el;
    }
};
