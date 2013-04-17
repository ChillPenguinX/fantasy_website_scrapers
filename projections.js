var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
function hitting(players) 
{
  var numPlayers = players.length;
  var price = 0, r = 0, hr = 0, rbi = 0, sb = 0, obps = [], slgs = [], abs = [], ab = 0, i, tds, idx, p;
  for (i=0; i < numPlayers; i++)
  {
    $('tr').each(function()
    {
      tds = $(this).find('td');
      idx = $.inArray($(tds[0]).text(), players);
      if (idx != -1) 
      {
        p = Math.max(parseInt($(tds[3]).text()), 1);
        console.log('found ' + $(tds[0]).text() + ' - $' + p);
        price += p;
        abs.push(parseInt($(tds[4]).text()));
        ab += parseInt($(tds[4]).text());
        hr += parseInt($(tds[5]).text());
        rbi += parseInt($(tds[6]).text());
        sb += parseInt($(tds[7]).text());
        r += parseInt($(tds[8]).text());
        obps.push(parseFloat($(tds[10]).text()));
        slgs.push(parseFloat($(tds[9]).text()));
        players[idx] = 'xxxxxxxx';
        return false;
      }
    });
  }
  var slg = 0, obp = 0;
  for (i=0; i<abs.length; i++) 
  {
    slg += slgs[i] * abs[i];
    obp += obps[i] * abs[i];
  }
  slg = slg / ab;
  obp = obp / ab;
  console.log("$" + price + "\nR: " + r + " (878)\nHR: " + hr + " (254)\nRBI: " + rbi + " (916)\nSB: " + sb + " (174)\nOBP: " + obp + 
    "\nSLG: " + slg, "\nOPS: " + (obp + slg) + " (.8325)");
}

hitting(['Carlos Santana', 'Edwin Encarnacion', 'Dustin Pedroia', 'Josh Rutledge', 'Miguel Cabrera', 'Mike Trout', 
  'Jay Bruce', 'Matt Kemp', 'Adrian Gonzalez', 'Chris Davis'])
