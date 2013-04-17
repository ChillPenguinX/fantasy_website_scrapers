//copy/paste this block into the Chrome console on the draft recap page and then run sort()

var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
var sort = function() {
  var i, row;
  var rows = $('tr.tableBody');
  var body = $('body');
  var table = $('<table>');
  for (i=1; i <= rows.size(); i++) {
    rows.each(function() {
      row = $(this);
      if (parseInt(row.find('td:first').text()) == i) {
        table.append(row.append($('<td>').text(row.parent().find('.tableHead a').attr('title'))));
        return false;
      }
    });
  }
  body.html(table);
};
