import {
  CLUBS, matchResult, sortByDate, summarize, recentForm, streaks, splitByVenue,
  cumulativePoints, projectPoints, biggestWin, fanMood, validateMatch, matchId,
} from './stats.js';
import { buildSampleMatches } from './sample-data.js';
import { LANGUAGES, detectLanguage, translate, translateCount } from './i18n.js';
import { drawPointsChart } from './chart.js';

const STORAGE_KEY = 'fan-season-tracker:matches';

// Same order everywhere (tabs, legend, chart, comparison), so each club keeps
// its color no matter what is selected. Validated pair from a colorblind-safe
// palette — neutral on purpose, no club colors or crests.
const CLUB_COLORS = { ponte: '#2a78d6', barca: '#eb6834' };

let matches = loadMatches();
let lang = detectLanguage();
let club = 'ponte';
let competition = 'all';

const t = (key, params) => translate(lang, key, params);
const locale = () => LANGUAGES[lang].locale;
const clubName = (id) => t(`club.${id}`);

// --- persistence ---------------------------------------------------------

function loadMatches() {
  // localStorage can be blocked (private mode, some browsers), so the app
  // falls back to the sample data instead of breaking.
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Could not read saved matches, using sample data.', err);
  }
  return buildSampleMatches();
}

function saveMatches() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  } catch (err) {
    console.warn('Could not save matches.', err);
  }
}

