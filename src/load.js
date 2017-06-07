import $ from 'jquery-o';

$(function () {
    let chatwork = $("body");
    chatwork.after(
        $('<script>')
            .attr('src', 'https://wamei.github.io/chatwork-plugin/built/bundle.js')
    );
    chatwork.after(
        $('<link rel="stylesheet">')
            .attr('href', 'https://wamei.github.io/chatwork-plugin/built/bundle.css')
    );
});
