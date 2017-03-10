import $ from 'jquery';
import hljs from 'highlight.js';
import * as Settings from '../feature/settings.js';

export function apply($el) {
    if (!Settings.get('w-highlight-code')) {
        return;
    }
    $el.each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

let $displaySettings = $('label[for="_shortenUrl"]').parent().parent();
Settings.addCheckBox('w-highlight-code', 'コードブロックのシンタックスハイライト', $displaySettings, function(){
    Settings.reloadTimeline();
}, true);
