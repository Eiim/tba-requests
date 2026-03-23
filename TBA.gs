// Begin Base Scripts
/**
 * Checks if a value is hexadecimal.
 *
 * @param {text} c The value to test.
 * @return TRUE/FALSE.
 * @customfunction
 */
function isHex(c) {
  try {
    if (/[0-9a-f]+/.exec(c.toLowerCase())[0].length === c.length) {
      return true 
    } return false
  }
  catch (err) {
    return false
  }
}
/**
 * Converts epoch (unix) time is seconds to GMT-style date object.
 *
 * @param {number} epoch The epoch time in seconds to convert.
 * @return GAS Date object or Sheets time/date object.
 * @customfunction
 */
function epochToGMTTime(epoch) {
  return new Date(epoch * 1000).toTimeString()
}
/**
 * Decodes a string containing \uxxxx, \\, and \” escapes
 * 
 * @param {text} input The input text.
 * @return The decoded string.
 * @customfunction
 */
function uniDecode(input) {
  var output = ""
  for (var i = 0; i < input.length; i++) {
    if (isHex(input.slice(i-3, i)) && input.charAt(i-4) === 'u' && input.charAt(i-5) === '\\') {
      output = output.slice(0, output.length-5)
      output += String.fromCharCode(parseInt(input.charAt(i-3)+input.charAt(i-2)+input.charAt(i-1)+input.charAt(i),16))
    } else {
    if (input.charAt(i-1) === '\\' && (input.charAt(i) === '\\' | input.charAt(i) === "\"")) {
      output = output.slice(0, output.length-1)
      output += input.charAt(i)
    } else {
    output += input.charAt(i)
      }
    }
  }
  return output
}
/**
 * Sets the TBA Read Authentication Key for the project. Needs to be obtained from https://www.thebluealliance.com/account. Tied to the spreadsheet. Required for all other TBA calls.
 *
 * @param {text} key The TBA key.
 * @return Success/failure statement.
 * @customfunction
 */
function TBASetKey(key) {
  try {
    var docProps = PropertiesService.getDocumentProperties()
    var key = docProps.setProperty('TBA Auth key', key)
  } catch (err) {
    throw new Error('Key creation failed')
  }
  return 'Key creation successful!'
}
/**
 * Retrieves the TBA Read Authentication Key for the spreadsheet as set in TBASetKey().
 * 
 * @return The TBA key set in TBASetKey()
 * @customfunction
 */
function TBAKey() {
  try {
    var docProps = PropertiesService.getDocumentProperties()
    var key = docProps.getProperty('TBA Auth key')
    if (key) {return key} else {throw new Error('Key retrieval failed')}
  } catch (err) {
    throw new Error('Key retrieval failed')
  }
}

/**
 * Handles the HTTPS request for TBA requests. Takes the path, such as team/frc1234/simple, and returns the resulting JSON object. Uses the key set in TBASetKey().
 * 
 * @param {text} path The part of the URL after "/api/v3/" in the query.
 * @return The body result of the query.
 * @customfunction
 */
function TBAQuery(path) {
  var url = 'https://www.thebluealliance.com/api/v3/'+path
  var headers = {
    'X-TBA-Auth-Key' : TBAKey()
  }
  var params = {
    'headers' : headers
  }
  var result = UrlFetchApp.fetch(url, params)
  return result.getContentText()
}
// End Base Scripts

// Begin Query Scripts
function TBATeamSimple(team) {
  if (!team) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('team/frc'+team+'/simple'))
}
function TBATeam(team) {
  if (!team) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('team/frc'+team))
}
function TBAStatus() {
  return JSON.parse(TBAQuery('status'))
}
function TBAMatch(match) {
  if (!match) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('match/'+match))
}
function TBATeamEventStatus(team, event) {
  if (!event && !team) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('team/frc'+team+'/event/'+event+'/status'))
}
function TBATeamEventMatches(team, event) {
  if (!event && !team) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('team/frc'+team+'/event/'+event+'/matches'))
}
function TBATeamEventMatchKeys(team, event) {
  if (!event && !team) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('team/frc'+team+'/event/'+event+'/matches/keys'))
}
function TBATeamSocial(team) {
  if (!team) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('team/frc'+team+'/social_media'))
}
function TBAEventMatchKeys(event) {
  if (!event) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('event/'+event+'/matches/keys'))
}
function TBAEventOPRs(event) {
  if (!event) {throw new Error("Undefined input")}
  return JSON.parse(TBAQuery('event/'+event+'/oprs'))
}
// End Query Scripts

//Begin Specific Scripts
/**
 * Returns a list of events for a year.
 * 
 * @param {number} year A year
 * @return A list of all event keys for that year.
 * @customfunction
 */
