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
		"Prospect Hoarders": {Wi: 23, L: 9, T: 3, WH: 21, LH: 10, TH: 4, WP: 18, LP: 12, TP: 5, p: "................ "},
		"Irish Dawgs": {Wi: 21, L: 10, T: 4, WH: 17, LH: 14, TH: 4, WP: 17, LP: 11, TP: 7, p: "........................ "},
		"Irish Guinness07": {Wi: 20, L: 11, T: 4, WH: 17, LH: 17, TH: 1, WP: 21, LP: 11, TP: 3, p: "................. "},
		"Tropical Storm Braz": {Wi: 19, L: 15, T: 1, WH: 17, LH: 17, TH: 1, WP: 24, LP: 6, TP: 5, p: "............. "},
		"Don't Mess with Texas": {Wi: 13, L: 19, T: 3, WH: 7, LH: 26, TH: 2, WP: 23, LP: 11, TP: 1, p: ".......... "},
		"I Punt Cats": {Wi: 13, L: 20, T: 2, WH: 18, LH: 14, TH: 3, WP: 10, LP: 21, TP: 4, p: ".......................... "},
		"Colt .45s": {Wi: 10, L: 22, T: 3, WH: 17, LH: 13, TH: 5, WP: 5, LP: 28, TP: 2, p: "............................. "},
		"The Mike Shitty All-Stars": {Wi: 10, L: 23, T: 2, WH: 14, LH: 17, TH: 4, WP: 7, LP: 25, TP: 3, p: "...... "}
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
	for (i = 0; i < teams.length; i++)
	{
		histObj = hist[teams[i]];
		percentage = ((histObj['Wi'] + histObj['T']/2)/totalGames).toFixed(3);
		console.log(teams[i] + histObj['p'] + '(' + percentage + ') [b]' + histObj['Wi'] + '-' + histObj['L'] + '-' + histObj['T'] + '[/b]' +
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

	console.log('\n[b][u]Week ' + week + ' Highs:[/u][/b]');
	for (i = 0; i < cats.length; i++)
	{
		if (i == 6)
			console.log(' ');
		console.log(cats[i] + periods[i] + highs[cats[i]]['val'] + ' - ' + highs[cats[i]]['teams'].join('; '));
	}

	console.log('\n\nvar hist = {')
	for (i = 0; i < teams.length; i++)
	{
		histObj = hist[teams[i]];
		console.log('\t\t"' + teams[i] + '": {Wi: ' + histObj['Wi'] + ', L: ' + histObj['L'] + ', T: ' +
			histObj['T'] + ', WH: ' + histObj['WH'] + ', LH: ' + histObj['LH'] + ', TH: ' +
			histObj['TH'] + ', WP: ' + histObj['WP'] + ', LP: ' + histObj['LP'] + ', TP: ' +
			histObj['TP'] + ', p: "' + histObj['p'] + '"}' + (i == teams.length-1 ? '' : ','));
	}
	console.log('\t};');
}
