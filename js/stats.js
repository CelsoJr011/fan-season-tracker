// Season stats for a fan's match diary.
// No DOM code in here on purpose: the same functions run in the browser and
// in the Node tests (npm test).

// Standard league scoring since the 90s: 3 for a win, 1 for a draw.
export const POINTS = { W: 3, D: 1, L: 0 };

// Both Série B and La Liga have 20 teams playing each other twice = 38 rounds.
// Used only for the projection, so it lives here as a default.
export const SEASON_LENGTH = 38;

export const CLUBS = ['ponte', 'barca'];
export const COMPETITIONS = ['league', 'cup'];
export const VENUES = ['home', 'away'];

const MAX_GOALS = 30;
const MAX_OPPONENT_LENGTH = 40;

// "2026-05-10" is parsed by JS as midnight UTC, which in Brazil (UTC-3) is
// still May 9th. Same trap I hit in fefo-pharma-stock, same fix: read
// date-only strings as local dates.
function toLocalDate(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

function startOfDay(value) {
  const d = toLocalDate(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function matchResult(match) {
  if (match.goalsFor > match.goalsAgainst) return 'W';
  if (match.goalsFor < match.goalsAgainst) return 'L';
  return 'D';
}

// Oldest first. Array.sort is stable, so two matches on the same date (it
// shouldn't happen, but old saved data might have it) keep their order.
export function sortByDate(matches) {
  return [...matches].sort((a, b) => startOfDay(a.date) - startOfDay(b.date));
}

const round1 = (n) => Math.round(n * 10) / 10;
const round2 = (n) => Math.round(n * 100) / 100;

export function summarize(matches) {
  const s = {
    played: matches.length,
    wins: 0, draws: 0, losses: 0,
    points: 0,
    goalsFor: 0, goalsAgainst: 0,
    cleanSheets: 0,
  };

  for (const match of matches) {
    const result = matchResult(match);
    if (result === 'W') s.wins += 1;
    else if (result === 'D') s.draws += 1;
    else s.losses += 1;

    s.points += POINTS[result];
    s.goalsFor += match.goalsFor;
    s.goalsAgainst += match.goalsAgainst;
    if (match.goalsAgainst === 0) s.cleanSheets += 1;
  }

  s.goalDiff = s.goalsFor - s.goalsAgainst;

  // "Aproveitamento" — the number every Brazilian commentator quotes: points
  // won out of the points that were available. No matches = 0, not NaN.
  s.pointsPct = s.played ? round1((s.points / (s.played * 3)) * 100) : 0;
  s.pointsPerGame = s.played ? round2(s.points / s.played) : 0;

  return s;
}

// Last n results, oldest → newest, the same way TV graphics show it.
export function recentForm(matches, n = 5) {
  return sortByDate(matches).slice(-n).map(matchResult);
}

export function streaks(matches) {
  const results = sortByDate(matches).map(matchResult);

  let longestUnbeaten = 0;
  let longestWins = 0;
  let unbeaten = 0;
  let wins = 0;

  for (const result of results) {
    unbeaten = result === 'L' ? 0 : unbeaten + 1;
    wins = result === 'W' ? wins + 1 : 0;
    longestUnbeaten = Math.max(longestUnbeaten, unbeaten);
    longestWins = Math.max(longestWins, wins);
  }

  // The current run is told the way fans tell it: "unbeaten in 4" or
  // "4 without a win". After a draw both are true — I went with the
  // optimistic one, because that's what a fan would say.
  let current = null;
  if (results.length) {
    const lastIsLoss = results.at(-1) === 'L';
    const breaksRun = lastIsLoss ? (r) => r === 'W' : (r) => r === 'L';
    let length = 0;
    for (let i = results.length - 1; i >= 0 && !breaksRun(results[i]); i -= 1) length += 1;
    current = { type: lastIsLoss ? 'winless' : 'unbeaten', length };
  }

  return { longestUnbeaten, longestWins, current };
}

export function splitByVenue(matches) {
  return {
    home: summarize(matches.filter((m) => m.venue === 'home')),
    away: summarize(matches.filter((m) => m.venue === 'away')),
  };
}

// Running total of points after each match — the data behind the chart.
export function cumulativePoints(matches) {
  let total = 0;
  return sortByDate(matches).map((match, index) => {
    total += POINTS[matchResult(match)];
    return { match: index + 1, points: total };
  });
}

// Points so far + current points-per-game for the rounds still to play.
// Crude on purpose: it ignores the fixture list, and that's the point — it
// answers "if we keep this pace, where do we finish?".
export function projectPoints(leagueMatches, seasonLength = SEASON_LENGTH) {
  const { played, points } = summarize(leagueMatches);
  if (played === 0) return null;
  if (played >= seasonLength) return points;
  return Math.round(points + (points / played) * (seasonLength - played));
}

// Biggest margin wins. A tie on margin goes to the one with more goals
// (a 4–1 is remembered longer than a 3–0), then to the earliest.
export function biggestWin(matches) {
  let best = null;
  for (const match of sortByDate(matches)) {
    if (matchResult(match) !== 'W') continue;
    const margin = match.goalsFor - match.goalsAgainst;
    const bestMargin = best ? best.goalsFor - best.goalsAgainst : -1;
    if (margin > bestMargin || (margin === bestMargin && match.goalsFor > best.goalsFor)) {
      best = match;
    }
  }
  return best;
}

// A bit of fan humor on top of the numbers. Thresholds are mine, not science.
export function fanMood(pointsPct, played) {
  if (!played) return 'waiting';
  if (pointsPct >= 70) return 'dreaming';
  if (pointsPct >= 50) return 'confident';
  if (pointsPct >= 35) return 'nervous';
  return 'suffering';
}

// Returns a list of error codes (empty = valid). Codes instead of sentences so
// the screen can show them in any language.
export function validateMatch(input, existing = [], today = new Date()) {
  const errors = [];

  if (!CLUBS.includes(input.club)) errors.push('club');
  if (!COMPETITIONS.includes(input.competition)) errors.push('competition');
  if (!VENUES.includes(input.venue)) errors.push('venue');

  if (!input.date || Number.isNaN(toLocalDate(input.date).getTime())) {
    errors.push('date');
  } else if (startOfDay(input.date) > startOfDay(today)) {
    // It's a diary of games already played. Future fixtures would mess up
    // the form and the projection.
    errors.push('futureDate');
  } else if (existing.some((m) => m.club === input.club && m.date === input.date)) {
    // A team doesn't play twice on the same day. This also keeps
    // club + date usable as the match id.
    errors.push('duplicateDate');
  }

  const opponent = (input.opponent ?? '').trim();
  if (!opponent) errors.push('opponent');
  else if (opponent.length > MAX_OPPONENT_LENGTH) errors.push('opponentLength');

  for (const field of ['goalsFor', 'goalsAgainst']) {
    const goals = input[field];
    if (!Number.isInteger(goals) || goals < 0 || goals > MAX_GOALS) {
      errors.push('goals');
      break;
    }
  }

  return errors;
}

export function matchId(match) {
  return `${match.club}-${match.date}`;
}
