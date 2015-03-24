;var makeSortable = (function(d) {
  "use strict";

  /**
   * Make a table sortable
   * @param  {HTMLTableElement} table
   *         The table element to be made sortable
   */
  function _makeSortable(table) {
    var ASCEND = 0,
      DESCEND = 1; // directional constants

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
      if (util.hasClass(head, 'ascend')) { // currently ascend
        util.removeClass(head, 'ascend');
        util.addClass(head, 'descend');
        sortByColumn(table, head, DESCEND);
      } else if (util.hasClass(head, 'descend')) { // currently descend
        util.removeClass(head, 'descend');
        util.addClass(head, 'ascend');
        sortByColumn(table, head, ASCEND);
      } else { // neither ascend nor descend
        util.addClass(head, 'ascend');
        sortByColumn(table, head, ASCEND);
      }
    }

    /**
     * Sort a table by the given column head with the given direction
     * @param  {HTMLTableElement}     table
     * @param  {HTMLTableCellElement} head
     * @param  {Number}               direction
     */
    function sortByColumn(table, head, direction) {
      // assert: headRow.nodeName === 'TR'
      var headRow = head.parentNode;
      var i, len;
      // get the index of head
      var index = util.nthOfType(head, 'th');

      // push data rows into an array
      var rowArray = util.getDataRows(table);
      var tableBody = rowArray[0].parentNode;

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


  return function(table) {
    _makeSortable(table);
    return table;
  };

}(document));
