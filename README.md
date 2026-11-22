<h1 align="center">⚽ Fan Season Tracker</h1>

<p align="center">
  A fan's match diary for <strong>Ponte Preta</strong> and <strong>Barcelona</strong>: points, form, streaks, home/away splits and a points race chart.<br>
  Plain HTML, CSS and JavaScript — no frameworks, no back-end.
</p>

<p align="center">
  <a href="https://celsojr011.github.io/fan-season-tracker/"><img src="https://img.shields.io/badge/Live%20demo-GitHub%20Pages-1f5c43?style=for-the-badge&logo=github" alt="Live demo"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/SVG-chart-FFB13B?style=flat&logo=svg&logoColor=black" alt="SVG chart">
  <img src="https://img.shields.io/badge/Tests-node%3Atest-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node test runner">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="MIT License">
</p>

---

## Why I built this

I support two clubs that live very different lives. **Ponte Preta**, from Campinas, right next to where I live — a club that teaches you patience. And **Barcelona**, the one I follow from the other side of the ocean. One week I'm celebrating a 4–1, the next I'm doing the math on how many points we still need.

That "doing the math" part is what this project is about. Every football fan in Brazil talks about *aproveitamento* (the percentage of points won), unbeaten runs and "if we keep this pace, we finish with X points". I wanted a small tool that calculates those numbers from a simple list of results, the same way I'd do it on a napkin — but without the mistakes.

It's also practice for my day job: I work with operational data in logistics, and turning a list of records into a few numbers that tell a story is exactly the same skill.

> ⚠️ The club names are real, but **every result and every opponent in the sample data is made up**. None of these matches happened. No official crests, logos or club images are used — only neutral colors and text.

---

## Features

**Season summary (per club)**
- Played, W · D · L, points, % of points won, goals for/against, goal difference
- **Projected league points** over a 38-round season, at the current pace
- Filter by competition: all, league or cup

**Form & streaks**
- Last 5 results as colored chips (with letters, not color alone)
- Current run: "4 matches unbeaten" or "3 matches without a win"
- Longest unbeaten run, longest winning run and biggest win
- A "fan mood" line based on the % of points — mostly for fun

**Home vs away** — the same numbers split by venue.

**League points race** — a hand-made SVG line chart with both clubs, hover/tap tooltip, and a "show as table" option.

**Side by side** — both clubs compared by pace (points per game, goals per game, goals conceded…), with the better value highlighted.

**Match diary**
- Add a match (club, date, competition, home/away, opponent, score)
- Scoreline written like a scoreboard, home team first
- Delete a match, reset the sample data
- Data saved in the browser (`localStorage`)

**Three languages: 🇺🇸 EN · 🇧🇷 PT · 🇫🇷 FR**
- Buttons in the header switch everything: labels, results (W/D/L → V/E/D → V/N/D), messages, chart labels, dates and numbers
- The choice is remembered; on the first visit the app follows the browser language

**Other** — responsive layout (tested at 390 px wide) and unit tests for the rules and the translations.

---

## How it works

All the calculations live in `js/stats.js`, as plain functions that receive a list of matches and return numbers. A match looks like this:

```js
{ club: 'ponte', date: '2026-07-19', competition: 'league', venue: 'home',
  opponent: 'Atlético Serrano', goalsFor: 4, goalsAgainst: 1 }
```

### 1. Result and points

The result comes from the goals: more goals for = **W**, fewer = **L**, same = **D**. Points follow the standard rule: **3 for a win, 1 for a draw, 0 for a loss**.

### 2. % of points won (*aproveitamento*)

```
points won ÷ (matches played × 3) × 100
```

So 31 points in 21 matches = 31 ÷ 63 = **49.2%**. With zero matches it returns 0 instead of `NaN` — a small thing, but the screen would show "NaN%" otherwise.

### 3. Streaks

Results are sorted by date first (the saved data can be in any order), then I walk through them once, counting:

- **unbeaten run**: goes up on W or D, back to 0 on L
- **winning run**: goes up on W, back to 0 on anything else

The **current run** is told the way fans tell it. If the last match was not a loss, it counts backwards until it finds a loss → "*N matches unbeaten*". If the last match was a loss, it counts backwards until it finds a win → "*N matches without a win*". After a draw both are technically true — I picked the optimistic one, because that's what a fan says.

### 4. Projection

```
projected = points so far + (points per game × rounds left)
```

Example with the sample data: Ponte has 27 points in 18 league matches → 1.5 per game → 27 + 1.5 × 20 = **57 points**. It only uses **league** matches, because cup games don't count for the table, and it assumes 38 rounds (Série B and La Liga both have 20 teams playing each other twice). It ignores the fixture list on purpose — it answers "if we keep this pace, where do we finish?", nothing more.

### 5. Biggest win

The largest goal margin wins. If two wins have the same margin, the one with more goals scored wins (a 4–1 is remembered longer than a 3–0), and then the earliest one.

### 6. Validation when adding a match

`validateMatch()` returns a list of **error codes** instead of sentences, so the screen can show them in any language:

