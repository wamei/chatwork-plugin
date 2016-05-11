import $ from 'jquery';

var settings = {};

export var get = function(key, defaultValue) {
    if (!settings[key]) {
        let ret = window.localStorage.getItem(key);
        if (!ret) {
            if (defaultValue === void 0) {
                defaultValue = null;
            }
            settings[key] = defaultValue;
        } else {
            settings[key] = JSON.parse(ret);
        }
    }
    return settings[key];
};

export var set = function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
    settings[key] = value;
    return value;
};

export var remove = function(key) {
    window.localStorage.removeItem(key);
    delete settings[key];
};

export var reloadTimeline = function() {
    let timeline = $('#_timeLine');
    let oldOffset = timeline[0].scrollTop;
    let oldHeight = timeline[0].scrollHeight;
    RM.timeline.view.build();
    let newHeight = timeline[0].scrollHeight;
    timeline.scrollTop(oldOffset + newHeight - oldHeight);
};

export var addCheckBox = function(key, label, $parent, save, defaultValue) {
    let flag = get(key);

    if (flag === null && defaultValue !== void 0) {
        flag = set(key, defaultValue);
    }

    let setCheckBox = function($el, flag) {
        if (flag) {
            $el.removeClass('_cwCBUnChecked');
            $el.addClass('_cwCBChecked');
            $el.removeClass('ico15Checkbox');
            $el.addClass('ico15CheckboxActive');
        } else {
            $el.removeClass('_cwCBChecked');
            $el.addClass('_cwCBUnChecked');
            $el.removeClass('ico15CheckboxActive');
            $el.addClass('ico15Checkbox');
        }
    };

    let box = $('<span role="checkbox" aria-checked="'+flag+'" type="checkbox" id="'+key+'" value="1" class="_cwCB"></span>');
    setCheckBox(box, flag);
    $parent.append($('<li class="_cwSelectableRow"></li>')
                   .append(box)
                   .append('<label for="'+key+'" class="ecfFCheckboxLbl">'+label+'</label>'));

    let oldOpenSettingDialog = ST.view.openSettingDialog;
    ST.view.openSettingDialog = function(){
        oldOpenSettingDialog.apply(this, arguments);

        setCheckBox(box, get(key));
        $('div[aria-label="保存する"]').one('click', function() {
            let checked = box.attr('aria-checked');
            let flag = false;
            if (checked === "true") {
                flag  = true;
            }
            set(key, flag);
            save();
        });
    };
};

export var addInputBox = function(key, label, placeholder, $parent, save, defaultValue) {
    let text = get(key);

    if (text === null && defaultValue !== void 0) {
        text = set(key, defaultValue);
    }

    let box = $('<input type="text" id="'+key+'" placeholder="'+placeholder+'" style="width:80%;">').val(text);
    $parent.append($('<li></li>')
                   .append(label+'<br>')
                   .append(box));

    let oldOpenSettingDialog = ST.view.openSettingDialog;
    ST.view.openSettingDialog = function(){
        oldOpenSettingDialog.apply(this, arguments);
        box.val(get(key));
        $('div[aria-label="保存する"]').one('click', function() {
            set(key, box.val());
            save();
        });
    };
};
