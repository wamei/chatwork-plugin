import $ from 'jquery';
import hljs from 'highlight.js';
import * as Settings from '../feature/settings.js';

export function code($element) {
    if (Settings.get('w-highlight-code')) {
        $element.each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }
}

export function replace(htmlString) {
    let $el = $(htmlString);
    code($el.find('code'));
    return $el.wrap('<p>').parent().html();
}

let $displaySettings = $('label[for="_shortenUrl"]').parent().parent();
Settings.addCheckBox('w-highlight-code', 'コードブロックのシンタックスハイライト', $displaySettings, function(){
    Settings.reloadTimeline();
}, true);
