var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
function points(players) 
{
  var numPlayers = players.length;
  var price = 0, points = 0, i, tds, idx, p;
  for (i=0; i < numPlayers; i++)
  {
    $('tr').each(function()
    {
      tds = $(this).find('td');
      idx = $.inArray($(tds[0]).text(), players);
      if (idx != -1) 
      {
        p = Math.max(parseInt($(tds[3]).text().substring(1)), 1);
        console.log('found ' + $(tds[0]).text() + ' - $' + p);
        price += p;
        points += parseInt($(tds[13]).text());
        players[idx] = 'xxxxxxxx';
        return false;
      }
    });
  }
  console.log("$" + price + "\npoints: " + points);
}

points(['Andrew Luck', 'Eddie Lacy', 'Adrian Peterson', 'Calvin Johnson', 'A.J. Green', 'Greg Olsen', 
  'Adam Vinatieri'])
