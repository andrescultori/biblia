// Atualiza a ORTOGRAFIA da Almeida 1911 (domínio público). Não troca palavras nem revisa o texto: só a grafia
// ("elle" → "ele", "creou" → "criou", "principio" → "princípio", "ph/th" → "f/t", "d'elle" → "dele").
//
// Uso:  node scripts/modernize-alm1911.mjs <pasta ALM1911 do damarals/biblias> <número do livro>...   (ex.: 19 43)
// Saída: public/bible/alm1911a/<n>.json  +  relatório em stdout (cada troca distinta e as palavras que ficaram sem solução).
//
// Como decide: uma palavra já conhecida na grafia moderna (vocabulário tirado da Bíblia Livre, public/bible/blivre) fica como está.
// Senão, o script tenta regras de grafia (ph→f, ll→l, cc→c…) e a restauração de acentos, e só aceita o resultado se ele
// existir no vocabulário moderno. Nomes próprios e casos difíceis ficam em scripts/data/alm1911-ortografia.json.
import fs from 'node:fs';
import path from 'node:path';

const CODES = ('GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN '
  + 'HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM '
  + 'HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV').split(' ');
const [src, ...nums] = process.argv.slice(2);
if (!src || !nums.length) { console.error('Uso: node scripts/modernize-alm1911.mjs <pasta ALM1911> <n>...'); process.exit(1); }

const WORD = /[\p{L}]+/gu;
const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

// vocabulário moderno e mapa sem-acento → forma moderna mais frequente
const vocab = new Map();
for (let n = 1; n <= 66; n += 1) {
  for (const ch of JSON.parse(fs.readFileSync(`public/bible/blivre/${n}.json`, 'utf8'))) {
    for (const v of ch) if (v) for (const w of v.toLowerCase().match(WORD) ?? []) vocab.set(w, (vocab.get(w) ?? 0) + 1);
  }
}
const byStrip = new Map();
for (const [w, c] of vocab) { const k = strip(w); if (!byStrip.has(k)) byStrip.set(k, []); byStrip.get(k).push([w, c]); }
for (const l of byStrip.values()) l.sort((a, b) => b[1] - a[1]);
const known = (w) => vocab.has(w);
const restore = (w) => { const l = byStrip.get(strip(w)); return l ? l[0][0] : null; };

const EXC = JSON.parse(fs.readFileSync(new URL('./data/alm1911-ortografia.json', import.meta.url), 'utf8')).palavras;

// 1) regras sempre aplicadas a palavras que não são conhecidas na grafia moderna (marcas inequívocas da grafia antiga)
const KEEP_CT = /^(pact|impact|compact|contact|tact)/;           // "ct" que continua hoje
const KEEP_PT = /^(apt|adapt|opt|egipt|corrupt|interrupt|erupt|abrupt|rapt|inept|script|concept|percept|receptor)/; // "pt" que continua hoje
const FORCED = [
  [/ph/g, 'f'], [/th/g, 't'], [/rh/g, 'r'], [/y/g, 'i'], [/chr/g, 'cr'], [/^sc(?=[ei])/, 'c'], [/ss(?=$)/g, 'ss'],
  [/(ll|nn|pp|tt|cc|ff|gg|bb|dd|mm)/g, (m) => m[0]],
  [/^psal(?=[mt])/, 'sal'], [/(?<=[eo])mn/g, 'n'], [/(?<=[aeiou])nct/g, 'nt'], [/mp(?=[tç])/g, 'n'], [/lpt/g, 'lt'], [/prehen/g, 'preen'], [/^captiv/, 'cativ'],
  [/m(?=[tdqcsfgl])/g, 'n'], [/^resus/, 'ressus'], [/ae$/, 'ai'], [/aes$/, 'ais'], [/eos$/, 'eus'], [/eo$/, 'eu'],
];
const forced = (w) => {
  let x = w;
  for (const [re, to] of FORCED) x = x.replace(re, to);
  if (!KEEP_CT.test(w)) x = x.replace(/(?<=[aeiou])ct/g, 't').replace(/(?<=[aeiou])cç/g, 'ç');
  if (!KEEP_PT.test(w) && !KEEP_PT.test(x)) x = x.replace(/(?<=[aeiou])pt(?=[aeiouç])/g, 't').replace(/pç/g, 'ç');
  return x;
};
// 2) regras condicionais: só valem se a palavra resultante existir no vocabulário moderno
const COND = [[/io$/, 'iu'], [/ou$/, 'ou'], [/e(?=ou$)/, 'i'], [/z$/, 's'], [/ç(?=[ei])/g, 'c'], [/ia$/, 'ia']];
function viaCond(x) {
  const active = COND.filter(([re]) => new RegExp(re.source, re.flags.replace('g', '')).test(x));
  for (let m = 1; m < (1 << active.length); m += 1) {
    let y = x; active.forEach(([re, to], i) => { if (m & (1 << i)) y = y.replace(re, to); });
    if (known(y)) return y;
    const r = restore(y);
    if (r) return r;
  }
  return null;
}

