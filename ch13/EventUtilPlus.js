// 自己改良的版本，基于高性能JS的理念，判断条件只会在页面加载时执行一遍。

var EventUtil = (function(scope) {
    var _addEvent = (function(_d) {
        if (_d.addEventListener) {
            return function(dom, type, func) {
                dom.addEventListener(type, func);
            }
        } else if (_d.attachEvent) {
            return function(dom, type, func) {
                dom.attachEvent("on" + type, func);
            }
        } else {
            return function(dom, type, func) {
                dom["on" + type] = func;
            }
        }
    })(document);
    var _removeEvent = (function(_d) {
        if (_d.removeEventListener) {
            return function(dom, type, func) {
                dom.removeEventListener(type, func);
            }
        } else if (_d.detachEvent) {
            return function(dom, type, func) {
                dom.detachEvent("on" + type, func);
            }
        } else {
            return function(dom, type) {
                dom["on" + type] = null;
            }
        }
    })(document);
    return {
        addHandler: _addEvent,
        removeHandler: _removeEvent
    }
})(window);