| Rule | Why |
|---|---|
| Date can't be in the future | It's a diary of games already played. Future fixtures would mess up the form and the projection. |
| One match per club per day | A team doesn't play twice on the same day. It also lets `club + date` work as the match id. |
| Opponent required, max 40 characters | Keeps the table readable. |
| Goals: whole numbers from 0 to 30 | Catches typos like `-1` or `1.5`. |

### 7. Translations

Every text on the screen comes from `js/i18n.js`: one dictionary per language, with `{placeholders}`:

```js
translate('pt', 'run.winless', { n: 4 });       // "4 jogos sem vencer"
translateCount('fr', 'matches.count', 0);        // "0 match"  (French: 0 is singular)
translateCount('en', 'matches.count', 0);        // "0 matches"
```

A few details I cared about:
- If a key is missing, it falls back to English and then to the key itself, so the screen never breaks.
- A test checks that PT and FR have exactly the same keys as EN — forgetting a translation fails `npm test`.
- French typography: a space before `:` ("Enregistré : …"), and "Barcelone" instead of "Barcelona".
- Messages already on screen are stored as *key + parameters*, not as final text, so switching language translates them too.
- Dates and decimals follow the locale (`49,2%` in PT/FR, `49.2%` in EN). Opponent names stay as typed.

---

## Technical decisions

- **Rules separated from the screen.** `stats.js` has no DOM code, so it runs in the browser *and* in Node. The tests don't need a browser.
- **Chart drawn by hand in SVG.** For two lines, a chart library felt like too much. Writing the scales myself (`x = match / total × width`) was also the best way to understand them. The chart is redrawn at the real container width, so the text doesn't shrink on phones.
- **Colors that work for colorblind people.** The two lines use a blue/orange pair from a colorblind-safe palette. They're not club colors on purpose. Results always show a letter next to the color.
- **Dates read as local dates.** `new Date('2026-05-10')` is midnight UTC, which in Brazil (UTC-3) is still May 9th. I hit this in my previous project, so date-only strings are parsed by hand here. Tests pass with `TZ=UTC` and `TZ=America/Sao_Paulo`.
- **Escaping user input.** The opponent name goes through `escapeHtml` before being shown.
- **`localStorage` with a fallback.** If storage is blocked, the app just uses the sample data.

---

## Project structure

```
fan-season-tracker/
├── index.html          # Single page: tabs, summary, form, chart, comparison, diary, add form
├── css/
│   └── style.css       # Layout, result colors, responsive rules
├── js/
│   ├── stats.js        # Rules: result, points, %, streaks, projection, validation
│   ├── chart.js        # SVG points race chart with hover tooltip
│   ├── sample-data.js  # Fictional season (made-up opponents and scores)
│   ├── i18n.js         # EN / PT / FR texts, translate() and plural helper
│   └── app.js          # Screen: rendering, events, language switch, localStorage
├── tests/
│   ├── stats.test.js   # Unit tests for the rules (node:test)
│   └── i18n.test.js    # Makes sure no language is missing a text
├── package.json
└── LICENSE
```

---

## Running locally

The app uses ES modules, so it needs to be served (opening `index.html` straight from the file system won't load the scripts).

```bash
git clone https://github.com/CelsoJr011/fan-season-tracker.git
cd fan-season-tracker

python3 -m http.server 8000
# or
npx serve .
```

Then open **http://localhost:8000**.

### Running the tests

Requires Node.js 18+ (no dependencies to install):

```bash
npm test
```

---

## What I learned

- A "simple" stat like the current run needs a clear definition before any code. Writing the rule in plain words first (and then as a test) saved me from a few wrong versions.
- Sorting by date before calculating anything matters: the user can add an old match at any time.
- Drawing a chart by hand teaches you what libraries do for you — scales, ticks, tooltips that don't leave the box.
- Translating is more than swapping words: plurals, number formats and punctuation change from one language to another.

---

## Next steps

- [ ] League table simulator (enter the other results, see the final position)
- [ ] Import results from a CSV file
- [ ] Head-to-head history against each opponent
- [ ] More than one season per club, to compare years
- [ ] Rewrite the screen in React + TypeScript

---

## 🇧🇷 Resumo em português

Diário de jogos de torcedor para a **Ponte Preta** e o **Barcelona**. A partir de uma lista de resultados, o app calcula pontos, aproveitamento, saldo de gols, sequência atual (invicta ou sem vencer), maiores sequências, maior goleada, desempenho em casa e fora, e uma projeção de pontos no campeonato em 38 rodadas. Tem um gráfico em SVG com a corrida de pontos dos dois times e uma comparação lado a lado. A tela funciona em português, inglês e francês (botões EN / PT / FR no topo). Feito com HTML, CSS e JavaScript puro, com testes das regras e das traduções. Os resultados e adversários são fictícios, e não há escudos nem logos oficiais.

---

## License

MIT — see [LICENSE](LICENSE).

## Author

**Celso de Azevedo Rodrigues Junior**
Logistics Operations · Data · IT Support | Building with JavaScript and TypeScript

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/celso-j-a25688153)
[![GitHub](https://img.shields.io/badge/GitHub-CelsoJr011-181717?style=flat&logo=github&logoColor=white)](https://github.com/CelsoJr011)
