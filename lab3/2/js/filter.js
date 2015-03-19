;var makeAllTablesFilterable = (function(d) {
"use strict";

var tableCount = 0;

/**
 * Make a table sortable
 * @param  {HTMLTableElement} table
 *         The table element to be made sortable
 */
function makeTableFilterable(table) {
    var dataRows = util.getDataRows(table);
    var tableBody = dataRows[0].parentNode;

    function highlightText(keyword, textNode) {
        var re = new RegExp('(' + keyword + ')', 'ig');
        var wrap = '<mark class="table-filter-key">$1</mark>';
        textNode.parentNode.innerHTML = textNode.parentNode.innerHTML.replace(re, wrap);
    }

    /**
     * Filter by input
     */
    function filterRows(e) {
        // get input
        var keyword = util.getTarget(e).value.toLowerCase();
        var matchingRows = [], i, len;
        if (keyword !== "") {
            // rows are in closure
            for (i = 0, len = dataRows.length; i < len; ++i) {
                // search each column for the keyword
                var columns = dataRows[i].getElementsByTagName('td');
                for (var j = 0, columnLen = columns.length; j < columnLen; ++j) {
                    var text = util.getText(columns[j]).toLowerCase();
                    // clone the row if matched, highlight the keyword
                    if (text.indexOf(keyword) !== -1) {
                        var clone = dataRows[i].cloneNode(true);
                        util.traverseTextNode(clone, highlightText.bind(null, keyword));
                        matchingRows.push(clone);
                        break;
                    }
                }
            }
        } else {
            matchingRows = util.toArray(dataRows);
        }

        // table is in closure
        // remove all data rows from DOM
        var rows = util.toArray(tableBody.getElementsByTagName('tr'));
        for (i = 0, len = rows.length; i < len; ++i) {
            // if it is not the head row
            if (rows[i].getElementsByTagName('th').length === 0) {
                tableBody.removeChild(rows[i]);
            }
        }

        // put decorated rows into DOM
        for (i = 0, len = matchingRows.length; i < len; ++i) {
            tableBody.appendChild(matchingRows[i]);
        }
    }

    /**
     * Attach event listeners for the table
     */
    function init(table) {
        // create input and put to DOM
        var input = util.createElement('input', null, 'table-filter-input');
        input.id = "table-filter-" + tableCount;
        var label = util.createElement('label', 'Search row by: ', 'table-filter-label');
        label.htmlFor = input.id;
        var div = util.createElement('div', null, 'table-filter');
        div.appendChild(label);
        div.appendChild(input);

        table.parentNode.insertBefore(div, table);

        // listen for the inputs
        util.addEvent(input, 'input', filterRows);
    }

    init(table);
}

/**
 * Make given tables sortable.
 */
return function(tables) {
    for (var i = 0, len = tables.length; i < len; ++i) {
        makeTableFilterable(tables[i]);
    }
};

}(document));
