import $ from 'jquery-o';

$(function () {
    let chatwork = $("body");
    chatwork.after(
        $('<script>')
            .attr('src', chrome.extension.getURL('built/bundle.js'))
    );
    chatwork.after(
        $('<link rel="stylesheet">')
            .attr('href', chrome.extension.getURL('built/bundle.css'))
    );
});
