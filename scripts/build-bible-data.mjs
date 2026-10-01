// Gera os arquivos de texto por livro (public/bible/<id>/<n>.json) a partir da fonte de cada versão.
//
// Uso:  node scripts/build-bible-data.mjs <id> <caminho-da-fonte>
//
//   kjv     JSON do thiagobodruk/bible (json/en_kjv.json)                        [domínio público]
//   web     eng-web.usfx.xml do seven1m/open-bibles (vem do eBible.org)          [domínio público]
//   asv     pasta usx-english-only/ do openbibleinfo/American-Standard-Version-Bible  [domínio público]
//   alm1911 pasta data/canonical/ALM1911/ do damarals/biblias                     [domínio público; texto do Project Gutenberg #62383]
//   blivre  pasta data/canonical/BLIVRE/ do damarals/biblias                      [CC BY 3.0 Brasil; exige atribuição]
//
// Saída: public/bible/<id>/<n>.json (n = 1..66, ordem canônica). Cada arquivo é um array de capítulos; cada capítulo
//        é um array em que a posição i guarda o versículo i+1. Versículo ausente nessa versão (por exemplo, os que a
//        ASV omite) fica como null, para o número mostrado no leitor continuar certo. Nulos no fim do capítulo são cortados.
// Só a KJV (referência de numeração do site) recalcula src/data/counts.json.
// A fonte da KJV tem defeitos de origem: espaço antes da pontuação ("the LORD .") e notas de margem vazadas no texto
// ("I am the LORD : : or, JEHOVAH"). O script tira o espaço e aplica scripts/data/kjv-fixes.json (ref, texto original
// esperado e texto final), que recusa corrigir se a fonte não bater com o texto esperado.
import fs from 'node:fs';
import path from 'node:path';

// Ordem canônica dos 66 livros, com os códigos USFM/USX.
const CODES = ('GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN '
  + 'HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM '
  + 'HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV').split(' ');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENTITIES[e.toLowerCase()] ?? m;
});

// Remove notas, referências cruzadas, títulos e marcação. Tags de bloco (parágrafo, linha de poesia) viram espaço;
// tags em linha somem sem deixar espaço (evita "Yahweh ’s").
function clean(t) {
  return decode(
    t.replace(/<(f|x|note)\b[\s\S]*?<\/\1>/g, '')
      .replace(/<(d|s\d?|r|ms\d?|mr|sp)\b[^>]*>[\s\S]*?<\/\1>/g, '')
      .replace(/<\/?(p|q\d?|b|l|li\d?|lg|para|ve)\b[^>]*>/g, ' ')
      .replace(/<[^>]+>/g, ''),
  ).replace(/\s+/g, ' ').trim().replace(/\s+([,.;:!?])/g, '$1');
}

// Cada leitor devolve: { [código do livro]: { [capítulo]: { [versículo]: texto } } }
const readers = {
  // JSON do thiagobodruk: [{ abbrev, name, chapters: [[verso, ...], ...] }], 66 livros em ordem canônica.
  json(file) {
    const books = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
    if (books.length !== 66) throw new Error(`Esperava 66 livros, recebi ${books.length}`);
    const out = {};
    books.forEach((b, i) => {
      out[CODES[i]] = Object.fromEntries(b.chapters.map((c, ci) => [ci + 1, Object.fromEntries(c.map((v, vi) => [vi + 1, v.trim()]))]));
    });
    return out;
  },
  // USFX (eBible.org): <book id="GEN"> ... <c id="1"/> ... <v id="1"/>texto<ve/>
  usfx(file) {
    const s = fs.readFileSync(file, 'utf8');
    const out = {};
    for (const bm of s.matchAll(/<book id="(\w+)">([\s\S]*?)<\/book>/g)) {
      if (!CODES.includes(bm[1])) continue; // ignora prefácio, glossário e deuterocanônicos
      const chs = {};
      for (const cm of bm[2].matchAll(/<c id="(\d+)"\/>([\s\S]*?)(?=<c id="|$)/g)) {
        const vs = {};
        for (const vm of cm[2].matchAll(/<v id="([^"]+)"\/>([\s\S]*?)<ve\/>/g)) vs[vm[1]] = clean(vm[2]);
        chs[cm[1]] = vs;
      }
      out[bm[1]] = chs;
    }
    return out;
  },
  // USX 3.0: <chapter number="1" sid=.../> ... <verse number="1" sid=.../>texto<verse eid=.../>
  // Em salmos, o marcador do versículo 1 fica dentro de parágrafos de título; o texto do título sai, o marcador fica.
  usx(dir) {
    const out = {};
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.usx')).sort()) {
      const code = f.match(/-(\w+)\.usx$/)[1];
      let s = fs.readFileSync(path.join(dir, f), 'utf8');
      s = s.replace(/<para style="(?:s\d?|d|ms\d?|mr|r|sp|cl|mt\d?|h|toc\d)"[^>]*>[\s\S]*?<\/para>/g,
        (m) => (m.match(/<verse\b[^>]*\/>/g) ?? []).join(''));
      const chs = {};
      for (const cm of s.matchAll(/<chapter number="(\d+)"[^>]*sid="[^"]*"\s*\/>([\s\S]*?)(?=<chapter number=|$)/g)) {
        const vs = {};
        for (const vm of cm[2].matchAll(/<verse number="([^"]+)"[^>]*\/>([\s\S]*?)<verse eid="[^"]*"\s*\/>/g)) vs[vm[1]] = clean(vm[2]);
        chs[cm[1]] = vs;
      }
      out[code] = chs;
    }
    return out;
  },
  // JSON canônico do damarals/biblias: um arquivo por livro, { code, chapters: [{ number, verses: [{ number, text }] }] }.
  // A Bíblia Livre marca com "—" os versículos que o texto crítico omite; viram lacuna (null).
  damarals(dir) {
    const out = {};
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json') && x !== 'meta.json')) {
      const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^﻿/, ''));
      out[b.code] = Object.fromEntries(b.chapters.map((c) => [c.number, Object.fromEntries(c.verses.map((v) => [v.number, v.text.replace(/\s+/g, ' ').trim().replace(/^[—–]$/, '')]))]));
    }
    return out;
  },
};

