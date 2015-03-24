;var makeFilterable = (function(d) {
  "use strict";

  var tableCount = 0;

  /**
   * Make a table sortable
   * @param  {HTMLTableElement} table
   *         The table element to be made sortable
   */
  function _makeFilterable(table) {
    var dataRows = util.getDataRows(table);
    var tableBody = dataRows[0].parentNode;

    function highlightText(keyword, textNode) {
      var re = new RegExp('(' + keyword + ')', 'ig'); // case-insensitive
      var wrap = '<mark class="table-filter-key">$1</mark>';
      var outerNode = textNode.parentNode;
      outerNode.innerHTML = outerNode.innerHTML.replace(re, wrap);
    }

    function getHighlightedRows(keyword) {
      var matchingRows = [];
      // rows are in closure
      for (var i = 0, len = dataRows.length; i < len; ++i) {
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
      return matchingRows;
    }


    /**
     * Filter rows by input, case-insensitive
     */
    function filterRows(e) {
      // get input
      var keyword = util.getTarget(e).value.toLowerCase();
      var matchingRows, i, len;
      if (keyword !== "") {
        matchingRows = getHighlightedRows(keyword);
      } else { // no filtering
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
     * Attach event listeners and search field for the table
     */
    function init(table) {
      // create input and put to DOM
      var input = util.createElement('input', null, 'table-filter-input');
      input.id = "table-filter-" + tableCount++;
      var label = util.createElement('label', 'Search row by: ',
        'table-filter-label');
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

  return function(table) {
    _makeFilterable(table);
    return table;
  };

}(document));