function TBAYearEvents(year) {
  return JSON.parse(TBAQuery("events/"+year+"/keys"))
}
/**
 * Returns the team name/nickname for the team number.
 * 
 * @param {number} team A team number.
 * @return The team nickname.
 * @customfunction
 */
function TBATeamName(team) {
  return uniDecode(TBATeamSimple(team)['nickname'])
}
/**
 * Returns the team full name/name for the team number.
 * 
 * @param {number} team A team number.
 * @return The team's full name
 * @customfunction
 */
function TBATeamNameFull(team) {
  try {
  return uniDecode(TBATeamSimple(team)['name'])
  } catch (err) {return ("There was an error retrieving the data.")}
}
/**
 * Returns the city the team number is located in.
 * 
 * @param {number} team A team number
 * @return The team's city
 * @customfunction
 */
function TBATeamCity(team) {
  try {
  return uniDecode(TBATeamSimple(team)['city'])
  } catch (err) {return ("There was an error retrieving the data.")}
}
/**
 * The state or province the team is located in.
 * 
 * @param {number} team A team number
 * @return The team's state/province
 * @customfunction
 */
function TBATeamState(team) {
  try {
  return uniDecode(TBATeamSimple(team)['state_prov'])
  } catch (err) {return ("There was an error retrieving the data.")}
}
/**
 * Returns the country the team number is located in.
 * 
 * @param {number} team A team number
 * @return  The team's country
 * @customfunction
 */
function TBATeamCountry(team) {
  try {
  return uniDecode(TBATeamSimple(team)['country'])
  } catch (err) {return ("There was an error retrieving the data.")}
}
/**
 * Returns the website of the team number.
 * 
 * @param {number} team A team number
 * @return 
 * @customfunction
 */
function TBATeamSite(team) {
  var s = TBATeam(team)['website']
  if (s) {return uniDecode(s)} else {return "No website found."}
}
/**
 * Returns the rookie year of the team
 * 
 * @param {number} team A team number
 * @return The rookie year
 * @customfunction
 */
function TBATeamRookie(team) {
  return JSON.parse(JSON.stringify(TBATeam(team)))['rookie_year']
}
/**
 * Returns the latest FRC season
 * 
 * @return A year, the latest FRC season.
 * @customfunction
 */
function TBAMaxSeason() {
  return JSON.parse(JSON.stringify(TBAStatus()))['max_season']
}
/**
 * Returns a team’s ranking in qualifications at a given event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @return A number representing the team's qualification ranking at the event.
 * @customfunction
 */
function TBATeamEventQualRank(team, event) {
  try {
    rank = TBATeamEventStatus(team, event)['qual']['ranking']['rank']
    if(rank) {
      return rank
    }
    throw new Error('This event does not have qual rankings.')
  }
  catch (err) {
    throw new Error('Team was not at competition or there were no qual rankings.')
  }
}
/**
 * Returns the keys for each event the team attended in that year.
 * 
 * @param {number} team A team number
 * @param {number} year A year
 * @param {boolean} opt_official Optionally fetch only official events
 * @return An 1-by-x array of event keys
 * @customfunction
 */
function TBATeamYearEvents(team, year, opt_official) {
  var eventKeys = JSON.parse(TBAQuery('team/frc'+team+'/events/'+year+'/keys'))
  if (opt_official) {
    var eventData = JSON.parse(TBAQuery('team/frc'+team+'/events/'+year))
    eventData.forEach(function(event) {
        if (event['event_type'] === 99){
          eventKeys.splice(eventKeys.indexOf(event['key']), 1)
        }
    })
  }

  return eventKeys
}
/**
 * Returns the color of the winning alliance for the match.
 * 
 * @param {text} match A match key
 * @return "red" or "blue"
 * @customfunction
 */
function TBAMatchWinner(match) {
  var a = TBAMatch(match)['winning_alliance']
  if(a === "") {
    return "tie"
  } else  {
    return a
  }
}
/**
 * Lists each winner in a given match.
 * 
 * @param {text} match A match key
 * @return An 1-by-x array of team numbers
 * @customfunction
 */
function TBAMatchWinners(match) {
  var m = TBAMatch(match)
  var a = m['winning_alliance']
  if(a === "") {
    return ""
  }
  var x = m['alliances'][a]['team_keys']
  for (var i = 0; i < x.length; i++) {
    x[i] = x[i].substring(3)
  }
  return x
}
/**
 * Returns if a team won the match or not.
 * 
 * @param {number} team A team number
 * @param {text} match A match key
 * @return A boolean (true/false)
 * @customfunction
 */
function TBATeamMatchWin(team, match) {
  var x = TBAMatchWinners(match)
  for (i in x) {
    if (x[i].toString() === team.toString()) {return true}
  }
  return false
}
/**
 * Returns if a team won their xth match (sorted by keys in alphabetical order, not order of competition) at an event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @param {number} matchnum The number of the key in alpha order for a team's matches at an event.
 * @return A boolean (true/false)
 * @customfunction
 */
