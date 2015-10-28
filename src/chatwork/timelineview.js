import $ from 'jquery';
import * as InlineImage from '../feature/inline-image.js';
import * as Stamp from '../feature/stamp.js';

$(function () {
    let oldGMP = TimeLineView.prototype.getMessagePanel;
    TimeLineView.prototype.getMessagePanel = function (a, b) {
        return Stamp.replace(InlineImage.replace(oldGMP.apply(this, arguments)));
    };

    let oldRTL = TimeLineView.prototype.renderTimeLine;
    TimeLineView.prototype.renderTimeLine = function (a, f) {
        oldRTL.apply(this, arguments);
        InlineImage.delegateModalEvent();
        Stamp.delegateStampEvent();
    };
});