const SUFFIX = [[/ario(s?)$/, 'ário$1'], [/erio(s?)$/, 'ério$1'], [/orio(s?)$/, 'ório$1'], [/icio(s?)$/, 'ício$1'], [/ancia(s?)$/, 'ância$1'], [/encia(s?)$/, 'ência$1'], [/icia(s?)$/, 'ícia$1'], [/oria(s?)$/, 'ória$1'], [/eio(s?)$/, 'eio$1']];
const viaSuffix = (x) => { for (const [re, to] of SUFFIX) if (re.test(x)) return x.replace(re, to); return null; };

const cache = new Map();
function modern(w) {
  if (cache.has(w)) return cache.get(w);
  let r;
  if (EXC[w] !== undefined) r = EXC[w];
  else if (known(w)) {
    // palavra rara na grafia moderna sem acento, mas muito comum com acento ("principio" → "princípio"): é a grafia antiga
    const alt = restore(w);
    r = w === strip(w) && alt && alt !== w && vocab.get(w) <= 2 && vocab.get(alt) >= 10 * vocab.get(w) && !/ra$/.test(w) ? alt : w;
  }
  else {
    const x = forced(w);
    if (known(x)) r = x;
    else r = viaCond(x) ?? (w === strip(w) ? (restore(x) ?? viaSuffix(x)) : restore(x)) ?? (x !== w ? x : null);
  }
  cache.set(w, r);
  return r;
}
const caseLike = (orig, w) => (orig === orig.toUpperCase() && orig.length > 1 ? w.toUpperCase() : orig[0] === orig[0].toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w);

const changes = new Map(); const unresolved = new Map();
function fixVerse(text) {
  // contrações com apóstrofo: n'elle → nelle, d'aquelle → daquelle (a regra de grafia faz o resto)
  const t = text
    .replace(/\b([dD])['’](?=um)/gu, (m, c) => (c === 'd' ? 'de ' : 'De '))
    .replace(/\b([dnDN])['’](?=\p{Lu})/gu, (m, c) => ({ d: 'de ', D: 'De ', n: 'em ', N: 'Em ' })[c])
    .replace(/\b([dnDN])['’](?!(?:el|aquel|aquil|est|ess|isso|isto|um|outr|algu|ningu|aqu))(?=\p{Ll})/gu, (m, c) => ({ d: 'de ', D: 'De ', n: 'em ', N: 'Em ' })[c])
    .replace(/\b(d|n|lh|t|m|s|c|D|N)['’](?=\p{L})/gu, '$1');
  const out = t.replace(WORD, (tok) => {
    const lower = tok.toLowerCase();
    const r = modern(lower);
    if (r === null) { unresolved.set(lower, (unresolved.get(lower) ?? 0) + 1); return tok; }
    if (r !== lower) changes.set(`${lower} → ${r}`, (changes.get(`${lower} → ${r}`) ?? 0) + 1);
    return caseLike(tok, r);
  });
  // pronomes colados ao verbo: "matal-o" → "matá-lo", "vol-o" → "vo-lo", "pôl-o" → "pô-lo"; mesóclise "herdá-la-ha" → "herdá-la-á"
  const ACC = { a: 'á', e: 'ê', i: 'í', o: 'ô' };
  return out
    .replace(/\b(\p{L}*?)([aeiouáâêôóé])l-(o|a|os|as)\b/gu, (m, st, v, cl) => `${st}${/[áâêôóé]/.test(v) ? v : (st + v).endsWith('emo') || st === 'v' ? v : v === 'i' || v === 'u' ? v : ACC[v] ?? v}-l${cl}`)
    .replace(/(?<=-)(ha|has|hão|hemos|heis)\b/gu, (m) => ({ ha: 'á', has: 'ás', hão: 'ão', hemos: 'emos', heis: 'eis' })[m]);
}

const outDir = path.join('public', 'bible', 'alm1911a');
fs.mkdirSync(outDir, { recursive: true });
for (const n of nums.map(Number)) {
  const code = CODES[n - 1];
  const b = JSON.parse(fs.readFileSync(path.join(src, `${code}.json`), 'utf8').replace(/^﻿/, ''));
  const chapters = b.chapters.map((c) => {
    const vs = {}; c.verses.forEach((v) => { vs[v.number] = v.text.replace(/\s+/g, ' ').trim(); });
    const max = Math.max(...Object.keys(vs).map(Number));
    const arr = Array.from({ length: max }, (_, i) => (vs[i + 1] ? fixVerse(vs[i + 1]) : null));
    while (arr.length && arr[arr.length - 1] === null) arr.pop();
    return arr;
  });
  fs.writeFileSync(path.join(outDir, `${n}.json`), JSON.stringify(chapters));
  console.error(`livro ${n} (${code}): ${chapters.length} capítulos`);
}
console.log(`TROCAS (${changes.size} distintas):`);
console.log([...changes].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${c}\t${k}`).join('\n'));
console.log(`\nSEM SOLUÇÃO (${unresolved.size} palavras ficaram como estão):`);
console.log([...unresolved].sort((a, b) => b[1] - a[1]).map(([k, c]) => `${c}\t${k}`).join('\n'));
