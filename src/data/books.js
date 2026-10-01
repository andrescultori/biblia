import counts from './counts.json';

// Seções seguem a legenda do TaBíblia Periódica original.
// Atos tem seção própria (decisão do André); a imagem original o punha junto dos Evangelhos.
export const SECTIONS = [
  { id: 'lei', pt: 'Lei', en: 'Law', testament: 'at' },
  { id: 'historicos', pt: 'Históricos', en: 'History', testament: 'at' },
  { id: 'poesia', pt: 'Poesia e Sabedoria', en: 'Poetry & Wisdom', testament: 'at' },
  { id: 'profMaiores', pt: 'Profetas Maiores', en: 'Major Prophets', testament: 'at' },
  { id: 'profMenores', pt: 'Profetas Menores', en: 'Minor Prophets', testament: 'at' },
  { id: 'evangelhos', pt: 'Evangelhos', en: 'Gospels', testament: 'nt' },
  { id: 'atos', pt: 'Atos', en: 'Acts', testament: 'nt' },
  { id: 'paulo', pt: 'Cartas de Paulo', en: 'Letters of Paul', testament: 'nt' },
  { id: 'outras', pt: 'Outras Cartas', en: 'General Letters', testament: 'nt' },
  { id: 'profecia', pt: 'Profecia', en: 'Prophecy', testament: 'nt' },
];

