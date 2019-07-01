var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
function bd() {


	//put your team names here. this assumes 12 team, but you can adjust add more or remove some if needed
	//the periods are for display purposes. You can remove them, make them different lengths, and replace them.
	//each time you run this, a new version of this object will be printed last. The idea is for you to copy that
	//and paste it here to keep a running total for breakdowns. The team names *will* need to match text on the site.
	var BREAKDOWN_HIST = {
		"Prospect Hoarders": {Wi: 65, L: 20, T: 6, WH: 55, LH: 24, TH: 12, WP: 58, LP: 21, TP: 12, p: ".............. "},
		"Irish Dawgs": {Wi: 50, L: 32, T: 9, WH: 42, LH: 37, TH: 12, WP: 43, LP: 30, TP: 18, p: ".................... "},
		"I Punt Cats": {Wi: 43, L: 40, T: 8, WH: 53, LH: 32, TH: 6, WP: 34, LP: 46, TP: 11, p: ".................... "},
		"Irish Guinness07": {Wi: 38, L: 43, T: 10, WH: 30, LH: 58, TH: 3, WP: 52, LP: 26, TP: 13, p: "............... "},
		"Colt .45s": {Wi: 36, L: 47, T: 8, WH: 53, LH: 29, TH: 9, WP: 21, LP: 62, TP: 8, p: "...................... "},
		"Tropical Storm Braz": {Wi: 36, L: 50, T: 5, WH: 35, LH: 47, TH: 9, WP: 38, LP: 41, TP: 12, p: "............ "},
		"The Mike Shitty All-Stars": {Wi: 34, L: 50, T: 7, WH: 38, LH: 45, TH: 8, WP: 31, LP: 49, TP: 11, p: "...... "},
		"Don't Mess with Texas": {Wi: 32, L: 52, T: 7, WH: 27, LH: 61, TH: 3, WP: 41, LP: 43, TP: 7, p: ".......... "}
	};

	var HIGHS_HIST = {
		"R": {val: 72, teams: ["I Punt Cats"], weeks: [8]},
		"HR": {val: 29, teams: ["I Punt Cats"], weeks: [8]},
		"RBI": {val: 71, teams: ["I Punt Cats"], weeks: [8]},
		"SB": {val: 11, teams: ["I Punt Cats"], weeks: [4]},
		"OBP": {val: 0.426, teams: ["I Punt Cats"], weeks: [9]},
		"SLG": {val: 0.672, teams: ["I Punt Cats"], weeks: [8]},
		"QS": {val: 9, teams: ["Irish Guinness07"], weeks: [2]},
		"W": {val: 7, teams: ["Prospect Hoarders","Prospect Hoarders"], weeks: [10,13]},
		"SV": {val: 8, teams: ["Don't Mess with Texas"], weeks: [9]},
		"ERA": {val: 1.94, teams: ["Don't Mess with Texas"], weeks: [1]},
		"WHIP": {val: 0.794, teams: ["Irish Dawgs"], weeks: [8]},
		"K/9": {val: 13.17, teams: ["Prospect Hoarders"], weeks: [6]}
	};
	
	//list your categories here in the order they appear on the scoreboard. They do not need to match the text on the site.
	var CATS = ['R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'QS', 'W', 'SV', 'ERA', 'WHIP', 'K/9'];
	var NUM_CATS = CATS.length;
	var CATS_LOAD = ['Hitters', 'AB', 'H', 'R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'IP', 'K/9', 'ERA', 'WHIP', 'QS', 'W', 'SV'];
	//list any categories where it's better to have a lower number here, in any order. They need to match the text in CATS.
	var neg_cats = ['ERA', 'WHIP'];
	// list of categories where the team must qualify (currently assumes that if you fail one, you fail them all)
	var qual_cats = ['ERA', 'WHIP', 'K/9'];
	//how many hitting categories do you have?
	var num_hitting_cats = 6;
	//for display purposes when showing highs
	var periods = ['...... ','..... ','.... ', '..... ','.... ','.... ' ,'..... ', '...... ', '..... ', '.... ','... ','.... '];

	console.log("starting...");

	var stats = {};
	var teams = [];
	var highs = {};
	var disqualified = {};
	var row, statObj, teamName, histObj;
	$('td.ng-star-inserted').each(function() {
		row = $(this);
		teamName = row.find('div').text();
		if (teamName && BREAKDOWN_HIST[teamName])
		{
			//console.log('found team ' + teamName);
			teams.push(teamName);
			//row.find('.belowMinimum').each(function(){disqualified[teamName] = true;});
		}
	});
	$('tr.pointer--live-scoring.ng-star-inserted').each(function(rowIndex) {
		row = $(this);
		teamName = teams[rowIndex];
		if (teamName && BREAKDOWN_HIST[teamName])
		{
			statObj = stats[teamName] = {};
			statObj['Wi']=statObj['L']=statObj['T']=statObj['WH']=statObj['LH']=statObj['TH']=statObj['WP']=statObj['LP']=statObj['TP']=0;
			//console.log('getting stats for ' + teamName);
			row.find('td.ng-star-inserted').each(function(colIndex) {
				statObj[CATS_LOAD[colIndex]] = parseFloat($(this).text());
				//console.log(CATS_LOAD[colIndex] + " = " + statObj[CATS_LOAD[colIndex]]);
			});
		}
	});

	var teamAWinsH, teamBWinsH, teamAWinsP, teamBWinsP, i, j, k, teamAVal, teamBVal, week;
	var numTeams = teams.length;

	for (i = 0; i < numTeams; i++)
	{
		for (j = i + 1; j < numTeams; j++)
		{
			teamA = stats[teams[i]];
			teamB = stats[teams[j]];
			teamAWinsH = teamBWinsH = teamAWinsP = teamBWinsP = 0;
			for (k = 0; k < NUM_CATS; k++)
			{
				// first, check disqualifiers
				// if ($.inArray(CATS[k], qual_cats) != -1) {
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
				teamAVal = teamA[CATS[k]];
				teamBVal = teamB[CATS[k]];
				if (teamAVal > teamBVal)
				{
					if (k < num_hitting_cats)
					{
						if ($.inArray(CATS[k], neg_cats) != -1)
							teamBWinsH++
						else
							teamAWinsH++;
					}
					else
					{
						if ($.inArray(CATS[k], neg_cats) != -1)
							teamBWinsP++;
						else
							teamAWinsP++;
					}
				}
				else if (teamAVal < teamBVal)
				{
					if (k < num_hitting_cats)
					{
						if ($.inArray(CATS[k], neg_cats) != -1)
							teamAWinsH++;
						else
							teamBWinsH++;
					}
					else
					{
						if ($.inArray(CATS[k], neg_cats) != -1)
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
		return ((teamB['Wi'] + teamB['T']/2)/(numTeams-1)) - ((teamA['Wi'] + teamA['T']/2)/(numTeams-1));
	});

	for (i = 0; i < numTeams; i++)
	{
		statObj = stats[teams[i]];
		histObj = BREAKDOWN_HIST[teams[i]]
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
			week = (histObj['Wi'] + histObj['L'] + histObj['T']) / (numTeams - 1);
			console.log('Week ' + week + ' Breakdowns (Combined, Hitting, Pitching)')
		}
		console.log(teams[i] + histObj['p'] + '' + statObj['Wi'] + '-' + statObj['L'] + '-' + statObj['T'] +
			', ' + statObj['WH'] + '-' + statObj['LH'] + '-' + statObj['TH'] +
			', ' + statObj['WP'] + '-' + statObj['LP'] + '-' + statObj['TP']);
	}
	var totalGames = histObj['Wi'] + histObj['L'] + histObj['T'];

	teams.sort(function(a,b){
		teamA = BREAKDOWN_HIST[a];
		teamB = BREAKDOWN_HIST[b];
		return ((teamB['Wi'] + teamB['T']/2)/totalGames) - ((teamA['Wi'] + teamA['T']/2)/totalGames);
	});

	console.log('\nSeason Breakdowns (Combined, Hitting, Pitching)');
	var percentage;
	for (i = 0; i < numTeams; i++)
	{
		histObj = BREAKDOWN_HIST[teams[i]];
		percentage = ((histObj['Wi'] + histObj['T']/2)/totalGames).toFixed(3);
		console.log(teams[i] + histObj['p'] + '(' + percentage + ') ' + histObj['Wi'] + '-' + histObj['L'] + '-' + histObj['T'] +
			', ' + histObj['WH'] + '-' + histObj['LH'] + '-' + histObj['TH'] +
			', ' + histObj['WP'] + '-' + histObj['LP'] + '-' + histObj['TP']);
	}

	for (k = 0; k < NUM_CATS; k++)
		highs[CATS[k]] = {teams: [teams[0]], val: stats[teams[0]][CATS[k]]};
	
	for (i = 1; i < numTeams; i++)
	{
		for (k = 0; k < NUM_CATS; k++)
		{
			var catName = CATS[k];
			teamBVal = stats[teams[i]][catName];
			if ($.inArray(catName, qual_cats) != -1 && disqualified[teams[i]])
				continue;
			if ((highs[catName]['val'] < teamBVal && $.inArray(catName, neg_cats) == -1) ||
				(highs[catName]['val'] > teamBVal && $.inArray(catName, neg_cats) != -1))
			{
				highs[catName]['teams'] = [teams[i]];
				highs[catName]['val'] = teamBVal;
			}
			else if (highs[catName]['val'] == teamBVal)
			{
				highs[catName]['teams'].push(teams[i]);
			}
		}
	}

	// print the highs for this week
	console.log('\nWeek ' + week + ' Highs:');
	for (i = 0; i < NUM_CATS; i++)
	{
		var catName = CATS[i];
		if (i == num_hitting_cats)
			console.log(' ');
		console.log(catName + periods[i] + highs[catName]['val'] + ' - ' + highs[catName]['teams'].join('; '));
	}

	// update the historical highs
	for (i = 0; i < NUM_CATS; i++)
	{
		var catName = CATS[i];
		var bNegCat = $.inArray(catName, neg_cats) != -1;
		var thisWeekHighObj = highs[catName];
		var thisWeekHighVal = thisWeekHighObj['val'];
		var thisWeekHighTeams = thisWeekHighObj['teams'];
		var oldHighObj = HIGHS_HIST[catName];

		if (!oldHighObj)
		{
			HIGHS_HIST[catName] = oldHighObj = {teams: thisWeekHighTeams, val: thisWeekHighVal, weeks: []};
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
	for (i = 0; i < NUM_CATS; i++)
	{
		if (i == num_hitting_cats)
			console.log(' ');
		var catName = CATS[i];
		var highHistObj = HIGHS_HIST[catName];
		console.log(catName + periods[i] + highHistObj['val'] + ' - ' + (highHistObj['teams'].length > 3 ? highHistObj['teams'].length + ' tied' :
			highHistObj['teams'].join('; ') + ' - ' + (highHistObj['weeks'].length == 1 ? 'Week ' : 'Weeks ') + highHistObj['weeks'].join(',')));
	}

	// print the BREAKDOWN_HIST object for updating
	console.log('\n\nvar BREAKDOWN_HIST = {');
	for (i = 0; i < numTeams; i++)
	{
		histObj = BREAKDOWN_HIST[teams[i]];
		console.log('\t\t"' + teams[i] + '": {Wi: ' + histObj['Wi'] + ', L: ' + histObj['L'] + ', T: ' +
			histObj['T'] + ', WH: ' + histObj['WH'] + ', LH: ' + histObj['LH'] + ', TH: ' +
			histObj['TH'] + ', WP: ' + histObj['WP'] + ', LP: ' + histObj['LP'] + ', TP: ' +
			histObj['TP'] + ', p: "' + histObj['p'] + '"}' + (i == numTeams-1 ? '' : ','));
	}
	console.log('\t};');

	// print the highs hist object for updating
	console.log('\n\tvar HIGHS_HIST = {');
	for (i = 0; i < NUM_CATS; i++)
	{
		var catName = CATS[i];
		var histHighsObj = HIGHS_HIST[catName];
		console.log('\t\t"' + catName + '": {val: ' + histHighsObj['val'] + ', teams: ["' + histHighsObj['teams'].join('","') + '"], weeks: [' + 
			histHighsObj['weeks'].join(',') + ']}' + (i + 1 == NUM_CATS ? '' : ','));
	}
	console.log('\t};');
}