// KJV: corrige a fonte (ver cabeçalho). Só mexe em espaçamento e nas notas listadas; nenhuma palavra do texto é trocada.
function fixKjv(data) {
  const fixes = JSON.parse(fs.readFileSync(new URL('./data/kjv-fixes.json', import.meta.url), 'utf8'));
  for (const f of fixes) {
    const [code, cv] = f.ref.split(' ');
    const [c, v] = cv.split(':');
    if (data[code]?.[c]?.[v] !== f.from) throw new Error(`kjv-fixes: ${f.ref} não bate com a fonte (a fonte mudou?)`);
    data[code][c][v] = f.to;
  }
  for (const book of Object.values(data)) {
    for (const ch of Object.values(book)) {
      for (const v of Object.keys(ch)) ch[v] = ch[v].replace(/\s+([,.;:?!])/g, '$1');
    }
  }
}

const FORMAT = { kjv: 'json', web: 'usfx', asv: 'usx', alm1911: 'damarals', blivre: 'damarals' };

const [version, source] = process.argv.slice(2);
if (!FORMAT[version] || !source) {
  console.error(`Uso: node scripts/build-bible-data.mjs <${Object.keys(FORMAT).join('|')}> <caminho-da-fonte>`);
  process.exit(1);
}

const data = readers[FORMAT[version]](source);
if (version === 'kjv') fixKjv(data);
const outDir = path.join('public', 'bible', version);
fs.mkdirSync(outDir, { recursive: true });

const counts = {};
let chaptersTotal = 0; let versesTotal = 0; let nulls = 0;
const notes = [];
CODES.forEach((code, i) => {
  const n = i + 1;
  const book = data[code];
  if (!book) throw new Error(`Livro ausente na fonte: ${code}`);
  const chNums = Object.keys(book).map(Number).sort((a, b) => a - b);
  if (chNums.some((c, k) => c !== k + 1)) throw new Error(`${code}: capítulos não contíguos`);
  const chapters = chNums.map((c) => {
    const vs = book[c];
    const nums = Object.keys(vs);
    if (nums.some((k) => !/^\d+$/.test(k))) throw new Error(`${code} ${c}: versículo agrupado (${nums.filter((k) => !/^\d+$/.test(k))})`);
    const max = Math.max(...nums.map(Number));
    const arr = Array.from({ length: max }, (_, k) => (vs[k + 1] ? vs[k + 1] : null));
    while (arr.length && arr[arr.length - 1] === null) arr.pop();
    const holes = arr.map((v, k) => (v === null ? k + 1 : null)).filter(Boolean);
    if (holes.length) notes.push(`${code} ${c}: sem texto no(s) v. ${holes.join(', ')}`);
    nulls += holes.length;
    versesTotal += arr.filter((v) => v !== null).length;
    return arr;
  });
  chaptersTotal += chapters.length;
  fs.writeFileSync(path.join(outDir, `${n}.json`), JSON.stringify(chapters));
  counts[n] = [chapters.length, chapters.reduce((s, c) => s + c.length, 0)];
});

if (version === 'kjv') fs.writeFileSync(path.join('src', 'data', 'counts.json'), JSON.stringify(counts));
if (chaptersTotal !== 1189) throw new Error(`Esperava 1.189 capítulos, recebi ${chaptersTotal}`);
console.log(`OK: ${version} -> ${outDir} | ${chaptersTotal} capítulos | ${versesTotal} versículos com texto | ${nulls} lacunas (null)`);
if (notes.length) console.log(notes.join('\n'));
