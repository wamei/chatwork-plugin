import $ from 'jquery';

export default class Snippet {
    constructor(keyCode, regExp, snippet) {
        this.keyCode = keyCode;
        this.regExp = regExp;
        this.snippet = snippet;
    }

    apply(keyCode) {
        window.up_key = keyCode;
        let d = $C("#_chatText");
        if (!(window.up_key !== this.keyCode || window.press_key !== this.keyCode)) {
            let a = d.val(),
                b = d.prop("selectionStart"),
                e = d.prop("selectionEnd");
            b === e && (e = a.substr(0, b).replace(this.regExp, this.snippet), a = a.substr(b), d.val(e + a), d.prop("selectionStart", e.length), d.prop("selectionEnd", e.length));
        }
    }
};
