import $ from 'jquery';
import * as Settings from '../feature/settings.js';
import * as Filter from '../feature/filter.js';

export default class MentionButton {

    constructor(rid) {
        this.rid = rid;
        this.$icon = $('<span class="icoFontTo icoSizeLarge"></span>');
        this.$li = $('<li role="button" class="_showDescription" aria-label="Toのみを表示します" style="cursor:pointer;"></li>');
        this.$el = $('<ul style="display:inline-block;margin-right:10px;"></ul>');
        this.$el.append(this.$li.append(this.$icon));
        this.setColor();
        this.$el.on('click', () => {
            let list = Settings.get('w-filter-mention-list', []);
            let index = list.indexOf(this.rid);

            if (index != -1) {
                list.splice(index, 1);
            } else {
                list.push(this.rid);
            }
            Settings.set('w-filter-mention-list', list);
            this.setColor();
            Filter.mention(this.rid);
        });
    }

    setColor() {
        if(Settings.contain('w-filter-mention-list', this.rid)){
            this.$icon.css({color: '#00558c'});
        }else{
            this.$icon.css({color: '#444444'});
        }
    }

    render() {
        return this.$el;
    }
};
