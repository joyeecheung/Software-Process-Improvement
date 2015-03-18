;(function(d) {
"use strict";

/**
 * Get all tables in the page.
 */
function getAllTables() {
    return d.getElementsByTagName('table');
}

util.addEvent(window, 'load', function() {
    var tables = getAllTables();
    for (var i = 0, len = tables.length; i < len; ++i) {
        makeSortable(makeFilterable(tables[i]));
    }
});

}(document));
