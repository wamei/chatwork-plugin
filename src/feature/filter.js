import $ from 'jquery';
import * as Settings from '../feature/settings.js';

export function mention(rid) {
    let list = Settings.get('w-filter-mention-list', []);
    let index = list.indexOf(rid - 0);
    if (index == -1) {
        return;
    }
    let timeline = $('#_timeLine');
    timeline.find('.chatTimeLineMessage').not('.chatTimeLineMessageMention')
        .each(function(){
            $(this).remove();
        });
}
