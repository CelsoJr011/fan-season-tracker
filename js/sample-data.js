// Fictional season. Real club names, made-up opponents and made-up scores —
// none of these games happened. Ponte's season runs on the Brazilian
// calendar (April to November), Barça's on the European one (from August).

// Compact rows to keep the file readable: date, competition, venue,
// opponent, goals for, goals against.
const ponteRows = [
  ['2026-02-25', 'cup', 'away', 'Tropeiros AC', 2, 0],
  ['2026-03-11', 'cup', 'home', 'Maré Alta EC', 1, 1],
  ['2026-03-18', 'cup', 'away', 'Real Cerrado', 0, 2],
  ['2026-04-04', 'league', 'home', 'Vale Verde EC', 2, 1],
  ['2026-04-11', 'league', 'away', 'Atlético Serrano', 0, 0],
  ['2026-04-19', 'league', 'home', 'União Litorânea', 1, 2],
  ['2026-04-26', 'league', 'away', 'Recreativo Itapema', 1, 1],
  ['2026-05-03', 'league', 'home', 'Ipê Amarelo FC', 3, 0],
  ['2026-05-10', 'league', 'away', 'Serra Azul FC', 0, 1],
  ['2026-05-17', 'league', 'home', 'Pinhal Velho EC', 2, 2],
  ['2026-05-24', 'league', 'away', 'Canarinhos da Várzea', 2, 1],
  ['2026-06-07', 'league', 'home', 'Real Cerrado', 1, 0],
  ['2026-06-14', 'league', 'away', 'Tropeiros AC', 1, 3],
  ['2026-07-05', 'league', 'home', 'Maré Alta EC', 0, 0],
  ['2026-07-12', 'league', 'away', 'Vale Verde EC', 1, 1],
  ['2026-07-19', 'league', 'home', 'Atlético Serrano', 4, 1],
  ['2026-07-26', 'league', 'away', 'União Litorânea', 0, 2],
  ['2026-08-02', 'league', 'home', 'Recreativo Itapema', 2, 0],
  ['2026-08-09', 'league', 'away', 'Ipê Amarelo FC', 1, 1],
  ['2026-08-16', 'league', 'home', 'Serra Azul FC', 1, 2],
  ['2026-08-23', 'league', 'away', 'Pinhal Velho EC', 2, 0],
];

const barcaRows = [
  ['2026-08-16', 'league', 'away', 'Real Olivar', 2, 1],
  ['2026-08-23', 'league', 'home', 'Unión Montañesa', 4, 0],
  ['2026-08-30', 'league', 'away', 'Atlético Meseta', 1, 1],
  ['2026-09-13', 'league', 'home', 'CF Puerto Sereno', 3, 1],
  ['2026-09-20', 'league', 'away', 'UD Río Claro', 0, 1],
  ['2026-09-27', 'league', 'home', 'Sporting Almendral', 2, 0],
  ['2026-10-04', 'league', 'away', 'CD Valle Seco', 3, 2],
  ['2026-10-18', 'league', 'home', 'Racing Faro Azul', 5, 1],
  ['2026-10-25', 'league', 'away', 'CD Costa Brava Norte', 2, 2],
  ['2026-10-29', 'cup', 'away', 'Atlético Meseta', 3, 0],
  ['2026-11-01', 'league', 'home', 'Real Olivar', 1, 0],
  ['2026-11-08', 'league', 'away', 'Unión Montañesa', 2, 0],
  ['2026-11-15', 'league', 'home', 'Atlético Meseta', 1, 2],
  ['2026-11-19', 'cup', 'home', 'CD Valle Seco', 2, 1],
];

function toMatches(club, rows) {
  return rows.map(([date, competition, venue, opponent, goalsFor, goalsAgainst]) => ({
    club, date, competition, venue, opponent, goalsFor, goalsAgainst,
  }));
}

// Returns fresh objects every time, so "Reset sample data" really resets.
export function buildSampleMatches() {
  return [...toMatches('ponte', ponteRows), ...toMatches('barca', barcaRows)];
}
