;var util = (function _util(d) {
"use strict";

function addEvent(element, event, handler) {
    if (element.addEventListener) {
        element.addEventListener(event, handler, false);
    } else {
        element['e' + event + handler] = handler;
        element[event + handler] = function(e) {
            e.currentTarget = element;
            element['e' + event + handler](e || window.event);
        }
        element.attachEvent('on' + event,   // for IE8-
                             element[event + handler]);
    }
}

function removeEvent(element, event, handler) {
    if (element.removeEventListener)
        element.removeEventListener(event, handler);
    else {
        element.detachEvent('on' + event, element[event + handler]);
        element[event + handler] = null;
    }
}

function getTarget(event) {
    return event.target || event.srcElement;
}

function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    } else {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        return !!element.className.match(reg);
    }
}

function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else if (!hasClass(element, className)) {
        element.className += " " + className;
    }
}

function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    } else if (hasClass(element, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
        element.className = element.className.replace(reg, ' ');
    }
}

function nthOfType(element, type) {
    var children = element.parentNode.getElementsByTagName(type);
    for (var i = 0, len = children.length; i < len; ++i) {
        if (children[i] === element) return i;
    }
    return null;
}

function getText(node) {
    return node.textContent || node.innerText;
}

function getParentUntil(node, tag) {
    var parent = node.parentNode;
    while (parent.nodeName.toLowerCase() !== tag && parent !== null) {
        parent = parent.parentNode;
    }
    return parent;
}

function getDataRows(table) {
    var rowArray = [];
    var rows = table.getElementsByTagName('tr');
    var headRow = table.getElementsByTagName('th')[0].parentNode;
    for (var i = 0, len = rows.length; i < len; ++i) {
        var row = rows[i];
        if (row !== headRow) {
            rowArray.push(row);
        }
    }
    return rowArray;
}

function createElement(tag, text, className) {
    var element = d.createElement(tag);
    if (text) {
        var textNode = d.createTextNode(text);
        element.appendChild(textNode);
    }

    if (className) {
        addClass(element, className);
    }

    return element;
}

function removeElement(element) {
    return element.parentNode.removeChild(element);
}

function toArray(iterable) {
    var arr = [];
    for (var i = 0, len = iterable.length; i < len; ++i) {
        arr.push(iterable[i]);
    }
    return arr;
}

function traverseTextNode(node, callback) {
    var next = node;
    var ELEMENT_NODE = 1, TEXT_NODE = 3;
 
    if (node && node.nodeType === ELEMENT_NODE) {
        do {
            traverseTextNode(next.firstChild, callback);
            next = next.nextSibling;
        } while(next);
    } else if (node && node.nodeType === TEXT_NODE) {
        if (!/^\s+$/.test(node.nodeValue))
            callback(node);
        if (node.nextSibling)
            traverseTextNode(node.nextSibling, callback);
    }
}

function shuffle(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

return {
    addEvent: addEvent,
    removeEvent: removeEvent,
    getTarget: getTarget,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    nthOfType: nthOfType,
    getText: getText,
    getParentUntil: getParentUntil,
    getDataRows: getDataRows,
    createElement: createElement,
    removeElement: removeElement,
    toArray: toArray,
    traverseTextNode: traverseTextNode,
    shuffle: shuffle
};
})(document);
