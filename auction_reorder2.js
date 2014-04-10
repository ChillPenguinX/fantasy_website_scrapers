//copy/paste this block into the Chrome console on the draft recap page and then run sort()

var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
var sort = function() {
  var i, row, bestRow, highest, current, highIdx;
  var rows = $('tr.tableBody');
  var body = $('body');
  var table = $('<table>');
  var numRows = rows.size();
  for (i=0; i < numRows; i++) {
    rows.each(function(index) {
      row = $(this);
      current = parseInt(row.find('td:last').text().substring(1));
      if (!bestRow || current > highest) {
        bestRow = row;
        highest = current;
        highIdx = index;
      }
    });
    table.append(bestRow.append($('<td>').text(bestRow.parent().find('.tableHead a').attr('title'))));
    rows.splice(highIdx, 1);
    bestRow = null;
    highest = 0;
  }
  body.html(table);
};
