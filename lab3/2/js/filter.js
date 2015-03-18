;var makeAllTablesFilterable = (function(d) {
"use strict";

/**
 * Make a table sortable
 * @param  {HTMLTableElement} table
 *         The table element to be made sortable
 */
function makeTableFilterable(table) {

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
