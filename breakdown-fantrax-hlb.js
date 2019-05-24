var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
function bd() {


	//put your team names here. this assumes 12 team, but you can adjust add more or remove some if needed
	//the periods are for display purposes. You can remove them, make them different lengths, and replace them.
	//each time you run this, a new version of this object will be printed last. The idea is for you to copy that
	//and paste it here to keep a running total for breakdowns. The team names *will* need to match text on the site.
	var hist = {
		"Prospect Hoarders": {Wi: 30, L: 13, T: 6, WH: 27, LH: 15, TH: 7, WP: 27, LP: 14, TP: 8, p: "................ "},
		"Irish Dawgs": {Wi: 27, L: 16, T: 6, WH: 21, LH: 20, TH: 8, WP: 24, LP: 15, TP: 10, p: "........................ "},
		"Irish Guinness07": {Wi: 27, L: 18, T: 4, WH: 24, LH: 23, TH: 2, WP: 27, LP: 15, TP: 7, p: "................. "},
		"Colt .45s": {Wi: 23, L: 23, T: 3, WH: 30, LH: 13, TH: 6, WP: 11, LP: 35, TP: 3, p: "............................. "},
		"I Punt Cats": {Wi: 21, L: 26, T: 2, WH: 25, LH: 21, TH: 3, WP: 18, LP: 27, TP: 4, p: ".......................... "},
		"Tropical Storm Braz": {Wi: 21, L: 27, T: 1, WH: 21, LH: 25, TH: 3, WP: 24, LP: 20, TP: 5, p: "............. "},
		"Don't Mess with Texas": {Wi: 17, L: 28, T: 4, WH: 10, LH: 37, TH: 2, WP: 30, LP: 17, TP: 2, p: ".......... "},
		"The Mike Shitty All-Stars": {Wi: 15, L: 30, T: 4, WH: 20, LH: 24, TH: 5, WP: 13, LP: 31, TP: 5, p: "...... "}
	};

	var highsHist = {
		"R": {val: 62, teams: ["Irish Guinness07"], weeks: [4]},
		"HR": {val: 22, teams: ["Tropical Storm Braz"], weeks: [3]},
		"RBI": {val: 66, teams: ["Irish Dawgs","Irish Guinness07"], weeks: [2,4]},
		"SB": {val: 11, teams: ["I Punt Cats"], weeks: [4]},
		"OBP": {val: 0.387, teams: ["Colt .45s"], weeks: [1]},
		"SLG": {val: 0.577, teams: ["Irish Dawgs"], weeks: [2]},
		"QS": {val: 9, teams: ["Irish Guinness07"], weeks: [2]},
		"W": {val: 6, teams: ["Irish Dawgs"], weeks: [5]},
		"SV": {val: 6, teams: ["Don't Mess with Texas","Don't Mess with Texas","Don't Mess with Texas"], weeks: [2,6,7]},
		"ERA": {val: 1.94, teams: ["Don't Mess with Texas"], weeks: [1]},
		"WHIP": {val: 0.797, teams: ["Don't Mess with Texas"], weeks: [1]},
		"K/9": {val: 13.17, teams: ["Prospect Hoarders"], weeks: [6]}
	};
	
	//list your categories here in the order they appear on the scoreboard. They do not need to match the text on the site.
	var cats = ['R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'QS', 'W', 'SV', 'ERA', 'WHIP', 'K/9'];
	var catsLoad = ['Hitters', 'AB', 'H', 'R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'IP', 'K/9', 'ERA', 'WHIP', 'QS', 'W', 'SV'];
	//list any categories where it's better to have a lower number here, in any order. They need to match the text in cats.
	var neg_cats = ['ERA', 'WHIP'];
	// list of categories where the team must qualify (currently assumes that if you fail one, you fail them all)
	var qual_cats = ['ERA', 'WHIP', 'K/9'];
	//how many hitting categories do you have?
	var num_hitting_cats = 6;
	//for display purposes when showing highs
	var periods = ['....... ','..... ','.... ', '..... ','.... ','.... ' ,'...... ', '....... ', '...... ', '.... ','.. ','..... '];

	console.log("starting...");

	var stats = {};
	var teams = [];
	var highs = {};
	var disqualified = {};
	var row, statObj, teamName, histObj;
	$('td.ng-star-inserted').each(function() {
		row = $(this);
		teamName = row.find('div').text();
		if (teamName && hist[teamName])
		{
			//console.log('found team ' + teamName);
			teams.push(teamName);
			//row.find('.belowMinimum').each(function(){disqualified[teamName] = true;});
		}
	});
	$('tr.pointer--live-scoring.ng-star-inserted').each(function(rowIndex) {
		row = $(this);
		teamName = teams[rowIndex];
		if (teamName && hist[teamName])
		{
			statObj = stats[teamName] = {};
			statObj['Wi']=statObj['L']=statObj['T']=statObj['WH']=statObj['LH']=statObj['TH']=statObj['WP']=statObj['LP']=statObj['TP']=0;
			//console.log('getting stats for ' + teamName);
			row.find('td.ng-star-inserted').each(function(colIndex) {
				statObj[catsLoad[colIndex]] = parseFloat($(this).text());
				//console.log(catsLoad[colIndex] + " = " + statObj[catsLoad[colIndex]]);
			});
		}
	});

	var teamAWinsH, teamBWinsH, teamAWinsP, teamBWinsP, i, j, k, teamAVal, teamBVal, week;

	for (i = 0; i < teams.length; i++)
	{
		for (j = i + 1; j < teams.length; j++)
		{
			teamA = stats[teams[i]];
			teamB = stats[teams[j]];
			teamAWinsH = teamBWinsH = teamAWinsP = teamBWinsP = 0;
			for (k = 0; k < cats.length; k++)
			{
				// first, check disqualifiers
				// if ($.inArray(cats[k], qual_cats) != -1) {
				//   if (disqualified[teams[i]]) {
				//     if (!disqualified[teams[j]]) {
				//       if (k < num_hitting_cats) {
				//         teamBWinsH++;
				//       } else {
				//         teamBWinsP++;
				//       }
				//     }
				//     continue;
				//   } else if (disqualified[teams[j]]) {
				//     if (k < num_hitting_cats) {
				//       teamAWinsH++;
				//     } else {
				//       teamAWinsP++;
				//     }
				//     continue;
				//   }
				// } // end check disqualifiers
				teamAVal = teamA[cats[k]];
				teamBVal = teamB[cats[k]];
				if (teamAVal > teamBVal)
				{
					if (k < num_hitting_cats)
					{
						if ($.inArray(cats[k], neg_cats) != -1)
							teamBWinsH++
						else
							teamAWinsH++;
					}
					else
					{
						if ($.inArray(cats[k], neg_cats) != -1)
							teamBWinsP++;
						else
							teamAWinsP++;
					}
				}
				else if (teamAVal < teamBVal)
				{
					if (k < num_hitting_cats)
					{
						if ($.inArray(cats[k], neg_cats) != -1)
							teamAWinsH++;
						else
							teamBWinsH++;
					}
					else
					{
						if ($.inArray(cats[k], neg_cats) != -1)
							teamAWinsP++;
						else
							teamBWinsP++;
					}
				}
			}
			if ((teamAWinsH + teamAWinsP) > (teamBWinsH + teamBWinsP))
			{
				teamA['Wi']++;
				teamB['L']++;
			}
			else if ((teamAWinsH + teamAWinsP) < (teamBWinsH + teamBWinsP))
			{
				teamA['L']++;
				teamB['Wi']++;
			}
			else
			{
				teamA['T']++;
				teamB['T']++;
			}
			if (teamAWinsH > teamBWinsH)
			{
				teamA['WH']++;
				teamB['LH']++;
			}
			else if (teamAWinsH < teamBWinsH)
			{
				teamA['LH']++;
				teamB['WH']++;
			}
			else
			{
				teamA['TH']++;
				teamB['TH']++;
			}
			if (teamAWinsP > teamBWinsP)
			{
				teamA['WP']++;
				teamB['LP']++;
			}
			else if (teamAWinsP < teamBWinsP)
			{
				teamA['LP']++;
				teamB['WP']++;
			}
			else
			{
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

	for (i = 0; i < teams.length; i++)
	{
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
		if (!i)
		{
			week = (histObj['Wi'] + histObj['L'] + histObj['T']) / (teams.length - 1);
			console.log('Week ' + week + ' Breakdowns (Combined, Hitting, Pitching)')
		}
		console.log(teams[i] + histObj['p'] + '' + statObj['Wi'] + '-' + statObj['L'] + '-' + statObj['T'] +
			', ' + statObj['WH'] + '-' + statObj['LH'] + '-' + statObj['TH'] +
			', ' + statObj['WP'] + '-' + statObj['LP'] + '-' + statObj['TP']);
	}
	var totalGames = histObj['Wi'] + histObj['L'] + histObj['T'];

	teams.sort(function(a,b){
		teamA = hist[a];
		teamB = hist[b];
		return ((teamB['Wi'] + teamB['T']/2)/totalGames) - ((teamA['Wi'] + teamA['T']/2)/totalGames);
	});

	console.log('\nSeason Breakdowns (Combined, Hitting, Pitching)');
	var percentage;
	for (i = 0; i < teams.length; i++)
	{
		histObj = hist[teams[i]];
		percentage = ((histObj['Wi'] + histObj['T']/2)/totalGames).toFixed(3);
		console.log(teams[i] + histObj['p'] + '(' + percentage + ') ' + histObj['Wi'] + '-' + histObj['L'] + '-' + histObj['T'] +
			', ' + histObj['WH'] + '-' + histObj['LH'] + '-' + histObj['TH'] +
			', ' + histObj['WP'] + '-' + histObj['LP'] + '-' + histObj['TP']);
	}

	for (k = 0; k < cats.length; k++)
		highs[cats[k]] = {teams: [teams[0]], val: stats[teams[0]][cats[k]]};
	
	for (i = 1; i < teams.length; i++)
	{
		for (k = 0; k < cats.length; k++)
		{
			teamBVal = stats[teams[i]][cats[k]];
			if ($.inArray(cats[k], qual_cats) != -1 && disqualified[teams[i]])
				continue;
			if ((highs[cats[k]]['val'] < teamBVal && $.inArray(cats[k], neg_cats) == -1) ||
				(highs[cats[k]]['val'] > teamBVal && $.inArray(cats[k], neg_cats) != -1))
			{
				highs[cats[k]]['teams'] = [teams[i]];
				highs[cats[k]]['val'] = teamBVal;
			}
			else if (highs[cats[k]]['val'] == teamBVal)
			{
				highs[cats[k]]['teams'].push(teams[i]);
			}
		}
	}

	// print the highs for this week
	console.log('\nWeek ' + week + ' Highs:');
	for (i = 0; i < cats.length; i++)
	{
		if (i == cats.length >> 1)
			console.log(' ');
		console.log(cats[i] + periods[i] + highs[cats[i]]['val'] + ' - ' + highs[cats[i]]['teams'].join('; '));
	}

	// update the historical highs
	for (i = 0; i < cats.length; i++)
	{
		var catName = cats[i];
		var bNegCat = $.inArray(catName, neg_cats) != -1;
		var thisWeekHighObj = highs[catName];
		var thisWeekHighVal = thisWeekHighObj['val'];
		var thisWeekHighTeams = thisWeekHighObj['teams'];
		var oldHighObj = highsHist[catName];

		if (!oldHighObj)
		{
			highsHist[catName] = oldHighObj = {teams: thisWeekHighTeams, val: thisWeekHighVal, weeks: []};
			for (j = 0; j < thisWeekHighTeams.length; j++)
				oldHighObj['weeks'].push(week);
		}
		else
		{
			var oldHighVal = oldHighObj['val'];
			if (oldHighVal == thisWeekHighVal)
			{
				for (j = 0; j < thisWeekHighTeams.length; j++)
				{
					oldHighObj['teams'].push(thisWeekHighTeams[j]);
					oldHighObj['weeks'].push(week);
				}
			}
			else if ((oldHighVal > thisWeekHighVal) == bNegCat)
			{
				oldHighObj['val'] = thisWeekHighVal;
				oldHighObj['teams'] = thisWeekHighTeams;
				oldHighObj['weeks'] = [];
				for (j = 0; j < thisWeekHighTeams.length; j++)
					oldHighObj['weeks'].push(week);
			}
		}
	}

	// print the historicalhighs after this week
	console.log('\nSeason  Highs:');
	for (i = 0; i < cats.length; i++)
	{
		if (i == cats.length >> 1)
			console.log(' ');
		var catName = cats[i];
		var highHistObj = highsHist[catName];
		console.log(catName + periods[i] + highHistObj['val'] + ' - ' + (highHistObj['teams'].length > 3 ? highHistObj['teams'].length + ' tied' :
			highHistObj['teams'].join('; ') + ' - ' + (highHistObj['weeks'].length == 1 ? 'Week ' : 'Weeks ') + highHistObj['weeks'].join(',')));
	}

	// print the hist object for updating
	console.log('\n\nvar hist = {');
	for (i = 0; i < teams.length; i++)
	{
		histObj = hist[teams[i]];
		console.log('\t\t"' + teams[i] + '": {Wi: ' + histObj['Wi'] + ', L: ' + histObj['L'] + ', T: ' +
			histObj['T'] + ', WH: ' + histObj['WH'] + ', LH: ' + histObj['LH'] + ', TH: ' +
			histObj['TH'] + ', WP: ' + histObj['WP'] + ', LP: ' + histObj['LP'] + ', TP: ' +
			histObj['TP'] + ', p: "' + histObj['p'] + '"}' + (i == teams.length-1 ? '' : ','));
	}
	console.log('\t};');

	// print the highs hist object for updating
	console.log('\n\tvar highsHist = {');
	for (i = 0; i < cats.length; i++)
	{
		var catName = cats[i];
		var histHighsObj = highsHist[catName];
		console.log('\t\t"' + catName + '": {val: ' + histHighsObj['val'] + ', teams: ["' + histHighsObj['teams'].join('","') + '"], weeks: [' + 
			histHighsObj['weeks'].join(',') + ']}' + (i + 1 == cats.length ? '' : ','));
	}
	console.log('\t};');
}
