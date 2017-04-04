import $ from 'jquery';
import hljs from 'highlight.js';
import * as Settings from '../feature/settings.js';

let observedTargets = [];
let observer = new IntersectionObserver(function (changes) {
    for (let change of changes) {
        hljs.highlightBlock(change.target);
        observer.unobserve(change.target);
    }
}, {});

export function apply($el) {
    if (!Settings.get('w-highlight-code')) {
        return;
    }

    observedTargets.forEach(function (t) {
        observer.unobserve(t);
    });

    $el.each(function (i, block) {
        observer.observe(block);
        observedTargets.push(block);
    });
}

let $displaySettings = $('label[for="_shortenUrl"]').parent().parent();
Settings.addCheckBox('w-highlight-code', 'コードブロックのシンタックスハイライト', $displaySettings, function(){
    Settings.reloadTimeline();
}, true);
