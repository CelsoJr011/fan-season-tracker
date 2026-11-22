// Translations for the three languages I speak: English, Portuguese and French.
// Keys are grouped by screen area so it's easy to find what to change.

export const LANGUAGES = {
  en: { label: 'EN', locale: 'en-US', name: 'English' },
  pt: { label: 'PT', locale: 'pt-BR', name: 'Português' },
  fr: { label: 'FR', locale: 'fr-FR', name: 'Français' },
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
    'summary.record': 'W · D · L',
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

  pt: {
    'page.title': 'Fan Season Tracker — Ponte Preta e Barcelona',
    'header.subtitle': 'Diário de jogos de um torcedor: pontos, fase e sequências da Ponte Preta e do Barcelona',
    'header.reset': 'Restaurar dados de exemplo',
    'header.language': 'Idioma',

    'club.label': 'Time',
    'club.ponte': 'Ponte Preta',
    'club.barca': 'Barcelona',
    'filter.competition': 'Competição',
    'filter.all': 'Todas as competições',
    'comp.league': 'Campeonato',
    'comp.cup': 'Copa',

    'summary.label': 'Resumo da temporada',
    'summary.played': 'Jogos',
    'summary.record': 'V · E · D',
    'summary.points': 'Pontos',
    'summary.pointsPct': 'Aproveitamento',
    'summary.goals': 'Gols (pró : contra)',
    'summary.goalDiff': 'Saldo de gols',
    'summary.projection': 'Projeção de pontos no campeonato',
    'summary.projectionHint': 'nesse ritmo, em 38 rodadas',

    'form.title': 'Fase e sequências',
    'form.last5': 'Últimos 5',
    'form.current': 'Sequência atual',
    'form.longestUnbeaten': 'Maior invencibilidade',
    'form.longestWins': 'Maior sequência de vitórias',
    'form.biggestWin': 'Maior goleada',
    'form.none': 'Nenhum jogo ainda.',
    'form.mood': 'Humor do torcedor:',

    'run.unbeaten': '{n} jogos sem perder',
    'run.unbeatenOne': '{n} jogo sem perder',
    'run.winless': '{n} jogos sem vencer',
    'run.winlessOne': '{n} jogo sem vencer',
    'matches.count': '{n} jogos',
    'matches.countOne': '{n} jogo',
    'win.against': '{score} contra {opponent}',

    'mood.waiting': 'A temporada nem começou. Só esperança.',
    'mood.dreaming': 'Sonhando alto. Ninguém fala nada. 🤫',
    'mood.confident': 'Confiante, mas olhando a tabela todo dia.',
    'mood.nervous': 'Nervoso. Cada jogo é uma final.',
    'mood.suffering': 'Sofrendo — mas torcedor de verdade não abandona.',

    'result.W': 'V',
    'result.D': 'E',
    'result.L': 'D',
    'result.W.long': 'Vitória',
    'result.D.long': 'Empate',
    'result.L.long': 'Derrota',

    'venue.title': 'Em casa x fora',
    'venue.home': 'Em casa',
    'venue.away': 'Fora',

    'compare.title': 'Lado a lado',
    'compare.hint': 'Usa o mesmo filtro de competição lá de cima. Os dois jogam ligas diferentes, então aqui o que se compara é o ritmo — não quem ganharia o jogo.',
    'compare.metric': 'Indicador',
    'compare.pointsPerGame': 'Pontos por jogo',
    'compare.goalsPerGame': 'Gols marcados por jogo',
    'compare.concededPerGame': 'Gols sofridos por jogo',
    'compare.cleanSheets': 'Jogos sem sofrer gol',
    'compare.better': 'melhor',

    'chart.title': 'Corrida de pontos no campeonato',
    'chart.hint': 'Pontos acumulados no campeonato depois de cada jogo. Passe o mouse ou toque no gráfico para ver os números.',
    'chart.match': 'Jogo',
    'chart.points': 'Pontos',
    'chart.tooltip': 'Jogo {n}',
    'chart.table': 'Ver como tabela',
    'chart.empty': 'Nenhum jogo de campeonato ainda.',
    'chart.aria': 'Gráfico de linhas com os pontos acumulados no campeonato, jogo a jogo, dos dois times',

    'list.title': 'Jogos — {club}',
    'list.date': 'Data',
    'list.competition': 'Competição',
    'list.match': 'Jogo',
    'list.result': 'Resultado',
    'list.delete': 'Excluir',
    'list.deleteAria': 'Excluir o jogo de {date}',
    'list.empty': 'Nenhum jogo para esse filtro.',
    'list.deleted': 'Jogo excluído.',

    'add.title': 'Registrar um jogo',
    'add.club': 'Time',
    'add.date': 'Data',
    'add.competition': 'Competição',
    'add.venue': 'Mando',
    'add.opponent': 'Adversário',
    'add.opponentPlaceholder': 'ex.: Real Olivar',
    'add.goalsFor': 'Gols pró',
    'add.goalsAgainst': 'Gols contra',
    'add.submit': 'Salvar jogo',
    'add.success': 'Salvo: {match}.',

    'error.club': 'Escolha um dos dois times.',
    'error.competition': 'Escolha uma competição.',
    'error.venue': 'Escolha em casa ou fora.',
    'error.date': 'Escolha uma data válida.',
    'error.futureDate': 'Essa data ainda não chegou — aqui só entram jogos que já aconteceram.',
    'error.duplicateDate': '{club} já tem um jogo registrado nessa data.',
    'error.opponent': 'Digite o nome do adversário.',
    'error.opponentLength': 'Nome do adversário muito longo (máximo de 40 caracteres).',
    'error.goals': 'Os gols precisam ser números inteiros entre 0 e 30.',

    'footer.text': 'Resultados fictícios, projeto de estudo. Sem escudos nem logos oficiais. Feito por',
  },

  fr: {
    'page.title': 'Fan Season Tracker — Ponte Preta et Barcelone',
    'header.subtitle': "Le carnet de matchs d'un supporter : points, forme et séries de Ponte Preta et du FC Barcelone",
    'header.reset': "Réinitialiser l'exemple",
    'header.language': 'Langue',

    'club.label': 'Club',
    'club.ponte': 'Ponte Preta',
    'club.barca': 'Barcelone',
    'filter.competition': 'Compétition',
    'filter.all': 'Toutes les compétitions',
    'comp.league': 'Championnat',
    'comp.cup': 'Coupe',

    'summary.label': 'Bilan de la saison',
    'summary.played': 'Matchs joués',
    'summary.record': 'V · N · D',
    'summary.points': 'Points',
    'summary.pointsPct': 'Points pris (%)',
    'summary.goals': 'Buts (pour : contre)',
    'summary.goalDiff': 'Différence de buts',
    'summary.projection': 'Projection de points en championnat',
    'summary.projectionHint': 'à ce rythme, sur 38 journées',

    'form.title': 'Forme et séries',
    'form.last5': '5 derniers',
    'form.current': 'Série en cours',
    'form.longestUnbeaten': 'Plus longue série sans défaite',
    'form.longestWins': 'Plus longue série de victoires',
    'form.biggestWin': 'Plus large victoire',
    'form.none': 'Aucun match pour le moment.',
    'form.mood': 'Moral du supporter :',

    'run.unbeaten': '{n} matchs sans défaite',
    'run.unbeatenOne': '{n} match sans défaite',
    'run.winless': '{n} matchs sans victoire',
    'run.winlessOne': '{n} match sans victoire',
    'matches.count': '{n} matchs',
    'matches.countOne': '{n} match',
    'win.against': '{score} contre {opponent}',

    'mood.waiting': "La saison n'a pas commencé. Que de l'espoir.",
    'mood.dreaming': 'On rêve en grand. Chut, personne ne dit rien. 🤫',
    'mood.confident': 'Confiant, mais je regarde le classement tous les jours.',
    'mood.nervous': 'Nerveux. Chaque match est une finale.',
    'mood.suffering': 'On souffre — mais un vrai supporter ne lâche rien.',

    'result.W': 'V',
    'result.D': 'N',
    'result.L': 'D',
    'result.W.long': 'Victoire',
    'result.D.long': 'Match nul',
    'result.L.long': 'Défaite',

    'venue.title': 'Domicile et extérieur',
    'venue.home': 'Domicile',
    'venue.away': 'Extérieur',

    'compare.title': 'Côte à côte',
    'compare.hint': "Même filtre de compétition que plus haut. Les deux clubs ne jouent pas dans le même championnat : on compare le rythme, pas qui gagnerait le match.",
    'compare.metric': 'Indicateur',
    'compare.pointsPerGame': 'Points par match',
    'compare.goalsPerGame': 'Buts marqués par match',
    'compare.concededPerGame': 'Buts encaissés par match',
    'compare.cleanSheets': 'Matchs sans encaisser de but',
    'compare.better': 'meilleur',

    'chart.title': 'La course aux points en championnat',
    'chart.hint': 'Points cumulés en championnat après chaque match. Survolez ou touchez le graphique pour voir les chiffres.',
    'chart.match': 'Match',
    'chart.points': 'Points',
    'chart.tooltip': 'Match {n}',
    'chart.table': 'Afficher en tableau',
    'chart.empty': 'Aucun match de championnat pour le moment.',
    'chart.aria': 'Graphique en courbes des points cumulés en championnat, match par match, pour les deux clubs',

    'list.title': 'Matchs — {club}',
    'list.date': 'Date',
    'list.competition': 'Compétition',
    'list.match': 'Match',
    'list.result': 'Résultat',
    'list.delete': 'Supprimer',
    'list.deleteAria': 'Supprimer le match du {date}',
    'list.empty': 'Aucun match pour ce filtre.',
    'list.deleted': 'Match supprimé.',

    'add.title': 'Ajouter un match',
    'add.club': 'Club',
    'add.date': 'Date',
    'add.competition': 'Compétition',
    'add.venue': 'Lieu',
    'add.opponent': 'Adversaire',
    'add.opponentPlaceholder': 'ex. : Real Olivar',
    'add.goalsFor': 'Buts marqués',
    'add.goalsAgainst': 'Buts encaissés',
    'add.submit': 'Enregistrer le match',
    'add.success': 'Enregistré : {match}.',

    'error.club': "Choisissez l'un des deux clubs.",
    'error.competition': 'Choisissez une compétition.',
    'error.venue': 'Choisissez domicile ou extérieur.',
    'error.date': 'Choisissez une date valide.',
    'error.futureDate': "Cette date n'est pas encore passée — ici, on note seulement les matchs déjà joués.",
    'error.duplicateDate': '{club} a déjà un match à cette date.',
    'error.opponent': "Saisissez le nom de l'adversaire.",
    'error.opponentLength': "Le nom de l'adversaire est trop long (40 caractères maximum).",
    'error.goals': 'Les buts doivent être des nombres entiers entre 0 et 30.',

    'footer.text': "Résultats fictifs, projet d'étude. Aucun écusson ni logo officiel. Réalisé par",
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
