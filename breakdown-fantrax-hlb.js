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
		"I Punt Cats": {Wi: 112, L: 35, T: 6, WH: 100, LH: 37, TH: 16, WP: 97, LP: 32, TP: 24, p: "................. "},
		"Don't Mess with Texas": {Wi: 93, L: 47, T: 13, WH: 73, LH: 58, TH: 22, WP: 83, LP: 43, TP: 27, p: "....... "},
		"Prospect Hoarders": {Wi: 86, L: 53, T: 14, WH: 79, LH: 61, TH: 13, WP: 65, LP: 63, TP: 25, p: "........... "},
		"Tropical Storm Braz": {Wi: 73, L: 64, T: 16, WH: 72, LH: 58, TH: 23, WP: 65, LP: 70, TP: 18, p: "......... "},
		"Irish Dawgs": {Wi: 69, L: 68, T: 16, WH: 72, LH: 63, TH: 18, WP: 64, LP: 66, TP: 23, p: "................. "},
		"The Mike Shitty All-Stars": {Wi: 68, L: 73, T: 12, WH: 41, LH: 89, TH: 23, WP: 83, LP: 47, TP: 23, p: "... "},
		"Colt .45s": {Wi: 69, L: 74, T: 10, WH: 73, LH: 53, TH: 27, WP: 51, LP: 75, TP: 27, p: "................... "},
		"Irish Guinness07": {Wi: 56, L: 78, T: 19, WH: 65, LH: 70, TH: 18, WP: 52, LP: 80, TP: 21, p: "............ "},
		"Boguslaw's Barrelers": {Wi: 57, L: 88, T: 8, WH: 61, LH: 76, TH: 16, WP: 57, LP: 73, TP: 23, p: "........ "},
		"Niptits": {Wi: 18, L: 121, T: 14, WH: 33, LH: 104, TH: 16, WP: 36, LP: 104, TP: 13, p: "..................... "}
	};

	var HIGHS_HIST = {
		"R": {val: 59, teams: ["Irish Dawgs"], weeks: [16]},
		"HR": {val: 28, teams: ["Irish Dawgs"], weeks: [16]},
		"RBI": {val: 72, teams: ["Irish Dawgs"], weeks: [16]},
		"SB": {val: 11, teams: ["The Mike Shitty All-Stars"], weeks: [8]},
		"OBP": {val: 0.405, teams: ["I Punt Cats"], weeks: [6]},
		"SLG": {val: 0.597, teams: ["Don't Mess with Texas","Irish Dawgs"], weeks: [15,16]},
		"QS": {val: 8, teams: ["The Mike Shitty All-Stars"], weeks: [7]},
		"W": {val: 7, teams: ["I Punt Cats","Colt .45s"], weeks: [8,16]},
		"SV": {val: 7, teams: ["Don't Mess with Texas","Don't Mess with Texas","Tropical Storm Braz"], weeks: [3,8,10]},
		"ERA": {val: 1.06, teams: ["The Mike Shitty All-Stars"], weeks: [7]},
		"WHIP": {val: 0.696, teams: ["Don't Mess with Texas"], weeks: [8]},
		"K/9": {val: 12.58, teams: ["I Punt Cats"], weeks: [10]}
	};
	
	//list your categories here in the order they appear on the scoreboard. They do not need to match the text on the site.
	var CATS = ['R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'QS', 'W', 'SV', 'ERA', 'WHIP', 'K/9'];
	var NUM_CATS = CATS.length;
	var CATS_LOAD = ['Pts', '+/-', 'AB', 'H', 'R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'IP', 'K/9', 'ERA', 'WHIP', 'QS', 'W', 'SV'];
	//list any categories where it's better to have a lower number here, in any order. They need to match the text in CATS.
	var neg_cats = ['ERA', 'WHIP'];
	// list of categories where the team must qualify (currently assumes that if you fail one, you fail them all)
	var qual_cats = ['ERA', 'WHIP', 'K/9'];
	//how many hitting categories do you have?
	var num_hitting_cats = 6;
	//for display purposes when showing highs
	var periods = ['...... ','..... ','.... ', '..... ','.... ','.... ' ,'..... ', '...... ', '..... ', '.... ','... ','.... '];

	var stats = {};
	var teams = [];
	var highs = {};
	var disqualified = {};
	var row, statObj, teamName, histObj;
	$('a.text--ellipsis').each(function() {
		row = $(this);
		teamName = row.text().trim();
		if (teamName && BREAKDOWN_HIST[teamName])
		{
			//console.log('found team ' + teamName);
			teams.push(teamName);
			//row.find('.belowMinimum').each(function(){disqualified[teamName] = true;});
		}
	});

	var liveScoringTable = $('league-livescoring-stat-table.live-scoring-stats.ng-star-inserted').first();
	var tableBody = liveScoringTable.find('div.i-table__body').first();
	tableBody.find('div.i-table__row.ng-star-inserted').each(function(rowIndex) {
		row = $(this);
		teamName = teams[rowIndex];
		
		if (teamName && BREAKDOWN_HIST[teamName])
		{
			statObj = stats[teamName] = {};
			statObj['Wi']=statObj['L']=statObj['T']=statObj['WH']=statObj['LH']=statObj['TH']=statObj['WP']=statObj['LP']=statObj['TP']=0;
			//console.log('getting stats for ' + teamName);
			row.find('div.i-table__cell.i-table__cell--center.ng-star-inserted').each(function(colIndex) {
				var categoryName = CATS_LOAD[colIndex];
				if ($(this).text() == "")
				{
					//console.log('found empty text');
					statObj[categoryName] = 0;
					if ($.inArray(categoryName, qual_cats) != -1)
						disqualified[teamName] = true;
				}
				else
				{
					statObj[categoryName] = parseFloat($(this).text());
					//console.log(categoryName + " = " + statObj[categoryName]);
				}
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
				if ($.inArray(CATS[k], qual_cats) != -1) {
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

	var output = "";

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
			output += '\n' + 'Week ' + week + ' Breakdowns (Combined, Hitting, Pitching)';
		}
		output += '\n' + teams[i] + histObj['p'] + '' + statObj['Wi'] + '-' + statObj['L'] + '-' + statObj['T'] +
			', ' + statObj['WH'] + '-' + statObj['LH'] + '-' + statObj['TH'] +
			', ' + statObj['WP'] + '-' + statObj['LP'] + '-' + statObj['TP'];
	}
	var totalGames = histObj['Wi'] + histObj['L'] + histObj['T'];

	teams.sort(function(a,b){
		teamA = BREAKDOWN_HIST[a];
		teamB = BREAKDOWN_HIST[b];
		return ((teamB['Wi'] + teamB['T']/2)/totalGames) - ((teamA['Wi'] + teamA['T']/2)/totalGames);
	});

	output += '\n' + '\nSeason Breakdowns (Combined, Hitting, Pitching)';
	for (i = 0; i < numTeams; i++)
	{
		histObj = BREAKDOWN_HIST[teams[i]];
		var percentage = ((histObj['Wi'] + histObj['T']/2)/totalGames).toFixed(3);
		var hPerc = ((histObj['WH'] + histObj['TH']/2)/totalGames).toFixed(3);
		var pPerc = ((histObj['WP'] + histObj['TP']/2)/totalGames).toFixed(3);
		var totalBd = '(' + percentage + ') ' + histObj['Wi'] + '-' + histObj['L'] + '-' + histObj['T'];
		var hitBd = '(' + hPerc + ') ' + histObj['WH'] + '-' + histObj['LH'] + '-' + histObj['TH'];
		var pitchBd = '(' + pPerc + ') ' + histObj['WP'] + '-' + histObj['LP'] + '-' + histObj['TP'];
		var bdLine = teams[i] + histObj['p'] + totalBd + ",";
		for (j = totalBd.length; j <= 17; j++)
			bdLine += " ";
		bdLine += hitBd + ",";
		for (j = hitBd.length; j <= 17; j++)
			bdLine += " ";
		output += '\n' + bdLine + pitchBd;
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
	output += '\n' + '\nWeek ' + week + ' Highs:';
	for (i = 0; i < NUM_CATS; i++)
	{
		var catName = CATS[i];
		if (i == num_hitting_cats)
			output += '\n' + ' ';
		output += '\n' + catName + periods[i] + highs[catName]['val'] + ' - ' + highs[catName]['teams'].join('; ');
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
	output += '\n' + '\nSeason  Highs:';
	for (i = 0; i < NUM_CATS; i++)
	{
		if (i == num_hitting_cats)
			output += '\n' + ' ';
		var catName = CATS[i];
		var highHistObj = HIGHS_HIST[catName];
		output += '\n' + catName + periods[i] + highHistObj['val'] + ' - ' + (highHistObj['teams'].length > 3 ? highHistObj['teams'].length + ' tied' :
			highHistObj['teams'].join('; ') + ' - ' + (highHistObj['weeks'].length == 1 ? 'Week ' : 'Weeks ') + highHistObj['weeks'].join(','));
	}

	// print the BREAKDOWN_HIST object for updating
	output += '\n' + '\n\nvar BREAKDOWN_HIST = {';
	for (i = 0; i < numTeams; i++)
	{
		histObj = BREAKDOWN_HIST[teams[i]];
		output += '\n' + '\t\t"' + teams[i] + '": {Wi: ' + histObj['Wi'] + ', L: ' + histObj['L'] + ', T: ' +
			histObj['T'] + ', WH: ' + histObj['WH'] + ', LH: ' + histObj['LH'] + ', TH: ' +
			histObj['TH'] + ', WP: ' + histObj['WP'] + ', LP: ' + histObj['LP'] + ', TP: ' +
			histObj['TP'] + ', p: "' + histObj['p'] + '"}' + (i == numTeams-1 ? '' : ',');
	}
	output += '\n' + '\t};';

	// print the highs hist object for updating
	output += '\n' + '\n\tvar HIGHS_HIST = {';
	for (i = 0; i < NUM_CATS; i++)
	{
		var catName = CATS[i];
		var histHighsObj = HIGHS_HIST[catName];
		output += '\n' + '\t\t"' + catName + '": {val: ' + histHighsObj['val'] + ', teams: ["' + histHighsObj['teams'].join('","') + '"], weeks: [' + 
			histHighsObj['weeks'].join(',') + ']}' + (i + 1 == NUM_CATS ? '' : ',');
	}
	output += '\n' + '\t};';
	console.log(output);
}
