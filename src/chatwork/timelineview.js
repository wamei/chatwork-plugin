import $ from 'jquery';
import * as InlineImage from '../feature/inline-image.js';
import * as Highlight from '../feature/highlight.js';

$(function () {
    let oldRTL = TimeLineView.prototype.renderTimeLine;
    TimeLineView.prototype.renderTimeLine = function (a, f) {
        oldRTL.apply(this, arguments);
        let $timeline = $("#_timeLine");
        InlineImage.apply($timeline.find('.timelineMessage__message'));
        Highlight.apply($timeline.find('code'));
    };
});