// [slug, sigla PT, nome PT, sigla EN, nome EN, seção]
const RAW = [
  ['gen', 'Gn', 'Gênesis', 'Gen', 'Genesis', 'lei'],
  ['exo', 'Êx', 'Êxodo', 'Exo', 'Exodus', 'lei'],
  ['lev', 'Lv', 'Levítico', 'Lev', 'Leviticus', 'lei'],
  ['num', 'Nm', 'Números', 'Num', 'Numbers', 'lei'],
  ['deu', 'Dt', 'Deuteronômio', 'Deu', 'Deuteronomy', 'lei'],
  ['jos', 'Js', 'Josué', 'Jos', 'Joshua', 'historicos'],
  ['jdg', 'Jz', 'Juízes', 'Jdg', 'Judges', 'historicos'],
  ['rut', 'Rt', 'Rute', 'Rut', 'Ruth', 'historicos'],
  ['1sa', '1Sm', '1 Samuel', '1Sa', '1 Samuel', 'historicos'],
  ['2sa', '2Sm', '2 Samuel', '2Sa', '2 Samuel', 'historicos'],
  ['1ki', '1Rs', '1 Reis', '1Ki', '1 Kings', 'historicos'],
  ['2ki', '2Rs', '2 Reis', '2Ki', '2 Kings', 'historicos'],
  ['1ch', '1Cr', '1 Crônicas', '1Ch', '1 Chronicles', 'historicos'],
  ['2ch', '2Cr', '2 Crônicas', '2Ch', '2 Chronicles', 'historicos'],
  ['ezr', 'Ed', 'Esdras', 'Ezr', 'Ezra', 'historicos'],
  ['neh', 'Ne', 'Neemias', 'Neh', 'Nehemiah', 'historicos'],
  ['est', 'Et', 'Ester', 'Est', 'Esther', 'historicos'],
  ['job', 'Jó', 'Jó', 'Job', 'Job', 'poesia'],
  ['psa', 'Sl', 'Salmos', 'Psa', 'Psalms', 'poesia'],
  ['pro', 'Pv', 'Provérbios', 'Pro', 'Proverbs', 'poesia'],
  ['ecc', 'Ec', 'Eclesiastes', 'Ecc', 'Ecclesiastes', 'poesia'],
  ['sng', 'Ct', 'Cantares', 'Sng', 'Song of Songs', 'poesia'],
  ['isa', 'Is', 'Isaías', 'Isa', 'Isaiah', 'profMaiores'],
  ['jer', 'Jr', 'Jeremias', 'Jer', 'Jeremiah', 'profMaiores'],
  ['lam', 'Lm', 'Lamentações', 'Lam', 'Lamentations', 'profMaiores'],
  ['eze', 'Ez', 'Ezequiel', 'Eze', 'Ezekiel', 'profMaiores'],
  ['dan', 'Dn', 'Daniel', 'Dan', 'Daniel', 'profMaiores'],
  ['hos', 'Os', 'Oseias', 'Hos', 'Hosea', 'profMenores'],
  ['joe', 'Jl', 'Joel', 'Joe', 'Joel', 'profMenores'],
  ['amo', 'Am', 'Amós', 'Amo', 'Amos', 'profMenores'],
  ['oba', 'Ob', 'Obadias', 'Oba', 'Obadiah', 'profMenores'],
  ['jon', 'Jn', 'Jonas', 'Jon', 'Jonah', 'profMenores'],
  ['mic', 'Mq', 'Miqueias', 'Mic', 'Micah', 'profMenores'],
  ['nah', 'Na', 'Naum', 'Nah', 'Nahum', 'profMenores'],
  ['hab', 'Hc', 'Habacuque', 'Hab', 'Habakkuk', 'profMenores'],
  ['zep', 'Sf', 'Sofonias', 'Zep', 'Zephaniah', 'profMenores'],
  ['hag', 'Ag', 'Ageu', 'Hag', 'Haggai', 'profMenores'],
  ['zec', 'Zc', 'Zacarias', 'Zec', 'Zechariah', 'profMenores'],
  ['mal', 'Ml', 'Malaquias', 'Mal', 'Malachi', 'profMenores'],
  ['mat', 'Mt', 'Mateus', 'Mat', 'Matthew', 'evangelhos'],
  ['mar', 'Mc', 'Marcos', 'Mar', 'Mark', 'evangelhos'],
  ['luk', 'Lc', 'Lucas', 'Luk', 'Luke', 'evangelhos'],
  ['joh', 'Jo', 'João', 'Joh', 'John', 'evangelhos'],
  ['act', 'At', 'Atos', 'Act', 'Acts', 'atos'],
  ['rom', 'Rm', 'Romanos', 'Rom', 'Romans', 'paulo'],
  ['1co', '1Co', '1 Coríntios', '1Co', '1 Corinthians', 'paulo'],
  ['2co', '2Co', '2 Coríntios', '2Co', '2 Corinthians', 'paulo'],
  ['gal', 'Gl', 'Gálatas', 'Gal', 'Galatians', 'paulo'],
  ['eph', 'Ef', 'Efésios', 'Eph', 'Ephesians', 'paulo'],
  ['php', 'Fp', 'Filipenses', 'Php', 'Philippians', 'paulo'],
  ['col', 'Cl', 'Colossenses', 'Col', 'Colossians', 'paulo'],
  ['1th', '1Ts', '1 Tessalonicenses', '1Th', '1 Thessalonians', 'paulo'],
  ['2th', '2Ts', '2 Tessalonicenses', '2Th', '2 Thessalonians', 'paulo'],
  ['1ti', '1Tm', '1 Timóteo', '1Ti', '1 Timothy', 'paulo'],
  ['2ti', '2Tm', '2 Timóteo', '2Ti', '2 Timothy', 'paulo'],
  ['tit', 'Tt', 'Tito', 'Tit', 'Titus', 'paulo'],
  ['phm', 'Fm', 'Filemom', 'Phm', 'Philemon', 'paulo'],
  ['heb', 'Hb', 'Hebreus', 'Heb', 'Hebrews', 'outras'],
  ['jas', 'Tg', 'Tiago', 'Jas', 'James', 'outras'],
  ['1pe', '1Pe', '1 Pedro', '1Pe', '1 Peter', 'outras'],
  ['2pe', '2Pe', '2 Pedro', '2Pe', '2 Peter', 'outras'],
  ['1jn', '1Jo', '1 João', '1Jn', '1 John', 'outras'],
  ['2jn', '2Jo', '2 João', '2Jn', '2 John', 'outras'],
  ['3jn', '3Jo', '3 João', '3Jn', '3 John', 'outras'],
  ['jud', 'Jd', 'Judas', 'Jud', 'Jude', 'outras'],
  ['rev', 'Ap', 'Apocalipse', 'Rev', 'Revelation', 'profecia'],
];

export const BOOKS = RAW.map(([slug, abPt, nmPt, abEn, nmEn, section], i) => {
  const n = i + 1; // ordem canônica = número do livro nos arquivos de texto
  const [chapters, verses] = counts[n];
  return {
    n, slug, section, testament: n <= 39 ? 'at' : 'nt', chapters, verses,
    ab: { pt: abPt, en: abEn }, name: { pt: nmPt, en: nmEn },
  };
});

export const bySlug = Object.fromEntries(BOOKS.map((b) => [b.slug, b]));
