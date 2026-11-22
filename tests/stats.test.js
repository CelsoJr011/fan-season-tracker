import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  matchResult, summarize, recentForm, streaks, splitByVenue,
  cumulativePoints, projectPoints, biggestWin, fanMood, validateMatch,
} from '../js/stats.js';

// Small helper so each test reads like a list of scores.
let day = 1;
function game(score, extra = {}) {
  const [goalsFor, goalsAgainst] = score.split('-').map(Number);
  const date = `2026-03-${String(day++).padStart(2, '0')}`;
  return { club: 'ponte', date, competition: 'league', venue: 'home', opponent: 'Test FC', goalsFor, goalsAgainst, ...extra };
}

test('result comes from the goals', () => {
  assert.equal(matchResult(game('2-1')), 'W');
  assert.equal(matchResult(game('0-0')), 'D');
  assert.equal(matchResult(game('1-3')), 'L');
});

test('summary counts points, goals and clean sheets', () => {
  const s = summarize([game('2-0'), game('1-1'), game('0-2'), game('3-1')]);
  assert.equal(s.played, 4);
  assert.deepEqual([s.wins, s.draws, s.losses], [2, 1, 1]);
  assert.equal(s.points, 7);
  assert.equal(s.goalsFor, 6);
  assert.equal(s.goalsAgainst, 4);
  assert.equal(s.goalDiff, 2);
  assert.equal(s.cleanSheets, 1);
  assert.equal(s.pointsPct, 58.3); // 7 of 12
  assert.equal(s.pointsPerGame, 1.75);
});

test('empty season gives zeros, not NaN', () => {
  const s = summarize([]);
  assert.equal(s.pointsPct, 0);
  assert.equal(s.pointsPerGame, 0);
});

test('form is the last five, oldest to newest, even if data is out of order', () => {
  const games = [game('1-0'), game('0-1'), game('2-2'), game('3-0'), game('0-0'), game('1-2')];
  const shuffled = [games[5], games[0], games[3], games[1], games[4], games[2]];
  assert.deepEqual(recentForm(shuffled), ['L', 'D', 'W', 'D', 'L']);
});

test('streaks: longest unbeaten, longest winning run and current run', () => {
  const s = streaks([game('1-0'), game('2-0'), game('1-1'), game('3-2'), game('0-1'), game('1-1'), game('2-0')]);
  assert.equal(s.longestUnbeaten, 4);
  assert.equal(s.longestWins, 2);
  assert.deepEqual(s.current, { type: 'unbeaten', length: 2 });
});

test('after a loss the current run counts games without a win', () => {
  const s = streaks([game('2-0'), game('1-1'), game('0-0'), game('0-3')]);
  assert.deepEqual(s.current, { type: 'winless', length: 3 });
  assert.equal(streaks([]).current, null);
});

test('home and away are split', () => {
  const split = splitByVenue([game('2-0'), game('0-1', { venue: 'away' }), game('1-1', { venue: 'away' })]);
  assert.equal(split.home.points, 3);
  assert.equal(split.away.points, 1);
  assert.equal(split.away.played, 2);
});

test('cumulative points follow the date order', () => {
  const points = cumulativePoints([game('1-0'), game('0-0'), game('0-2'), game('2-1')]);
  assert.deepEqual(points.map((p) => p.points), [3, 4, 4, 7]);
  assert.equal(points.at(-1).match, 4);
});

test('projection keeps the current pace until round 38', () => {
  // 10 games, 15 points → 1.5 per game → 15 + 1.5 × 28 = 57
  const games = [];
  for (let i = 0; i < 5; i += 1) games.push(game('1-0'), game('0-1'));
  assert.equal(projectPoints(games), 57);
  assert.equal(projectPoints([]), null);
  assert.equal(projectPoints([game('1-0')], 1), 3);
});

test('biggest win: margin first, then goals scored', () => {
  const best = biggestWin([game('3-0'), game('1-1'), game('4-1'), game('2-0')]);
  assert.equal(`${best.goalsFor}-${best.goalsAgainst}`, '4-1');
  assert.equal(biggestWin([game('0-1')]), null);
});

test('fan mood follows the points percentage', () => {
  assert.equal(fanMood(0, 0), 'waiting');
  assert.equal(fanMood(75, 10), 'dreaming');
  assert.equal(fanMood(55, 10), 'confident');
  assert.equal(fanMood(40, 10), 'nervous');
  assert.equal(fanMood(20, 10), 'suffering');
});

test('validation catches the usual mistakes', () => {
  const today = new Date(2026, 4, 20);
  const ok = { club: 'ponte', date: '2026-05-10', competition: 'league', venue: 'home', opponent: 'Test FC', goalsFor: 2, goalsAgainst: 1 };

  assert.deepEqual(validateMatch(ok, [], today), []);
  assert.deepEqual(validateMatch({ ...ok, date: '2026-05-21' }, [], today), ['futureDate']);
  assert.deepEqual(validateMatch(ok, [ok], today), ['duplicateDate']);
  assert.deepEqual(validateMatch({ ...ok, club: 'barca' }, [ok], today), []); // other club, same day is fine
  assert.deepEqual(validateMatch({ ...ok, opponent: '   ' }, [], today), ['opponent']);
  assert.deepEqual(validateMatch({ ...ok, goalsFor: -1 }, [], today), ['goals']);
  assert.deepEqual(validateMatch({ ...ok, goalsAgainst: 1.5 }, [], today), ['goals']);
  assert.deepEqual(validateMatch({ ...ok, date: '' }, [], today), ['date']);
});

test('a match played today is accepted', () => {
  const today = new Date(2026, 4, 20, 22, 30); // late-night kickoff
  const match = { club: 'barca', date: '2026-05-20', competition: 'cup', venue: 'away', opponent: 'Test FC', goalsFor: 1, goalsAgainst: 0 };
  assert.deepEqual(validateMatch(match, [], today), []);
});