function TBATeamEventMatchnumWin(team,event,matchnum) {
  var x = JSON.stringify(TBATeamEventMatchKeys(team, event)[matchnum-1])
  x = x.substring(1,x.length-1)
  var y = TBAMatchWinners(x)
  var t = ""
  for (var i in y) {
    if (y[i].toString() === team.toString()) {return true}
  }
  return false
}
/**
 * Returns the color of a team in a certain match.
 * 
 * @param {text} match A match key
 * @param {number} team A team number
 * @return A color (red/blue)
 * @customfunction
 */
function TBAMatchTeamColor(match, team) {
  var m = TBAMatch(match)
  var r = m["alliances"]["red"]["team_keys"]
  var b = m["alliances"]["blue"]["team_keys"]
  for (var ri in r) {
    if (r[ri].toString() === ("frc"+team.toString())) {return "red"}
  }
  for (var bi in b) {
    if (b[bi].toString() === ("frc"+team.toString())) {return "blue"}
  }
  throw new Error('Team was not at the match')
}
/**
 * Returns the teams of an alliance at a match given their color.
 * 
 * @param {text} match A match key
 * @param {text} color A color (red/blue)
 * @return A list of the three teams of the chosen alliance at the match.
 * @customfunction
 */
function TBAMatchAllianceTeams(match, color) {
  var teams = TBAMatch(match)['alliances'][color]['team_keys']
  for (var i = 0; i < teams.length; i++) {
    teams[i] = teams[i].substring(3)
  }
  return teams
}
/**
 * Returns the score of an alliance at a match given their color.
 * 
 * @param {text} match A match key
 * @param {text} color A color (red/blue)
 * @return A number representing the score
 * @customfunction
 */
function TBAMatchAllianceScore(match, color) {
  var m = TBAMatch(match)
  var year = parseInt(match.substr(0,4))
  if(year >= 2000 && year < 2015) {
    return m['alliances'][color]['score']
  } else if(year == 2015) {
    return m['score_breakdown'][color]['total_points']
  } else if(year >= 2016 && year <= 2026) {
    return m['score_breakdown'][color]['totalPoints']
  } else {
    throw new Error('Score not supported for this year')
  }
}
/**
 * Returns the ranking points an alliance earned at a match given their color.
 * 
 * @param {text} match A match key
 * @param {text} color A color (red/blue)
 * @return The number of ranking points earned by the alliance
 * @customfunction
 */
function TBAMatchAllianceRP(match, color) {
  var m = TBAMatch(match)
  var year = parseInt(match.substr(0,4))
  if(year >= 2016 && year <= 2017) {
    return m['score_breakdown'][color]['tba_rpEarned']
  } else if(year >= 2018 && year <= 2026) {
    return m['score_breakdown'][color]['rp']
  } else {
    throw new Error('RP not supported for this year')
  }
}
/**
 * Returns the time of a match in unix epoch time.
 * 
 * @param {text} match A match key
 * @return A unix epoch time in seconds
 * @customfunction
 */
function TBAMatchTime(match) {
  return TBAMatch(match)['post_result_time']
}
/**
 * Returns the Twitter handle of the team, if available.
 * 
 * @param {number} team A taem number
 * @return A twitter handle
 * @customfunction
 */
function TBATeamTwitter(team) {
  var json = TBATeamSocial(team)
  var i = 0;
  for (var ix in json) {
    if (json[i]['type'] === "twitter-profile") {
      var t = JSON.stringify(json[i]['foreign_key'])
      return t.slice(1, t.length-1)
    }
    i++
  }
  return "No Twitter Profile Found."
}
/**
 * Returns the Facebook username of the team, if available.
 * 
 * @param {number} team A team number
 * @return A Facebook username
 * @customfunction
 */
function TBATeamFacebook(team) {
  var json = TBATeamSocial(team)
  var i = 0;
  for (var ix in json) {
    if (json[i]['type'] === "facebook-profile") {
      var t = JSON.stringify(json[i]['foreign_key'])
      return t.slice(1, t.length-1)
    }
    i++
  }
  return "No Facebook Profile Found."
}
/**
 * Returns the Github username of the team, if available.
 * 
 * @param {number} team A team number
 * @return A Github username
 * @customfunction
 */
function TBATeamGithub(team) {
  var json = TBATeamSocial(team)
  var i = 0;
  for (var ix in json) {
    if (json[i]['type'] === "github-profile") {
      var t = JSON.stringify(json[i]['foreign_key'])
      return t.slice(1, t.length-1)
    }
    i++
  }
  return "No Github Profile Found."
}
/**
 * Returns the Instagram username of the team, if available.
 * 
 * @param {number} team A team number
 * @return An Instagram username
 * @customfunction
 */
