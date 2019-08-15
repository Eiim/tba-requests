# Help for TBA Requests

##### Thank you for using TBA Requests! TBA Requests adds function calls into Google Sheets for accessing data from The Blue Alliance. If you have further questions, keep reading below:

Adding TBA Requests to your Google spreadsheet is easy! Within your spreadsheet, click on “Add-ons”, then “Get Add-ons”, and search for TBA Requests from there. Once it is added to your spreadsheet, you will need to set up a Read API Key from The Blue Alliance. You will need to log in to thebluealliance.com and then go to your account page to get a key. Then, just run TBASetKey(key), replacing “key” in the function with your new Read API Key in any cell in your spreadsheet. After that, you’re good to go! Note that in each new spreadsheet document you will need to set the key again, but this is a one-time procedure per spreadsheet. You can overwrite the key by running TBASetKey(key) again, or find what key you are using with TBAKey().

With this done, you’re able to unlock the power of The Blue Alliance data from directly within your spreadsheet! Available functions retrieve match results, team information, and much more automatically. For an example of a spreadsheet using every Specific and Custom function in the add-on, visit the example spreadsheet.

TBA Requests is open source, so you can suggest changes on the GitHub repository. The repository is also the destination for any bugs you encounter via the bug tracker. 

Note: None of the data is mine. All data comes directly from The Blue Alliance. If any data is incorrect or missing, report it to them. If, however, any data from their site is not available here that you would like available, open an issue on GitHub and I’ll be glad to address it!
### Default formats
Many functions reference their parameters as “team”, “event”, “alliance”, or “match”. For these, use the following key definitions below.
* Team keys are defined by their number. In TBA, this number has “frc” appended to it, such as frc4611. This script uses just the number and appends and removes “frc” as needed.
* Event keys are defined by appending the year to their shortcode. For example, the 2016 Buckeye Regional is 2016ohcl.
* Alliances in a match are referred to their color in lowercase, i.e, “red” or “blue”.
* Qualification match keys are given by their event code, “_qm”, and their number, in keeping with TBA standards. For example, qualifying match #32 at the 2016 Buckeye Regional is 2016ohcl_qm32.
* Quarterfinal, Semifinal, and Finals match keys are defined with their event code, “_qf”, “_sf”, or “_f” respectively, the set number, “m”, and the match number. For example, match 2 of set 1 of the quarterfinals at the 2016 Buckeye Regional is 2016ohcl_qf1m2.
Functions
Below is a list of all functions, grouped by type. Most of the functions which will be of use for the end user fall under “Specific” and “Custom.” “Base” and “Query” can also be used from the spreadsheet, but are designed as helper functions for the Specific and Custom functions.
### Base Functions
* TBAsandbox(): Used for development/testing purposes
* isHex(input): Checks if a string/char input is hexadecimal
* epochToGMTTime(epoch): Returns a Time object from a given epoch time in seconds
* TBASetKey(key): Sets the TBA Read Authentication Key for the project. Needs to be obtained from https://www.thebluealliance.com/account. Tied to the spreadsheet. Required for all other TBA calls.
* TBAKey(): Retrieves the TBA Read Authentication Key for the spreadsheet as set in TBASetKey().
* uniDecode(input): Decodes a string containing \uxxxx, \\, and \” escapes
* TBAQuery(path): Handles the HTTPS request for TBA requests. Takes the path, such as team/frc1234/simple, and returns the resulting JSON object. Uses the key set in TBASetKey().
### Query Functions
* TBATeamSimple(team): Returns the simple JSON about a team from their key.
* TBATeam(team): Returns the detailed JSON about a team from their key.
* TBAStatus(): Returns the TBA status page JSON.
* TBAMatch(match): Returns JSON for a match key.
* TBATeamEventStatus(team, event): Pulls up the live status data for a team at an event.
* TBATeamEventMatches(team, event): Returns a list of matches, with match data, for a team at a specific event.
* TBATeamEventMatchKeys(team, event): Returns a list of match keys which a team competed in at a specific event.
* TBATeamSocial(team): Returns the JSON data for the social media of a given team.
* TBAEventMatchKeys(event): Returns a list of match keys for a given event.
* TBAEventOPRs(event): Returns CCWMs, DPRs, and OPRs for an event.
### Specific Functions
* TBAYearEvents(year): Returns a list of event keys for a given year.
* TBATeamName(team): Returns the team name/nickname for the team number.
* TBATeamNameFull(team): Returns the team full name/name for the team number.
* TBATeamCity(team): Returns the city the team number is located in.
* TBATeamState(team): Returns the state or province the team number is located in.
* TBATeamCountry(team): Returns the country the team number is located in.
* TBATeamSite(team): Returns the website of the team number.
* TBATeamRookie(team): Returns the rookie year of the team.
* TBATeamChampionship(team): Returns the team number’s championship location.
* TBATeamChampionshipOld(team): Returns the team number’s pre-2018 championship.
* TBAMaxSeason(): Returns the latest FRC season.
* TBATeamEventQualRank(team, event): Returns a team’s ranking in qualifications at a given event.
* TBATeamYearEvents(team, year): Returns the keys for each event the team attended in that year.
* TBAMatchWinner(match): Returns the color of the winning alliance for the match.
* TBAMatchWinners(match): Lists each winner in a given match.
* TBATeamMatchWin(team, match): Returns if a team won the match or not.
* TBATeamEventMatchnumWin(team, event, matchnum): Returns if a team won their xth match (sorted by keys in alphabetical order, not order of competition) at an event. For example, TBATeamEventMatchnumWin(4611, 2018ohmv, 2) returns true because 4611 won their second match at 2018ohmv when sorted by alphabetical order (which turns out to be 2018ohmv_qm12)
* TBAMatchTeamColor(match, team): Returns the color of a team in a certain match.
* TBAMatchAllianceScore(match, alliance): Returns the score of an alliance at a match given their color. Only works in supported years (2015-2018). Make a GitHub issue, or better yet, a merge  request, if this needs updated.
* TBAMatchAllianceRP(match, alliance): Returns the ranking points an alliance earned at a match given their color. Only works in supported years (2016-2018). Make a GitHub issue, or better yet, a merge request, if this needs updated.
* TBAMatchTime(match): Returns the time of a match in unix epoch time.
* TBATeamTwitter(team): Returns the Twitter handle of the team, if available.
* TBATeamFacebook(team): Returns the Facebook username of the team, if available.
* TBATeamGithub(team): Returns the Github username of the team, if available.
* TBATeamInstagram(team): Returns the Instagram username of the team, if available.
* TBATeamYoutube(team): Returns the Youtube channel of the team, if available.
* TBATeamPeriscope(team): Returns the Periscope username of the team, if available.
* TBATeamEventOPR(team, event): Returns the OPR of a team at an event.
* TBATeamEventDPR(team, event): Returns the DPR of a team at an event.
* TBATeamEventCCWM(team, event): Returns the CCWM of a team an an event.
* TBAEventTeams(event): Lists the teams at an event.
* TBATeamEventQualWins(team, event): Returns the number of wins a team had in qualification matches at the given event.
* TBATeamEventQualLosses(team, event): Returns the number of losses a team had in qualification matches at the given event.
* TBATeamEventQualTies(team, event): Returns the number of ties a team had in qualification matches at the given event.
Custom
* TBAMatchCustom(match, nav): Used for finding custom information about a match. The nav argument can be of arbitrary length, which defines the navigation path through the JSON to take. You will have to look at some example JSON from the desired year to figure this out. For example, to find out if the red alliance got the ranking point from “Facing the Boss,” one might look at https://www.thebluealliance.com/api/v3/match/2018ohmv_qm1 to find out to use the function TBAMatchCustom(match, “score_breakdown”, “blue”, “faceTheBossRankingPoint”)
* TBACustom(query, nav): Much like the previous, however, this can point to an arbitrary TBA API v3 destination. The query is the path of the JSON after “/api/v3/”. For example, to reach the destination “https://www.thebluealliance.com/api/v3/event/2018ohmv/awards”, one would use “event/2018ohmv/awards/” as the query argument. The nav argument works as before.

### Final Notes
Hello! I’m Ethan Chapman, a CAD and Scouting-focused student from FRC Team 4611, O-Zone. This was originally created as a 4-H project. I learned that many teams used Google Forms for their scouting and put the data into a Google Sheet. However, there was no easy way to add data from The Blue Alliance into these sheets. From manually adding data such as OPRs, I realized that there should be an easier way, given the incredible ecosystem of FRC tools available online. Hopefully this is a contribution to it.

Any issues or suggestions should be sent to the GitHub repo, where I’m more likely to see them. If you want to talk about FRC otherwise, though, I’m on Chief Delphi as Eiim, although I rarely check it. Thank you!
