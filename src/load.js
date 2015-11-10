import $ from 'jquery-o';

$(function () {
    let chatwork = $("script[src*='chatwork_all_']");
    chatwork.after(
        $('<script>')
            .attr('src', chrome.extension.getURL('built/bundle.js'))
    );
    chatwork.after(
        $('<link rel="stylesheet">')
            .attr('href', chrome.extension.getURL('built/bundle.css'))
    );
});
