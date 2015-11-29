(function(win, _u) {
    var __arr = [],
        idReg = /^\#/,
        classReg = /^\./,
        attrReg = /^\[.+\]$/,
        stateReg = /^\:/,
        qsa = function(selector, context) {
            return context.querySelectorAll(selector);
        },
        byId = (function() {
            if (win.document.querySelectorAll) {
                return qsa;
            } else {
                return function(selector, context, _data) {
                    return context.getElementById(selector.replace(idReg, ""));
                }
            }
        })(),
        byClass = (function() {
            if (win.document.querySelectorAll) {
                return qsa;
            } else if (win.document.getElementsByClassName) {
                return function(selector, context, _data) {
                    return context.getElementsByClassName(selector);
                }
            } else {
                return function(selector, context, _data) {
                    var _tags = context.getElementsByTagName("*"),
                        len = _tags.length,
                        index = 0,
                        _array = [],
                        _tag;
                    while (index < len) {
                        _tag = _tags[index++];
                        if (buildClassReg(selector).test(_tag.className)) {
                            _array.push(_tag);
                        }
                    }
                    return _array;
                }
            }
        })(),
        byAttr = (function() {
            if (win.document.querySelectorAll) {
                return qsa;
            } else {
                return function(selector, context, _data) {
                    var _tags = context.getElementsByTagName("*"),
                        len = _tags.length,
                        index = 0,
                        _array = [],
                        _tag,
                        attr = selector.replace(/^\[|\]$|\'|\"/g, "").split("\="),
                        attrName = attr[0],
                        attrValue = attr[1];
                    while (index < len) {
                        _tag = _tags[index++];
                        if (_tag.getAttribute(attrName) === attrValue ||
                            (attrValue === _u &&
                                _tag.getAttribute(attrName) !== _u)) {
                            _array.push(_tag);
                        }
                    }
                    return _array;
                }
            }
        })(),
        byState = (function() {
            if (win.document.querySelectorAll) {
                return qsa;
            } else {
                return function(selector, context, _data) {
                    return []; // 构思构思- -
                }
            }
        })(),
        byTagName = (function() {
            if (win.document.querySelectorAll) {
                return qsa;
            } else {
                return function(selector, context, _data) {
                    var _arr = [],
                        tags = context.getElementsByTagName(selector),
                        len = tags.length,
                        index = 0;
                    while (index < len) {
                        _arr.push(tags[index++]);
                    }
                    return _arr;
                }
            }
        })();

    function init(selector, context) {
        var selcObj = {},
            anotherMatch = /\#|\.|\[|\:/g; // 如果在选择符后还有其他的条件
        if (idReg.test(selector)) {
            selcObj.id = selector;
        } else if (classReg.test(selector)) {
            selcObj.className = selector;
        } else if (attrReg.test(selector)) {
            selcObj.attr = selector;
        } else if (stateReg.test(selector)) {
            selcObj.state = selector;
        } else {
            selcObj.tagName = selector;
        }
        return getTag(selcObj, context || document);
    }

    function getTag(selcObj, context, _data) {
        var gM = getMethods(context, _data),
            matchsEle;
        context = context || win.document;
        if (selcObj.id) {
            matchsEle = gM.getById(selcObj.id);
        } else if (selcObj.className) {
            matchsEle = gM.getByClass(selcObj.className);
        } else if (selcObj.attr) {
            matchsEle = gM.getByAttr(selcObj.attr);
        } else if (selcObj.state) {
            matchsEle = gM.getByState(selcObj.state);
        } else {
            matchsEle = gM.getByTagName(selcObj.tagName);
        }
        return __arr.slice.call(matchsEle)
    }

    function getMethods(context, data) {
        return {
            getById: function(selector) {
                return byId(selector, context, data);
            },
            getByClass: function(selector) {
                return byClass(selector, context, data);
            },
            getByAttr: function(selector) {
                return byAttr(selector, context, data);
            },
            getByState: function(selector) {
                return byState(selector, context, data);
            },
            getByTagName: function(selector) {
                return byTagName(selector, context, data);
            }
        }
    }

    function buildClassReg(cName) {
        return new RegExp("(^|\\s+)" + cName + "(\\s+|$)", "g");
    }

    win.jsm = init;
})(window, undefined)
