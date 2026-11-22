// Every text on the screen lives here, so adding a language later is just
// adding a dictionary. Keys are grouped by screen area.

export const LANGUAGES = {
  en: { label: 'EN', locale: 'en-US', name: 'English' },
};

const STORAGE_KEY = 'fan-season-tracker:lang';

const messages = {
  en: {
    'page.title': 'Fan Season Tracker — Ponte Preta & Barcelona',
    'header.subtitle': "A fan's match diary: points, form and streaks for Ponte Preta and Barcelona",
    'header.reset': 'Reset sample data',
    'header.language': 'Language',

    'club.label': 'Club',
    'club.ponte': 'Ponte Preta',
    'club.barca': 'Barcelona',
    'filter.competition': 'Competition',
    'filter.all': 'All competitions',
    'comp.league': 'League',
    'comp.cup': 'Cup',

    'summary.label': 'Season summary',
    'summary.played': 'Played',
    'summary.record': 'W · D · L',
    'summary.points': 'Points',
    'summary.pointsPct': '% of points won',
    'summary.goals': 'Goals (for : against)',
    'summary.goalDiff': 'Goal difference',
    'summary.projection': 'Projected league points',
    'summary.projectionHint': 'at this pace, over 38 rounds',

    'form.title': 'Form & streaks',
    'form.last5': 'Last 5',
    'form.current': 'Current run',
    'form.longestUnbeaten': 'Longest unbeaten run',
    'form.longestWins': 'Longest winning run',
    'form.biggestWin': 'Biggest win',
    'form.none': 'No matches yet.',
    'form.mood': 'Fan mood:',

    'run.unbeaten': '{n} matches unbeaten',
    'run.unbeatenOne': '{n} match unbeaten',
    'run.winless': '{n} matches without a win',
    'run.winlessOne': '{n} match without a win',
    'matches.count': '{n} matches',
    'matches.countOne': '{n} match',
    'win.against': '{score} vs {opponent}',

    'mood.waiting': "Season hasn't started. Pure hope.",
    'mood.dreaming': 'Dreaming big. Nobody say anything. 🤫',
    'mood.confident': 'Confident, but still checking the table every day.',
    'mood.nervous': 'Nervous. Every match feels like a final.',
    'mood.suffering': "Suffering — but a real fan doesn't quit.",

    'result.W': 'W',
    'result.D': 'D',
    'result.L': 'L',
    'result.W.long': 'Win',
    'result.D.long': 'Draw',
    'result.L.long': 'Loss',

    'venue.title': 'Home vs away',
    'venue.home': 'Home',
    'venue.away': 'Away',

    'compare.title': 'Side by side',
    'compare.hint': "Same competition filter as above. They play in different leagues, so this compares pace — not who would win a match.",
    'compare.metric': 'Metric',
    'compare.pointsPerGame': 'Points per game',
    'compare.goalsPerGame': 'Goals scored per game',
    'compare.concededPerGame': 'Goals conceded per game',
    'compare.cleanSheets': 'Clean sheets',
    'compare.better': 'better',

    'chart.title': 'League points race',
    'chart.hint': 'Accumulated league points after each match. Hover or tap the chart to see the numbers.',
    'chart.match': 'Match',
    'chart.points': 'Points',
    'chart.tooltip': 'Match {n}',
    'chart.table': 'Show as table',
    'chart.empty': 'No league matches yet.',
    'chart.aria': 'Line chart of accumulated league points per match for both clubs',

    'list.title': 'Matches — {club}',
    'list.date': 'Date',
    'list.competition': 'Competition',
    'list.match': 'Match',
    'list.result': 'Result',
    'list.delete': 'Delete',
    'list.deleteAria': 'Delete the match on {date}',
    'list.empty': 'No matches for this filter.',
    'list.deleted': 'Match deleted.',

    'add.title': 'Add a match',
    'add.club': 'Club',
    'add.date': 'Date',
    'add.competition': 'Competition',
    'add.venue': 'Venue',
    'add.opponent': 'Opponent',
    'add.opponentPlaceholder': 'e.g. Real Olivar',
    'add.goalsFor': 'Goals for',
    'add.goalsAgainst': 'Goals against',
    'add.submit': 'Save match',
    'add.success': 'Saved: {match}.',

    'error.club': 'Pick one of the two clubs.',
    'error.competition': 'Pick a competition.',
    'error.venue': 'Pick home or away.',
    'error.date': 'Pick a valid date.',
    'error.futureDate': "That date hasn't happened yet — this is a diary of matches already played.",
    'error.duplicateDate': '{club} already has a match on this date.',
    'error.opponent': "Type the opponent's name.",
    'error.opponentLength': 'Opponent name is too long (40 characters max).',
    'error.goals': 'Goals must be whole numbers between 0 and 30.',

    'footer.text': 'Fictional results, built for study. No official crests or logos. Made by',
  },
};

export function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && messages[saved]) return saved;
  } catch {
    // storage blocked — just fall through to the browser language
  }
  const browser = (globalThis.navigator?.language || 'en').slice(0, 2).toLowerCase();
  return messages[browser] ? browser : 'en';
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // not a big deal: the choice just won't be remembered next time
  }
}

// Looks up a key and fills {placeholders}. Falls back to English, and then to
// the key itself, so a missing translation shows up on screen instead of crashing.
export function translate(lang, key, params = {}) {
  const text = messages[lang]?.[key] ?? messages.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => (name in params ? params[name] : `{${name}}`));
}

// Singular or plural. French treats 0 as singular ("0 match"), English and
// Portuguese don't ("0 matches", "0 jogos") — small thing, but it reads wrong
// otherwise.
export function translateCount(lang, key, n) {
  const singular = n === 1 || (lang === 'fr' && n === 0);
  return translate(lang, singular ? `${key}One` : key, { n });
}

// Exported only for the tests, to make sure no language is missing a key.
export function allKeys(lang) {
  return Object.keys(messages[lang] ?? {});
}
