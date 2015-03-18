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
    makeAllTablesSortable(tables);
    makeAllTablesFilterable(tables);
});

}(document));
