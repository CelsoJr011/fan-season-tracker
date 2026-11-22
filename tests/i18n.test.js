import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, translate, translateCount, allKeys } from '../js/i18n.js';

// If I add a text in English and forget PT or FR, this test catches it.
test('every language has the same keys as English', () => {
  const english = allKeys('en').sort();
  for (const lang of Object.keys(LANGUAGES)) {
    assert.deepEqual(allKeys(lang).sort(), english, `missing or extra keys in "${lang}"`);
  }
});

test('fills placeholders', () => {
  assert.equal(translate('pt', 'run.winless', { n: 4 }), '4 jogos sem vencer');
  assert.equal(translate('fr', 'list.title', { club: 'Barcelone' }), 'Matchs — Barcelone');
});

test('singular and plural, with the French rule for zero', () => {
  assert.equal(translateCount('en', 'matches.count', 1), '1 match');
  assert.equal(translateCount('en', 'matches.count', 0), '0 matches');
  assert.equal(translateCount('pt', 'matches.count', 0), '0 jogos');
  assert.equal(translateCount('fr', 'matches.count', 0), '0 match');
  assert.equal(translateCount('fr', 'matches.count', 3), '3 matchs');
});

test('falls back to English, then to the key itself', () => {
  assert.equal(translate('de', 'comp.cup'), 'Cup');
  assert.equal(translate('pt', 'does.not.exist'), 'does.not.exist');
});
