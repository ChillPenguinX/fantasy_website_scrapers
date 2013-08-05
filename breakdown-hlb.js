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
    "Colt .45s": {Wi: 153, L: 21, T: 13, WH: 160, LH: 20, TH: 7, WP: 86, LP: 67, TP: 34, p: "...................... ", fam: "Brasuell"},
    "Assault Rifle Hunters": {Wi: 119, L: 54, T: 14, WH: 121, LH: 51, TH: 15, WP: 68, LP: 79, TP: 40, p: "..... ", fam: "Loechel"},
    "Irish Dawgs": {Wi: 96, L: 68, T: 23, WH: 94, LH: 71, TH: 22, WP: 94, LP: 74, TP: 19, p: ".................. ", fam: "Fleming"},
    "Irish Guinness07": {Wi: 90, L: 80, T: 17, WH: 80, LH: 89, TH: 18, WP: 84, LP: 75, TP: 28, p: "........... ", fam: "Fleming"},
    "Chicago Dawgs": {Wi: 86, L: 88, T: 13, WH: 65, LH: 101, TH: 21, WP: 117, LP: 43, TP: 27, p: "............. ", fam: "Loechel"},
    "The Emperor's Club": {Wi: 82, L: 84, T: 21, WH: 84, LH: 85, TH: 18, WP: 80, LP: 79, TP: 28, p: "....... ", fam: "Holmdopia"},
    "I Punt Cats": {Wi: 75, L: 95, T: 17, WH: 89, LH: 84, TH: 14, WP: 70, LP: 78, TP: 39, p: "................... ", fam: "Loechel"},
    "Don't Mess with Texas": {Wi: 70, L: 93, T: 24, WH: 63, LH: 95, TH: 29, WP: 69, LP: 89, TP: 29, p: "... ", fam: "Fleming"},
    "The Brewsers": {Wi: 71, L: 94, T: 22, WH: 66, LH: 102, TH: 19, WP: 77, LP: 86, TP: 24, p: "............... ", fam: "Brasuell"},
    "Wilpon Still Sucks": {Wi: 73, L: 100, T: 14, WH: 74, LH: 97, TH: 16, WP: 74, LP: 84, TP: 29, p: "......... ", fam: "Holmdopia"},
    "Tropical Storm Braz": {Wi: 58, L: 116, T: 13, WH: 72, LH: 94, TH: 21, WP: 48, LP: 115, TP: 24, p: "...... ", fam: "Brasuell"},
    "Football Tailgater": {Wi: 48, L: 128, T: 11, WH: 47, LH: 126, TH: 14, WP: 82, LP: 80, TP: 25, p: ".......... ", fam: "Holmdopia"}
  };
  //list your categories here in the order they appear on the scoreboard. They do not need to match the text on the site.
  var cats = ['R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
              'QS', 'W', 'SV', 'ERA', 'WHIP', 'K/9'];
  //list any categories where it's better to have a lower number here, in any order. They need to match the text in cats.
  var neg_cats = ['ERA', 'WHIP'];
  //how many hitting categories do you have?
  var num_hitting_cats = 6;
  //for display purposes when showing highs
  var periods = ['....... ','..... ','.... ', '..... ','.... ','.... ' ,'...... ', '....... ', '...... ', '.... ','.. ','..... '];



  var stats = {};
  var teams = [];
  var highs = {};
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
  });
  var teamAWinsH, teamBWinsH, teamAWinsP, teamBWinsP, i, j, k, teamAVal, teamBVal;

  for (i=0; i<teams.length; i++) {
    for (j=i+1; j<teams.length; j++) {
      teamA = stats[teams[i]];
      teamB = stats[teams[j]];
      teamAWinsH = teamBWinsH = teamAWinsP = teamBWinsP = 0;
      for (k=0; k<cats.length; k++) {
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
  console.log('[b][u]Week Breakdowns (Combined, Hitting, Pitching)[/u][/b]')
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
  console.log('\n[b][u]Season Breakdowns (Combined, Hitting, Pitching)[/u][/b]')
  for (i=0; i<teams.length; i++) {
    histObj = hist[teams[i]]
    console.log(teams[i] + histObj['p'] + '[b]' + histObj['Wi'] + '-' + histObj['L'] + '-' + histObj['T'] + '[/b]' +
                           ', ' + histObj['WH'] + '-' + histObj['LH'] + '-' + histObj['TH'] +
                           ', ' + histObj['WP'] + '-' + histObj['LP'] + '-' + histObj['TP']);
  }

  for (k=0; k<cats.length; k++) {
    highs[cats[k]] = {teams: [teams[0]], val: stats[teams[0]][cats[k]]};
  }
  for (i=1; i<teams.length; i++) {
    for (k=0; k<cats.length; k++) {
      teamBVal = stats[teams[i]][cats[k]];
      if ((highs[cats[k]]['val'] < teamBVal && $.inArray(cats[k], neg_cats) == -1) ||
          (highs[cats[k]]['val'] > teamBVal && $.inArray(cats[k], neg_cats) != -1)) {
        highs[cats[k]]['teams'] = [teams[i]];
        highs[cats[k]]['val'] = teamBVal;
      } else if (highs[cats[k]]['val'] == teamBVal) {
        highs[cats[k]]['teams'].push(teams[i]);
      }
    }
  }

  console.log('\n[b][u]Week Highs:[/u][/b]');
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
      histObj['TP'] + ', p: "' + histObj['p'] + '", fam: "' + histObj['fam'] + '"}' + (i == teams.length-1 ? '' : ','));
  }
  console.log('\t};');

  console.log('\n[b][u]Family Standings[/u][/b]');
  var famStand = {};
  var famObj;
  var families = [];
  for (i=0; i<teams.length; i++) {
    histObj = hist[teams[i]];
    if (famStand[histObj['fam']] == null) {
      famStand[histObj['fam']] = {Wi: 0, L: 0, T: 0, WH: 0, LH: 0, TH: 0, WP: 0, LP: 0, TP: 0};
      families.push(histObj['fam']);
    }
    famObj = famStand[histObj['fam']]
    famObj['Wi'] += histObj['Wi'];
    famObj['L']  += histObj['L'];
    famObj['T']  += histObj['T'];
    famObj['WH'] += histObj['WH'];
    famObj['LH'] += histObj['LH'];
    famObj['TH'] += histObj['TH'];
    famObj['WP'] += histObj['WP'];
    famObj['LP'] += histObj['LP'];
    famObj['TP'] += histObj['TP'];
  }
  totalGames = famObj['Wi'] + famObj['L'] + famObj['T'];
  families.sort(function(a,b){
    teamA = famStand[a];
    teamB = famStand[b];
    return ((teamB['Wi'] + teamB['T']/2)/totalGames) - ((teamA['Wi'] + teamA['T']/2)/totalGames);
  });
  for (i=0; i<families.length; i++) {
    famObj = famStand[families[i]]
    console.log(families[i] + ': [b]' + famObj['Wi'] + '-' + famObj['L'] + '-' + famObj['T'] + '[/b]' +
                           ', ' + famObj['WH'] + '-' + famObj['LH'] + '-' + famObj['TH'] +
                           ', ' + famObj['WP'] + '-' + famObj['LP'] + '-' + famObj['TP']);
  }
}


//type bd()
