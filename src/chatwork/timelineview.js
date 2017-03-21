import $ from 'jquery';
import * as InlineImage from '../feature/inline-image.js';
import * as Stamp from '../feature/stamp.js';
import * as Highlight from '../feature/highlight.js';
import * as Filter from '../feature/filter.js';

$(function () {
    let oldGMP = TimeLineView.prototype.getMessagePanel;
    TimeLineView.prototype.getMessagePanel = function (a, b) {
        return Stamp.replace(oldGMP.apply(this, arguments));
    };

    let oldRTL = TimeLineView.prototype.renderTimeLine;
    TimeLineView.prototype.renderTimeLine = function (a, f) {
        oldRTL.apply(this, arguments);
        let $timeline = $("#_timeLine");
        InlineImage.apply($timeline.find('.chatTimeLineMessageArea'));
        Highlight.apply($timeline.find('code'));
        Stamp.delegateStampEvent();
        Filter.mention(RM.id);
    };
});
