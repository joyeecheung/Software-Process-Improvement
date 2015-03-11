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
        var headRow = head.parentNode.getElementsByTagName('th');
        for (var i = 0, len = headRow.length; i < len; ++i) {
            if (headRow[i] !== head) {
                util.removeClass(headRow[i], 'ascend');
                util.removeClass(headRow[i], 'descend');
            }
        }

        if (util.hasClass(head, 'ascend')) {
            util.removeClass(head, 'ascend');
            util.addClass(head, 'descend');
            sortColumn(head, DESCEND);
        } else if (util.hasClass(head, 'descend')) {
            util.removeClass(head, 'descend');
            util.addClass(head, 'ascend');
            sortColumn(head, ASCEND);
        } else {
            util.addClass(head, 'ascend');
            sortColumn(head, ASCEND);
        }
    }

    function sortColumn(head, direction) {
        // get the index of head
        var index = util.nthOfType(head, 'th');
        var headRow = head.parentNode;

        // extract the column data
        var rows = table.getElementsByTagName('tr');
        var rowArray = [], tableBody;
        for (var i = 0, len = rows.length; i < len; ++i) {
            var row = rows[i];
            if (row !== headRow) {
                if (!tableBody) tableBody = row.parentNode;
                rowArray.push(row);
            }
        }

        // sort data to get the new order
        rowArray.sort(function _cmp_by_td(a, b) {
            var innerA = a.getElementsByTagName('td')[index].innerHTML.toLowerCase();
            var innerB = b.getElementsByTagName('td')[index].innerHTML.toLowerCase();
            if (innerA < innerB) return -1;
            else if (innerA > innerB) return 1;
            else return 0;
        });

        if (direction !== ASCEND)
            rowArray.reverse();

        // rearange
        for (var i = 0, len = rowArray.length; i < len; ++i) {
            tableBody.appendChild(rowArray[i]);
        }
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
