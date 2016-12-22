import $ from 'jquery';
import * as Settings from '../feature/settings.js';

export function mention(rid) {
    let timeline = $('#_timeLine');
    let dateHead = timeline.find('.dateHead');
    dateHead.css('z-index', '2');
    dateHead.css('margin', '0');
    dateHead.css('padding-bottom', '10px');
    let bottom = timeline.find('#_messageIdEnd');
    let target = timeline.find('.chatTimeLineMessage').not('.chatTimeLineMessageMention');
    let offset = timeline.offset();
    let element = $(document.elementFromPoint(offset.left + 10, offset.top + 1));
    if (!element.hasClass('chatTimeLineMessage') && !element.hasClass('dateHead')) {
        element = element.parent();
    }

    let is_bottom = bottom.position().top < timeline.innerHeight();

    if (!Settings.contain('w-filter-mention-list', rid - 0)) {
        target.children().css('display', '');
    } else {
        target.children().css('display', 'none');
    }
    if (is_bottom) {
        bottom[0].scrollIntoView();
    } else {
        element[0].scrollIntoView();
    }
}
