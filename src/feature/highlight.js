import $ from 'jquery';
import hljs from 'highlight.js';

export function code($element) {
    $element.each(function(i, block) {
        hljs.highlightBlock(block);
    });
}
