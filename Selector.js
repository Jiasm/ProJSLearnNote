/*
    暂停施工
*/

(function(win, _u) {
    var __arr = [],
        idReg = /^\#/,
        classReg = /^\./,
        attrReg = /^\[.+\]$/,
        stateReg = /^\:/,
        higher = !!win.document.querySelectorAll && !/MSIE 8\.0/.test(navigator.appVersion),
        qsa = function(selector, context) {
            return context.querySelectorAll(selector);
        },
        makeArray = (function () {
            var fastFn = function (likeArr) {
                return __arr.slice.call(likeArr)
            }, lowFn = function (likeArr) {
                try {
                    return fastFn(likeArr);
                } catch (wtf) {
                    var len = likeArr.length,
                        returnArr = [],
                        index = 0;
                    while (index < len) {
                        returnArr.push(likeArr[index++]);
                    }
                    return returnArr;
                }
            }
            return higher ? fastFn : lowFn;
        })(),
        buildAttr = (function () {
            return higher ? function (v) {
                return v;
            } : function (v) {
                var _com = {"class" : "className"};
                return (/^\w+$/.test(v) ? v + "-.-" : v).replace(/\W|^(\w+)\W|$/g, function (_, $1) {
                    return _.replace($1,_com[$1] || $1);
                })
            }
        })(),
        getValue = (function () {
            return higher ? function (tag, parm) {
                return tag.getAttribute(parm);
            } : function (tag, parm) {
                var returnValue = tag.getAttribute(parm);
                returnValue = (returnValue == _u ? "" : returnValue);
                return (parm === "value") || (returnValue && returnValue.length > 0) ? returnValue : (tag[parm] || returnValue);
            }
        })(),
        byId = (function() {
            if (higher) {
                return qsa;
            } else {
                return function(selector, context, _data) {
                    return [context.getElementById(selector.replace(idReg, ""))];
                }
            }
        })(),
        byClass = (function() {
            if (higher) {
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
                    selector = selector.replace(/^\./g,"");
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
            if (higher) {
                return qsa;
            } else {
                function getCheck (str) {
                    var matchs = "\\|\~|\`|\!|\@|\#|\$|\%|\&|\*|\(|\)|\[|\]|\{|\}".split("|"),
                        speReg = /\~|\*|\^|\$/g.exec(str),
                        swit = speReg ? speReg[0] : "",
                        len = matchs.length,
                        regStr = "",
                        reg;
                        while (--len) {
                            regStr += "\(\\" +  matchs[len] + "\)\|";
                        }
                        regStr += "\(\\\|\)";
                        reg = new RegExp(regStr, "g");
                    var reg = /(\\)|(\~)|(\`)|\!|\@|\#|\$|\%|\&|\*|\(|\)|\[|\]|\{|\}|\|/g;
                    switch (swit) {
                        case "\^" : 
                        case "\$" : 
                            return function (tag, parm, val, _p) {
                                var markStart = {"\^" : "\^"},
                                    markEnd = {"\$" : "\$"};
                                parm = parm.replace(speReg, "");
                                if (!(_p = getValue(tag, parm))) return false;
                                return new RegExp((markStart[swit] || "") + val.replace(/\'|\"/g, "").replace(reg, function ($1) {return "\\\\" + $1}) + (markEnd[swit] || ""), "g").test(_p);
                            }; break;
                        case "\*" : 
                        case "\~" : 
                            return function (tag, parm, val, _p) {
                                parm = parm.replace(speReg, "");
                                if (!(_p = getValue(tag, parm))) return false;
                                return new RegExp(val.replace(/\'|\"/g, "").replace(reg, function ($1) {return "\\\\" + $1}), "g").test(_p);
                            }; break;
                        default : 
                            return function (tag, parm, val, _p) {
                                parm = parm.replace(speReg, "").replace(/\-\.\-$/, "");
                                _p = getValue(tag, parm);
                                return _p === val || (val === _u && _p !== _u);
                            }; break;
                    }
                }
                return function(selector, context, _data) {
                    var _tags = context.getElementsByTagName("*"),
                        len = _tags.length,
                        index = 0,
                        _array = [],
                        _tag,
                        attr = selector.replace(/^\[|\]$|\'|\"/g, "").split("\="),
                        attrName = buildAttr(attr[0]),
                        attrValue = attr[1],
                        checker = getCheck(selector);
                    while (index < len) {
                        _tag = _tags[index++];
                        if (checker(_tag, attrName, attrValue)) {
                            _array.push(_tag);
                        }
                    }
                    return _array;
                }
            }
        })(),
        byState = (function() {
            if (higher) {
                return qsa;
            } else {
                return function(selector, context, _data) {
                    var _arr = [],
                        tags = context.getElementsByTagName("*"),
                        len = tags.length,
                        index = 0;
                    selector = selector.replace(/^\:/g, "");
                    while (index < len) {
                        if (tags[index++][selector]) {
                            _arr.push(tags[index - 1]);
                        }
                    }
                    return _arr;
                }
            }
        })(),
        byTagName = (function() {
            if (higher) {
                return qsa;
            } else {
                return function(selector, context, _data) {
                    return context.getElementsByTagName(selector);
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
        var matchsEle;
        context = context || win.document;
        if (selcObj.id) {
            matchsEle = byId(selcObj.id, context, _data);
        } else if (selcObj.className) {
            matchsEle = byClass(selcObj.className, context, _data);
        } else if (selcObj.attr) {
            matchsEle = byAttr(selcObj.attr, context, _data);
        } else if (selcObj.state) {
            matchsEle = byState(selcObj.state, context, _data);
        } else {
            matchsEle = byTagName(selcObj.tagName, context, _data);
        }
        return makeArray(matchsEle);
    }

    function buildClassReg(cName) {
        return new RegExp("(^|\\s+)" + cName + "(\\s+|$)", "g");
    }
    win.jsm = init;
})(window, undefined)
