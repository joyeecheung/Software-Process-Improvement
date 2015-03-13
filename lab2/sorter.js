;(function(d) {
"use strict";

/**
 * Cross-browser utilities
 */
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
        return event.target || event.srcElement;
    }

    function hasClass(element, className) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        return !!element.className.match(reg);
    }

    function addClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            if (!hasClass(element, className))
                element.className += " " + className;
        }
    }

    function removeClass(element, className) {
        if (hasClass(element, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
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

    return {
        addEvent: addEvent,
        getTarget: getTarget,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        nthOfType: nthOfType,
        getText: getText
    };
})();


/**
 * Make a table sortable
 * @param  {HTMLTableElement} table
 *         The table element to be made sortable
 */
function makeTableSortable(table) {
    var ASCEND = 0, DESCEND = 1;  // directional constants

    /**
     * Make a column sortable
     * @param  {Event} e  The Event object.
     */
    function makeColumnSortable(e) {
        var head = e.currentTarget;
        var headRow = head.parentNode.getElementsByTagName('th');

        for (var i = 0, len = headRow.length; i < len; ++i) {
            // Clear style of other heads
            if (headRow[i] !== head) {
                util.removeClass(headRow[i], 'ascend');
                util.removeClass(headRow[i], 'descend');
            }
        }

        // Add style to the clicked head, and sort the column
        if (util.hasClass(head, 'ascend')) {  // currently ascend
            util.removeClass(head, 'ascend');
            util.addClass(head, 'descend');
            sortColumn(table, head, DESCEND);
        } else if (util.hasClass(head, 'descend')) {  // currently descend
            util.removeClass(head, 'descend');
            util.addClass(head, 'ascend');
            sortColumn(table, head, ASCEND);
        } else {  // neither ascend nor descend
            util.addClass(head, 'ascend');
            sortColumn(table, head, ASCEND);
        }
    }

    /**
     * Sort a table by the given column head with the given direction
     * @param  {HTMLTableElement}     table
     * @param  {HTMLTableCellElement} head
     * @param  {Number}               direction
     */
    function sortColumn(table, head, direction) {
        var headRow = head.parentNode;
        var i, len;
        // get the index of head
        var index = util.nthOfType(head, 'th');

        // push data rows into an array
        var rows = table.getElementsByTagName('tr');
        var rowArray = [], tableBody;
        for (i = 0, len = rows.length; i < len; ++i) {
            var row = rows[i];
            if (row !== headRow) {
                if (!tableBody) tableBody = row.parentNode;
                rowArray.push(row);
            }
        }

        // sort the data rows by selected column
        rowArray.sort(function _cmp_by_td(a, b) {
            var innerA = util.getText(a.getElementsByTagName('td')[index]),
                innerB = util.getText(b.getElementsByTagName('td')[index]);
            innerA = innerA.toLowerCase();
            innerB = innerB.toLowerCase();
            if (innerA < innerB) return -1;
            else if (innerA > innerB) return 1;
            else return 0;
        });

        if (direction !== ASCEND)
            rowArray.reverse();

        // put back to DOM
        for (i = 0, len = rowArray.length; i < len; ++i) {
            tableBody.appendChild(rowArray[i]);
        }
    }

    /**
     * Attach event listeners for the table
     */
    function init(table) {
        var heads = table.getElementsByTagName('th');
        for (var i = 0, len = heads.length; i < len; ++i) {
            util.addEvent(heads[i], 'click', makeColumnSortable);
        }
    }

    init(table);
}

/**
 * Get all tables in the page.
 */
function getAllTables() {
    return d.getElementsByTagName('table');
}

/**
 * Make given tables sortable.
 */
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
