var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
function bd() {


  //put your team names here. this assumes 12 team, but you can adjust add more or remove some if needed
  //the periods are for display purposes. You can remove them, make them different lengths, and replace them.
  //each time you run this, a new version of this object will be printed last. The idea is for you to copy that
  //and paste it here to keep a running total for breakdowns. The team names *will* need to match text on the site.
var hist = {
		"Prospect Hoarders": {Wi: 95, L: 39, T: 13, WH: 69, LH: 58, TH: 20, WP: 105, LP: 28, TP: 14, p: "................ "},
		"I Punt Cats": {Wi: 81, L: 52, T: 14, WH: 80, LH: 49, TH: 18, WP: 63, LP: 69, TP: 15, p: ".......................... "},
		"Tropical Storm Braz": {Wi: 74, L: 59, T: 14, WH: 64, LH: 66, TH: 17, WP: 75, LP: 55, TP: 17, p: "............. "},
		"Irish Guinness07": {Wi: 76, L: 61, T: 10, WH: 61, LH: 64, TH: 22, WP: 97, LP: 39, TP: 11, p: "................. "},
		"Colt .45s": {Wi: 59, L: 77, T: 11, WH: 60, LH: 66, TH: 21, WP: 56, LP: 72, TP: 19, p: "............................. "},
		"Don't Mess with Texas": {Wi: 53, L: 78, T: 16, WH: 58, LH: 74, TH: 15, WP: 49, LP: 81, TP: 17, p: ".......... "},
		"The Mike Shitty All-Stars": {Wi: 47, L: 82, T: 18, WH: 44, LH: 76, TH: 27, WP: 54, LP: 76, TP: 17, p: "...... "},
		"Irish Dawgs": {Wi: 48, L: 85, T: 14, WH: 75, LH: 58, TH: 14, WP: 28, LP: 107, TP: 12, p: "........................ "}
	};

  //list your categories here in the order they appear on the scoreboard. They do not need to match the text on the site.
  var cats = ['R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
              'QS', 'W', 'SV', 'ERA', 'WHIP', 'K/9'];
  //list any categories where it's better to have a lower number here, in any order. They need to match the text in cats.
  var neg_cats = ['ERA', 'WHIP'];
  // list of categories where the team must qualify (currently assumes that if you fail one, you fail them all)
  var qual_cats = ['ERA', 'WHIP', 'K/9'];
  //how many hitting categories do you have?
  var num_hitting_cats = 6;
  //for display purposes when showing highs
  var periods = ['....... ','..... ','.... ', '..... ','.... ','.... ' ,'...... ', '....... ', '...... ', '.... ','.. ','..... '];



  var stats = {};
  var teams = [];
  var highs = {};
  var disqualified = {};
  var row, statObj, teamName, histObj;
  $('.linescoreTeamRow').each(function() {
    row = $(this);
    teamName = row.find('.teamName a').text();
    teams.push(teamName);
    statObj = stats[teamName] = {};
    statObj['Wi']=statObj['L']=statObj['T']=statObj['WH']=statObj['LH']=statObj['TH']=statObj['WP']=statObj['LP']=statObj['TP']=0;
    row.find('.precise').each(function(index) {
      statObj[cats[index]] = parseFloat($(this).text());
    });
    row.find('.belowMinimum').each(function(){disqualified[teamName] = true;});
  });
  var teamAWinsH, teamBWinsH, teamAWinsP, teamBWinsP, i, j, k, teamAVal, teamBVal, week;

  for (i=0; i<teams.length; i++) {
    for (j=i+1; j<teams.length; j++) {
      teamA = stats[teams[i]];
      teamB = stats[teams[j]];
      teamAWinsH = teamBWinsH = teamAWinsP = teamBWinsP = 0;
      for (k=0; k<cats.length; k++) {
        // first, check disqualifiers
        if ($.inArray(cats[k], qual_cats) != -1) {
          if (disqualified[teams[i]]) {
            if (!disqualified[teams[j]]) {
              if (k < num_hitting_cats) {
                teamBWinsH++;
              } else {
                teamBWinsP++;
              }
            }
            continue;
          } else if (disqualified[teams[j]]) {
            if (k < num_hitting_cats) {
              teamAWinsH++;
            } else {
              teamAWinsP++;
            }
            continue;
          }
        } // end check disqualifiers
        teamAVal = teamA[cats[k]];
        teamBVal = teamB[cats[k]];
        if (teamAVal > teamBVal) {
          if (k < num_hitting_cats) {
            if ($.inArray(cats[k], neg_cats) != -1) {
              teamBWinsH++
            } else {
              teamAWinsH++;
            }
          } else {
            if ($.inArray(cats[k], neg_cats) != -1) {
              teamBWinsP++;
            } else {
              teamAWinsP++;
            }
          }
        } else if (teamAVal < teamBVal) {
          if (k < num_hitting_cats) {
            if ($.inArray(cats[k], neg_cats) != -1) {
              teamAWinsH++
            } else {
              teamBWinsH++;
            }
          } else {
            if ($.inArray(cats[k], neg_cats) != -1) {
              teamAWinsP++;
            } else {
              teamBWinsP++;
            }
          }
        }
      }
      if ((teamAWinsH + teamAWinsP) > (teamBWinsH + teamBWinsP)) {
        teamA['Wi']++;
        teamB['L']++;
      } else if ((teamAWinsH + teamAWinsP) < (teamBWinsH + teamBWinsP)) {
        teamA['L']++;
        teamB['Wi']++;
      } else {
        teamA['T']++;
        teamB['T']++;
      }
      if (teamAWinsH > teamBWinsH) {
        teamA['WH']++;
        teamB['LH']++;
      } else if (teamAWinsH < teamBWinsH) {
        teamA['LH']++;
        teamB['WH']++;
      } else {
        teamA['TH']++;
        teamB['TH']++;
      }
      if (teamAWinsP > teamBWinsP) {
        teamA['WP']++;
        teamB['LP']++;
      } else if (teamAWinsP < teamBWinsP) {
        teamA['LP']++;
        teamB['WP']++;
      } else {
        teamA['TP']++;
        teamB['TP']++;
      }
    }
  }
  teams.sort(function(a,b){
    teamA = stats[a];
    teamB = stats[b];
    return ((teamB['Wi'] + teamB['T']/2)/11) - ((teamA['Wi'] + teamA['T']/2)/11);
  });

  for (i=0; i<teams.length; i++) {
    statObj = stats[teams[i]];
    histObj = hist[teams[i]]
    histObj['Wi']  += statObj['Wi'];
    histObj['L']  += statObj['L'];
    histObj['T']  += statObj['T'];
    histObj['WH'] += statObj['WH'];
    histObj['LH'] += statObj['LH'];
    histObj['TH'] += statObj['TH'];
    histObj['WP'] += statObj['WP'];
    histObj['LP'] += statObj['LP'];
    histObj['TP'] += statObj['TP'];
    if (!i) {
      week = (histObj['Wi'] + histObj['L'] + histObj['T']) / (teams.length - 1);
      console.log('[b][u]Week ' + week + ' Breakdowns (Combined, Hitting, Pitching)[/u][/b]')
    }
    console.log(teams[i] + histObj['p'] + '[b]' + statObj['Wi'] + '-' + statObj['L'] + '-' + statObj['T'] + '[/b]' +
                           ', ' + statObj['WH'] + '-' + statObj['LH'] + '-' + statObj['TH'] +
                           ', ' + statObj['WP'] + '-' + statObj['LP'] + '-' + statObj['TP']);
  }
  var totalGames = histObj['Wi'] + histObj['L'] + histObj['T'];
  teams.sort(function(a,b){
    teamA = hist[a];
    teamB = hist[b];
    return ((teamB['Wi'] + teamB['T']/2)/totalGames) - ((teamA['Wi'] + teamA['T']/2)/totalGames);
  });
  console.log('\n[b][u]Season Breakdowns (Combined, Hitting, Pitching)[/u][/b]');
  var percentage;
  for (i=0; i<teams.length; i++) {
    histObj = hist[teams[i]];
    percentage = ((histObj['Wi'] + histObj['T']/2)/totalGames).toFixed(3);
    console.log(teams[i] + histObj['p'] + '(' + percentage + ') [b]' + histObj['Wi'] + '-' + histObj['L'] + '-' + histObj['T'] + '[/b]' +
                           ', ' + histObj['WH'] + '-' + histObj['LH'] + '-' + histObj['TH'] +
                           ', ' + histObj['WP'] + '-' + histObj['LP'] + '-' + histObj['TP']);
  }

  for (k=0; k<cats.length; k++) {
    highs[cats[k]] = {teams: [teams[0]], val: stats[teams[0]][cats[k]]};
  }
  for (i=1; i<teams.length; i++) {
    for (k=0; k<cats.length; k++) {
      teamBVal = stats[teams[i]][cats[k]];
      if ($.inArray(cats[k], qual_cats) != -1 && disqualified[teams[i]])
      	continue;
      if ((highs[cats[k]]['val'] < teamBVal && $.inArray(cats[k], neg_cats) == -1) ||
          (highs[cats[k]]['val'] > teamBVal && $.inArray(cats[k], neg_cats) != -1)) {
        highs[cats[k]]['teams'] = [teams[i]];
        highs[cats[k]]['val'] = teamBVal;
      } else if (highs[cats[k]]['val'] == teamBVal) {
        highs[cats[k]]['teams'].push(teams[i]);
      }
    }
  }

  console.log('\n[b][u]Week ' + week + ' Highs:[/u][/b]');
  for (i=0; i<cats.length; i++) {
    if (i == 6) {console.log(' ');}
    console.log(cats[i] + periods[i] + highs[cats[i]]['val'] + ' - ' + highs[cats[i]]['teams'].join('; '));
  }

  console.log('\n\nvar hist = {')
  for (i=0; i<teams.length; i++) {
    histObj = hist[teams[i]];
    console.log('\t\t"' + teams[i] + '": {Wi: ' + histObj['Wi'] + ', L: ' + histObj['L'] + ', T: ' +
      histObj['T'] + ', WH: ' + histObj['WH'] + ', LH: ' + histObj['LH'] + ', TH: ' +
      histObj['TH'] + ', WP: ' + histObj['WP'] + ', LP: ' + histObj['LP'] + ', TP: ' +
      histObj['TP'] + ', p: "' + histObj['p'] + '"}' + (i == teams.length-1 ? '' : ','));
  }
  console.log('\t};');
}


//type bd()