function TBATeamInstagram(team) {
  var json = TBATeamSocial(team)
  var i = 0;
  for (var ix in json) {
    if (json[i]['type'] === "instagram-profile") {
      var t = JSON.stringify(json[i]['foreign_key'])
      return t.slice(1, t.length-1)
    }
    i++
  }
  return "No Instagram Profile Found."
}
/**
 * Returns the Youtube channel of the team, if available.
 * 
 * @param {number} team A team number
 * @return A Youtube channel
 * @customfunction
 */
function TBATeamYoutube(team) {
  var json = TBATeamSocial(team)
  var i = 0;
  for (var ix in json) {
    if (json[i]['type'] === "youtube-channel") {
      var t = JSON.stringify(json[i]['foreign_key'])
      return t.slice(1, t.length-1)
    }
    i++
  }
  return "No Youtube Channel Found."
}
/**
 * Returns the Periscope username of the team, if available.
 * 
 * @param {number} team A team number
 * @return A Periscope username
 * @customfunction
 */
function TBATeamPeriscope(team) {
  var json = TBATeamSocial(team)
  var i = 0;
  for (var ix in json) {
    if (json[i]['type'] === "periscope-profile") {
      var t = JSON.stringify(json[i]['foreign_key'])
      return t.slice(1, t.length-1)
    }
    i++
  }
  return "No Periscope Channel Found."
}
/**
 * Returns the OPR of a team at an event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @return An OPR number
 * @customfunction
 */
function TBATeamEventOPR(team, event) {
  return TBAEventOPRs(event)["oprs"]["frc"+team]
}
/**
 * Returns the DPR of a team at an event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @return A DPR number
 * @customfunction
 */
function TBATeamEventDPR(team, event) {
  return TBAEventOPRs(event)["dprs"]["frc"+team]
}
/**
 * Returns the CCWM of a team at an event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @return A CCWM number
 * @customfunction
 */
function TBATeamEventCCWM(team, event) {
  return TBAEventOPRs(event)["ccwms"]["frc"+team]
}
/**
 * Lists the teams at an event.
 * 
 * @param {text} event An event key
 * @return An 1-by-x array of team numbers
 * @customfunction
 */
function TBAEventTeams(event) {
  var x = JSON.parse(TBAQuery("event/"+event+"/teams/keys"))
  for (var i = 0; i < x.length; i++) {
    x[i] = x[i].substring(3)
  }
  return x
}
/**
 * Returns the number of wins a team had in qualification matches at the given event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @return A number of wins in qual matches.
 * @customfunction
 */
function TBATeamEventQualWins(team, event) {
  return TBATeamEventStatus(team, event)['qual']['ranking']['record']['wins']
}
/**
 * Returns the number of losses a team had in qualification matches at the given event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @return A number of losses in qual matches.
 * @customfunction
 */
function TBATeamEventQualLosses(team, event) {
  return TBATeamEventStatus(team, event)['qual']['ranking']['record']['losses']
}
/**
 * Returns the number of ties a team had in qualification matches at the given event.
 * 
 * @param {number} team A team number
 * @param {text} event An event key
 * @return A number of ties in qual matches
 * @customfunction
 */
function TBATeamEventQualTies(team, event) {
  return TBATeamEventStatus(team, event)['qual']['ranking']['record']['ties']
}
// End Specific Scripts

// Begin Custom Scripts
/**
 * Used for finding custom information about a match.
 * 
 * @param {text} match A match key
 * @param {text} nav The navigation path through the JSON. Can be of arbitrary length, each item is a sub-level.
 * @return Whatever the nav path leads to.
 * @customfunction
 */
function TBAMatchCustom(match, nav) {
  var args = Array.prototype.slice.call(arguments, 1);
  var json = TBAMatch(match)
  var t = ""
  for (var a in args) {
    json = json[args[a]]
  }
  if(typeof json === "object") {
    return JSON.stringify(json)
  } else {
    return json
  }
}
/**
 * Much like TBAMatchCustom(), however, this can point to an arbitrary TBA API v3 destination.
 * 
 * @param {text} query The query path after "/api/v3/" in the JSON URL.
 * @param {text} nav The navigation path through the JSON. Can be of arbitrary length, each item is a sub-level.
 * @return Whatever the nav path leads to.
 * @customfunction
 */
function TBACustom(query, nav) {
  var json = JSON.parse(TBAQuery(query))
  var args = Array.prototype.slice.call(arguments, 1);
  for (var a in args) {
    json = json[args[a]]
  }
  if(typeof json === "object") {
    return JSON.stringify(json)
  } else {
    return json
  }
}
// End Custom Scripts
