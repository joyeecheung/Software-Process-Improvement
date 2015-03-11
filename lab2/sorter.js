;
(function(d, undefined) {
"use strict";

var util = (function _util() {
    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler);
        } else {
            element.attachEvent('on' + event,   // for IE8-
                function _handler_wrapper(e) {
                    e.currentTarget = element;
                    handler(e);
                }
            );
        }
    }

    function getTarget(event) {
        return event.target ? event.target : event.srcElement;
    }

    function hasClass(el, className) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        return !!el.className.match(reg);
    }

    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            if (!hasClass(el, className))
                el.className += " " + className;
        }
    }

    function removeClass(el, className) {
        if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }

    function nthOfType(el, type) {
        var children = el.parentNode.getElementsByTagName(type);
        for (var i = 0, len = children.length; i < len; ++i) {
            if (children[i] === el) return i;
        }
        return null;
    }

    return {
        addEvent: addEvent,
        getTarget: getTarget,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        nthOfType: nthOfType
    };
})();


/**
 * Make a table sortable
 * @param  {HTMLTableElement} table
 *         The table element to be made sortable
 */
function makeTableSortable(table) {
    var ASCEND = 0, DESCEND = 1;

    function makeColumnSortable(e) {
        var head = e.currentTarget;
        if (util.hasClass(head, 'ascend')) {
            util.removeClass(head, 'ascend');
            util.addClass(head, 'descend');
            head.getElementsByTagName('img')[0].src = "descend.png";
        } else if (util.hasClass(head, 'descend')) {
            util.removeClass(head, 'descend');
            util.addClass(head, 'ascend');
            head.getElementsByTagName('img')[0].src = "ascend.png";
        } else {
            util.addClass(head, 'ascend');
            var icon = d.createElement('img');
            icon.src = "ascend.png";
            head.appendChild(icon);
        }
    }

    function sortColumn(table, head, direction) {
        // get the index of head
        var index = util.nthOfType(head, type);
        // extract the column data
        // sort data to get the new order
        // rearange offline
        // put back
    }

    var heads = table.getElementsByTagName('th');
    for (var i = 0, len = heads.length; i < len; ++i) {
        util.addEvent(heads[i], 'click', makeColumnSortable);
    }
}

function getAllTables() {
    return d.getElementsByTagName('table');
}

function makeAllTablesSortable(tables) {
    for (var i = 0, len = tables.length; i < len; ++i) {
        makeTableSortable(tables[i]);
    }
}


window.onload = function() {
    var tables = getAllTables();
    makeAllTablesSortable(tables);
};

}(document));
