import $ from 'jquery-o';

$(function () {
    let chatwork = $("script[src*='chatwork_all_ja.min.js']");
    chatwork.after(
        $('<script>')
            .attr('src', chrome.extension.getURL('built/bundle.js'))
    );
    chatwork.after(
        $('<link rel="stylesheet">')
            .attr('href', chrome.extension.getURL('built/bundle.css'))
    );
});
