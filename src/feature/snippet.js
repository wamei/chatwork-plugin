import $ from 'jquery';
import Snippet from '../class/snippet.js';

const info  = new Snippet(73,  /``i([\s\S]*?)``i$/, "[info]$1[/info]");
const title = new Snippet(84,  /``t([\s\S]*?)``t$/, "[title]$1[/title]");
const code  = new Snippet(192, /```([\s\S]*?)```$/, "[code]$1[/code]");

export function apply(keyCode) {
    info.apply(keyCode);
    title.apply(keyCode);
    code.apply(keyCode);
}