// --- small helpers -------------------------------------------------------

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale(), { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatNumber(value, digits = 0) {
  return value.toLocaleString(locale(), { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

const signed = (n) => (n > 0 ? `+${n}` : String(n));

function matchesFor(clubId, comp = competition) {
  return matches.filter((m) => m.club === clubId && (comp === 'all' || m.competition === comp));
}

// The home team is written first, like on a scoreboard:
// "Ponte Preta 2–1 Vale Verde EC" at home, "Real Olivar 1–2 Barcelona" away.
function scoreline(match) {
  const us = escapeHtml(clubName(match.club));
  const them = escapeHtml(match.opponent);
  return match.venue === 'home'
    ? `${us} <strong class="nowrap">${match.goalsFor}–${match.goalsAgainst}</strong> ${them}`
    : `${them} <strong class="nowrap">${match.goalsAgainst}–${match.goalsFor}</strong> ${us}`;
}

function resultChip(result) {
  return `<span class="chip ${result}" title="${t(`result.${result}.long`)}">${t(`result.${result}`)}</span>`;
}

// --- static texts --------------------------------------------------------

function applyStaticTranslations() {
  document.documentElement.lang = locale();
  document.title = t('page.title');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });

  document.querySelectorAll('[data-club]').forEach((button) => {
    const active = button.dataset.club === club;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

// --- rendering -----------------------------------------------------------

function renderSummary() {
  const s = summarize(matchesFor(club));
  // The projection only makes sense for the league (38 rounds), so it always
  // uses league games, whatever the competition filter says.
  const projection = projectPoints(matchesFor(club, 'league'));

  const cards = [
    { label: t('summary.played'), value: s.played },
    { label: t('summary.record'), value: `${s.wins} · ${s.draws} · ${s.losses}` },
    { label: t('summary.points'), value: s.points, highlight: true },
    { label: t('summary.pointsPct'), value: `${formatNumber(s.pointsPct, 1)}%` },
    { label: t('summary.goals'), value: `${s.goalsFor} : ${s.goalsAgainst}` },
    { label: t('summary.goalDiff'), value: signed(s.goalDiff) },
    { label: t('summary.projection'), value: projection ?? '—', note: t('summary.projectionHint') },
  ];

  document.getElementById('summary').innerHTML = cards
    .map((c) => `
      <div class="card ${c.highlight ? 'highlight' : ''}">
        <div class="label">${c.label}</div>
        <div class="value">${c.value}</div>
        ${c.note ? `<div class="note">${c.note}</div>` : ''}
      </div>`)
    .join('');
}

function renderForm() {
  const list = matchesFor(club);
  const box = document.getElementById('form-box');

  if (list.length === 0) {
    box.innerHTML = `<p class="hint">${t('form.none')}</p>`;
    return;
  }

  const s = summarize(list);
  const run = streaks(list);
  const best = biggestWin(list);
  const runText = translateCount(lang, run.current.type === 'unbeaten' ? 'run.unbeaten' : 'run.winless', run.current.length);

  const rows = [
    [t('form.last5'), `<span class="chips">${recentForm(list).map(resultChip).join('')}</span>`],
    [t('form.current'), runText],
    [t('form.longestUnbeaten'), translateCount(lang, 'matches.count', run.longestUnbeaten)],
    [t('form.longestWins'), translateCount(lang, 'matches.count', run.longestWins)],
    [t('form.biggestWin'), best
      ? t('win.against', { score: `${best.goalsFor}–${best.goalsAgainst}`, opponent: escapeHtml(best.opponent) })
      : '—'],
  ];

  box.innerHTML = `
    <dl class="facts">
      ${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}
    </dl>
    <p class="mood"><strong>${t('form.mood')}</strong> ${t(`mood.${fanMood(s.pointsPct, s.played)}`)}</p>`;
}

function renderVenues() {
  const split = splitByVenue(matchesFor(club));
  document.getElementById('venue-rows').innerHTML = ['home', 'away']
    .map((venue) => {
      const s = split[venue];
      return `
        <tr>
          <th scope="row">${t(`venue.${venue}`)}</th>
          <td>${s.played}</td>
          <td class="nowrap">${s.wins} · ${s.draws} · ${s.losses}</td>
          <td>${s.points}</td>
          <td>${formatNumber(s.pointsPct, 1)}%</td>
        </tr>`;
    })
    .join('');
}

function renderChart() {
  const series = CLUBS.map((id) => ({
    id,
    name: clubName(id),
    color: CLUB_COLORS[id],
    points: cumulativePoints(matchesFor(id, 'league')),
  }));

  document.getElementById('chart-legend').innerHTML = series
    .map((s) => `<span class="legend-item"><span class="swatch" style="background:${s.color}"></span>${escapeHtml(s.name)}</span>`)
    .join('');

  drawPointsChart(document.getElementById('chart-box'), series, {
    matchLabel: t('chart.match'),
    pointsLabel: t('chart.points'),
    tooltipTitle: (n) => t('chart.tooltip', { n }),
    emptyText: t('chart.empty'),
    ariaLabel: t('chart.aria'),
  });

  // Same numbers as a table, for screen readers and for anyone who'd rather
  // read than hover.
  const longest = Math.max(0, ...series.map((s) => s.points.length));
  const rows = Array.from({ length: longest }, (_, i) => `
    <tr>
      <td>${i + 1}</td>
      ${series.map((s) => `<td>${s.points[i]?.points ?? '—'}</td>`).join('')}
    </tr>`).join('');

  document.getElementById('chart-table').innerHTML = `
    <table class="compact">
      <thead><tr><th>${t('chart.match')}</th>${series.map((s) => `<th>${escapeHtml(s.name)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderComparison() {
  const [a, b] = CLUBS.map((id) => summarize(matchesFor(id)));
  const perGame = (s, field) => (s.played ? s[field] / s.played : 0);

  // higherIsBetter = null means "just information, no winner" (games played
  // depends on the calendar, not on performance).
  const metrics = [
    { label: t('summary.played'), a: a.played, b: b.played, higherIsBetter: null },
    { label: t('summary.points'), a: a.points, b: b.points, higherIsBetter: null },
    { label: t('summary.pointsPct'), a: a.pointsPct, b: b.pointsPct, digits: 1, suffix: '%', higherIsBetter: true },
    { label: t('compare.pointsPerGame'), a: a.pointsPerGame, b: b.pointsPerGame, digits: 2, higherIsBetter: true },
    { label: t('compare.goalsPerGame'), a: perGame(a, 'goalsFor'), b: perGame(b, 'goalsFor'), digits: 2, higherIsBetter: true },
    { label: t('compare.concededPerGame'), a: perGame(a, 'goalsAgainst'), b: perGame(b, 'goalsAgainst'), digits: 2, higherIsBetter: false },
    { label: t('compare.cleanSheets'), a: a.cleanSheets, b: b.cleanSheets, higherIsBetter: null },
  ];

  const cell = (value, isBetter, m) => {
    const text = `${formatNumber(value, m.digits ?? 0)}${m.suffix ?? ''}`;
    return isBetter
      ? `<td class="better"><strong>${text}</strong> <span class="better-tag" title="${t('compare.better')}">▲ <span class="better-word">${t('compare.better')}</span></span></td>`
      : `<td>${text}</td>`;
  };

  const body = metrics
    .map((m) => {
      const noData = !a.played || !b.played;
      const aBetter = !noData && m.higherIsBetter !== null && (m.higherIsBetter ? m.a > m.b : m.a < m.b);
      const bBetter = !noData && m.higherIsBetter !== null && (m.higherIsBetter ? m.b > m.a : m.b < m.a);
      return `<tr><th scope="row">${m.label}</th>${cell(m.a, aBetter, m)}${cell(m.b, bBetter, m)}</tr>`;
    })
    .join('');

  document.getElementById('compare-table').innerHTML = `
    <thead>
      <tr>
        <th>${t('compare.metric')}</th>
        ${CLUBS.map((id) => `<th><span class="swatch" style="background:${CLUB_COLORS[id]}"></span>${escapeHtml(clubName(id))}</th>`).join('')}
      </tr>
    </thead>
    <tbody>${body}</tbody>`;
}

function renderMatchList() {
  document.getElementById('list-title').textContent = t('list.title', { club: clubName(club) });
  const tbody = document.getElementById('match-rows');

  // Newest first: when you open a diary you want the last game on top.
  const list = sortByDate(matchesFor(club)).reverse();

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">${t('list.empty')}</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map((match) => `
      <tr>
        <td class="nowrap">${formatDate(match.date)}</td>
        <td class="col-comp">${t(`comp.${match.competition}`)}</td>
        <td class="match-cell">${scoreline(match)}</td>
        <td>${resultChip(matchResult(match))}</td>
        <td>
          <button class="btn-small" type="button" data-delete="${escapeHtml(matchId(match))}"
            aria-label="${escapeHtml(t('list.deleteAria', { date: formatDate(match.date) }))}">
            <span class="btn-label">${t('list.delete')}</span><span class="btn-icon" aria-hidden="true">✕</span>
          </button>
        </td>
      </tr>`)
    .join('');
}

function renderAll() {
  applyStaticTranslations();
  renderSummary();
  renderForm();
  renderVenues();
  renderChart();
  renderComparison();
  renderMatchList();
}

// Messages are kept as "key + params" instead of final text, so switching
// language also translates a message that is already on screen.
let formMessage = null;
let listMessage = null;

// Club names and scorelines are rebuilt here, in the current language.
function messageParams(params = {}) {
  const filled = { ...params };
  if (params.clubId) filled.club = escapeHtml(clubName(params.clubId));
  if (params.match) filled.match = scoreline(params.match);
  return filled;
}

function renderMessages() {
  const formBox = document.getElementById('form-message');
  formBox.className = `form-message ${formMessage?.type ?? ''}`;
  formBox.innerHTML = formMessage
    ? formMessage.items.map(([key, params]) => `<p>${t(key, messageParams(params))}</p>`).join('')
    : '';

  const listBox = document.getElementById('list-message');
  listBox.className = `form-message ${listMessage ? 'success' : ''}`;
  listBox.textContent = listMessage ? t(listMessage) : '';
}

// --- events --------------------------------------------------------------

document.querySelectorAll('[data-club]').forEach((button) => {
  button.addEventListener('click', () => {
    club = button.dataset.club;
    // The form follows the selected tab — you're usually logging a game for
    // the club you're looking at.
    document.querySelector('#match-form [name="club"]').value = club;
    listMessage = null;
    renderAll();
    renderMessages();
  });
});

document.getElementById('competition-filter').addEventListener('change', (event) => {
  competition = event.target.value;
  renderAll();
});

document.getElementById('match-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));

  const match = {
    club: data.club,
    date: data.date,
    competition: data.competition,
    venue: data.venue,
    opponent: data.opponent.trim(),
    // Empty input → NaN → caught by the validation below.
    goalsFor: data.goalsFor === '' ? NaN : Number(data.goalsFor),
    goalsAgainst: data.goalsAgainst === '' ? NaN : Number(data.goalsAgainst),
  };

  const errors = validateMatch(match, matches);
  if (errors.length) {
    formMessage = { type: 'error', items: errors.map((code) => [`error.${code}`, { clubId: match.club }]) };
    renderMessages();
    return;
  }

  matches.push(match);
  saveMatches();

  // Show the club the game was saved for, otherwise it looks like nothing happened.
  club = match.club;
  renderAll();
  form.reset();
  form.elements.club.value = club;
  formMessage = { type: 'success', items: [['add.success', { match }]] };
  listMessage = null;
  renderMessages();
});

document.getElementById('match-rows').addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;

  matches = matches.filter((m) => matchId(m) !== button.dataset.delete);
  saveMatches();
  listMessage = 'list.deleted';
  renderAll();
  renderMessages();
});

document.getElementById('reset-data').addEventListener('click', () => {
  matches = buildSampleMatches();
  formMessage = null;
  listMessage = null;
  saveMatches();
  renderAll();
  renderMessages();
});

// The chart is drawn at the real width, so it has to be redrawn when the
// window changes size (or the phone rotates). Small delay to avoid redrawing
// on every pixel while the user drags the window.
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderChart, 150);
});

renderAll();
