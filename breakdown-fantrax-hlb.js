var js = document.createElement("script");
js.type = "text/javascript";
js.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
document.body.appendChild(js);
function bd(bLongWeek = false, bMidWeek = false) {


	//put your team names here. this assumes 12 team, but you can adjust add more or remove some if needed
	//the periods are for display purposes. You can remove them, make them different lengths, and replace them.
	//each time you run this, a new version of this object will be printed last. The idea is for you to copy that
	//and paste it here to keep a running total for breakdowns. The team names *will* need to match text on the site.
	var BREAKDOWN_HIST = {
		"Colt .45s": {Wi: 79, L: 7, T: 4, WH: 73, LH: 14, TH: 3, WP: 64, LP: 18, TP: 8},
		"Magic Mikes": {Wi: 60, L: 23, T: 7, WH: 53, LH: 27, TH: 10, WP: 56, LP: 26, TP: 8},
		"BringDing Dingers": {Wi: 47, L: 35, T: 8, WH: 50, LH: 39, TH: 1, WP: 41, LP: 40, TP: 9},
		"Boguslaw's Barrelers": {Wi: 43, L: 39, T: 8, WH: 47, LH: 39, TH: 4, WP: 35, LP: 45, TP: 10},
		"Tropical Storm Braz": {Wi: 42, L: 40, T: 8, WH: 44, LH: 42, TH: 4, WP: 38, LP: 39, TP: 13},
		"Irish Guinness07": {Wi: 35, L: 44, T: 11, WH: 37, LH: 46, TH: 7, WP: 36, LP: 46, TP: 8},
		"Prospect Hoarders": {Wi: 34, L: 50, T: 6, WH: 33, LH: 50, TH: 7, WP: 39, LP: 43, TP: 8},
		"Irish Dawgs": {Wi: 28, L: 57, T: 5, WH: 35, LH: 48, TH: 7, WP: 21, LP: 65, TP: 4},
		"I Punt Cats": {Wi: 23, L: 59, T: 8, WH: 19, LH: 65, TH: 6, WP: 48, LP: 33, TP: 9},
		"Niptits": {Wi: 21, L: 58, T: 11, WH: 30, LH: 51, TH: 9, WP: 30, LP: 53, TP: 7}
	};

	var HIGHS_HIST = {
		"R": {val: 55, teams: ["Tropical Storm Braz"], weeks: [6]},
		"HR": {val: 18, teams: ["Irish Guinness07","BringDing Dingers","Magic Mikes","Colt .45s"], weeks: [7,8,9,10]},
		"RBI": {val: 61, teams: ["Colt .45s"], weeks: [10]},
		"SB": {val: 18, teams: ["Tropical Storm Braz"], weeks: [3]},
		"OBP": {val: 0.385, teams: ["Tropical Storm Braz"], weeks: [3]},
		"SLG": {val: 0.542, teams: ["BringDing Dingers"], weeks: [10]},
		"QS": {val: 8, teams: ["Niptits","I Punt Cats"], weeks: [2,9]},
		"W": {val: 8, teams: ["Magic Mikes","Colt .45s"], weeks: [3,6]},
		"SV": {val: 7, teams: ["BringDing Dingers"], weeks: [9]},
		"ERA": {val: 1.08, teams: ["Colt .45s"], weeks: [6]},
		"WHIP": {val: 0.798, teams: ["Niptits"], weeks: [2]},
		"K/9": {val: 12.07, teams: ["Irish Dawgs"], weeks: [1]}
	};
	
	//list your categories here in the order they appear on the scoreboard. They do not need to match the text on the site.
	var CATS = ['R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'QS', 'W', 'SV', 'ERA', 'WHIP', 'K/9'];
	var NUM_CATS = CATS.length;
	var CATS_LOAD = ['Pts', '+/-', 'Proj', 'AB', 'H', 'R', 'HR', 'RBI', 'SB', 'OBP', 'SLG',
		'IP', 'W', 'QS', 'SV', 'ERA', 'WHIP', 'K/9'];
	//list any categories where it's better to have a lower number here, in any order. They need to match the text in CATS.
	var neg_cats = ['ERA', 'WHIP'];
	// list of categories where the team must qualify (currently assumes that if you fail one, you fail them all)
	var qual_cats = ['ERA', 'WHIP', 'K/9'];
	// categories that are based on percentages
	var perc_cats = ['OBP', 'SLG', 'ERA', 'WHIP', 'K/9'];
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
		if (teamName)
		{
			//console.log('found team ' + teamName);
			teams.push(teamName);
			//row.find('.belowMinimum').each(function(){disqualified[teamName] = true;});
			if (!BREAKDOWN_HIST[teamName])
				BREAKDOWN_HIST[teamName] = {Wi: 0, L: 0, T: 0, WH: 0, LH: 0, TH: 0, WP: 0, LP: 0, TP: 0};
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
		teamA = stats[teams[i]];
		for (j = i + 1; j < numTeams; j++)
		{
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

	var longestTeamLen = 0;
	for (i = 0; i < numTeams; i++)
	{
		if (teams[i].length > longestTeamLen)
			longestTeamLen = teams[i].length;
	}

	for (i = 0; i < numTeams; i++)
	{
		histObj = BREAKDOWN_HIST[teams[i]];
		var p = '';
		var numDots = longestTeamLen - teams[i].length + 5;
		for (j = 0; j < numDots; j++)
			p += '.';
		histObj['p'] = p + ' ';
	}

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
		output += '\n' + teams[i] + histObj['p'] + statObj['Wi'] + '-' + statObj['L'] + '-' + statObj['T'] +
			', ' + statObj['WH'] + '-' + statObj['LH'] + '-' + statObj['TH'] +
			', ' + statObj['WP'] + '-' + statObj['LP'] + '-' + statObj['TP'];
	}
	var totalGames = histObj['Wi'] + histObj['L'] + histObj['T'];

	teams.sort(function(a,b){
		teamA = BREAKDOWN_HIST[a];
		teamB = BREAKDOWN_HIST[b];
		return ((teamB['Wi'] + teamB['T']/2)/totalGames) - ((teamA['Wi'] + teamA['T']/2)/totalGames);
	});

	if (!bMidWeek)
	{
		output += '\n' + '\nSeason Breakdowns (Combined, Hitting, Pitching)';
		var bdLines = []; var hitBds = []; var pitchBds = [];
		var maxBdLineLen = 0; var maxHitLen = 0;
		for (i = 0; i < numTeams; i++)
		{
			histObj = BREAKDOWN_HIST[teams[i]];
			var percentage = ((histObj['Wi'] + histObj['T']/2)/totalGames).toFixed(3);
			var hPerc = ((histObj['WH'] + histObj['TH']/2)/totalGames).toFixed(3);
			var pPerc = ((histObj['WP'] + histObj['TP']/2)/totalGames).toFixed(3);
			var totalBd = '(' + percentage + ') ' + histObj['Wi'] + '-' + histObj['L'] + '-' + histObj['T'];
			var hitBd = '(' + hPerc + ') ' + histObj['WH'] + '-' + histObj['LH'] + '-' + histObj['TH'] + ",";
			var pitchBd = '(' + pPerc + ') ' + histObj['WP'] + '-' + histObj['LP'] + '-' + histObj['TP'];
			var bdLine = teams[i] + histObj['p'] + totalBd + ",";
			if (bdLine.length > maxBdLineLen)
				maxBdLineLen = bdLine.length;
			if (hitBd.length > maxHitLen)
				maxHitLen = hitBd.length;
			bdLines.push(bdLine);
			hitBds.push(hitBd);
			pitchBds.push(pitchBd);
		}

		for (i = 0; i < bdLines.length; i++)
		{
			output += '\n' + bdLines[i];
			for (j = bdLines[i].length; j <= maxBdLineLen; j++)
				output += " ";
			output += hitBds[i];
			for (j = hitBds[i].length; j <= maxHitLen; j++)
				output += " ";
			output += pitchBds[i];
		}
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

	if (!bMidWeek)
	{
		// update the historical highs
		for (i = 0; i < NUM_CATS; i++)
		{
			var catName = CATS[i];
			if (bLongWeek && ($.inArray(catName, perc_cats) == -1))
				continue;

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
			if (bLongWeek && ($.inArray(catName, perc_cats) == -1) && !highHistObj)
				continue;
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
				histObj['TP'] + '}' + (i == numTeams-1 ? '' : ',');
		}
		output += '\n' + '\t};';

		// print the highs hist object for updating
		output += '\n' + '\n\tvar HIGHS_HIST = {';
		for (i = 0; i < NUM_CATS; i++)
		{
			var catName = CATS[i];
			var histHighsObj = HIGHS_HIST[catName];
			if (bLongWeek && ($.inArray(catName, perc_cats) == -1) && !histHighsObj)
				continue;
			output += '\n' + '\t\t"' + catName + '": {val: ' + histHighsObj['val'] + ', teams: ["' + histHighsObj['teams'].join('","') + '"], weeks: [' + 
				histHighsObj['weeks'].join(',') + ']}' + (i + 1 == NUM_CATS ? '' : ',');
		}
		output += '\n' + '\t};';
	}
	console.log(output);
} // bd(bLongWeek = false, bMidWeek = false)
