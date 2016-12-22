import $ from 'jquery';
import * as Settings from '../feature/settings.js';

export function mention(rid) {
    let timeline = $('#_timeLine');
    let target = timeline.find('.chatTimeLineMessage').not('.chatTimeLineMessageMention');
    if (!Settings.contain('w-filter-mention-list', rid - 0)) {
        target.each(function(){
            $(this).children().css('display', '');
        });
        return;
    }
    target.each(function(){
        $(this).children().css('display', 'none');
    });
}
