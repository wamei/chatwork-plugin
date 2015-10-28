import $ from 'jquery';
import Snippet from '../model/snippet.js';

var info  = new Snippet(73,  /``i([\s\S]+?)``i$/, "[info]$1[/info]");
var title = new Snippet(84,  /``t([\s\S]+?)``t$/, "[title]$1[/title]");
var code  = new Snippet(192, /```([\s\S]+?)```$/, "[code]$1[/code]");

export function apply(keyCode) {
    info.apply(keyCode);
    title.apply(keyCode);
    code.apply(keyCode);
}
