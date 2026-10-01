// Confere os dados do site antes do build: fichas, mapas e textos bíblicos.
// Uso: npm run check   (o CI roda isso em todo PR)
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const errors = [];
const err = (msg) => errors.push(msg);

// Livros e capítulos (a KJV é a referência de numeração)
const books = [...fs.readFileSync(path.join(root, 'src/data/books.js'), 'utf8').matchAll(/^\s*\['(\w+)', '[^']*', '[^']*', '[^']*', '[^']*', '(\w+)'\]/gm)].map((m) => m[1]);
if (books.length !== 66) err(`books.js: esperava 66 livros, achei ${books.length}`);
const counts = read('src/data/counts.json');
const chaptersOf = (slug) => counts[books.indexOf(slug) + 1][0];

const bilingual = (v, where) => {
  if (!v || typeof v.pt !== 'string' || typeof v.en !== 'string' || !v.pt.trim() || !v.en.trim()) err(`${where}: falta texto em PT ou EN`);
};
// "12:37", "19–20", "2:1–7": só confere se os capítulos citados existem no livro
const refOk = (ref, slug, where) => {
  if (typeof ref !== 'string' || !/^\d+(:\d+)?([–-]\d+(:\d+)?)?$/.test(ref)) { err(`${where}: referência inválida "${ref}"`); return; }
  const max = chaptersOf(slug);
  const chapters = ref.includes(':') ? [...ref.matchAll(/(\d+):/g)].map((m) => Number(m[1])) : [...ref.matchAll(/\d+/g)].map((m) => Number(m[0]));
  for (const c of chapters) if (c < 1 || c > max) err(`${where}: capítulo ${c} não existe (livro tem ${max})`);
};

// Região coberta pela costa em src/data/land.json (lon -12..72, lat -2..52)
const LON = [-12, 72];
const LAT = [-2, 52];

for (const slug of books) {
  const file = `src/data/info/${slug}.json`;
  if (!fs.existsSync(path.join(root, file))) { err(`${file}: ficha ausente`); continue; }
  const d = read(file);
  for (const k of ['place', 'recipients', 'theme', 'historicalContext', 'connections']) bilingual(d[k], `${slug}.${k}`);
  for (const k of ['author', 'date']) for (const v of ['traditional', 'scholarly']) bilingual(d[k]?.[v], `${slug}.${k}.${v}`);
  refOk(d.keyVerse, slug, `${slug}.keyVerse`);
  if (!Array.isArray(d.characters) || !d.characters.length) err(`${slug}: sem personagens`);
  (d.characters ?? []).forEach((c, i) => { bilingual(c.name, `${slug}.characters[${i}].name`); bilingual(c.role, `${slug}.characters[${i}].role`); });
  if (!Array.isArray(d.outline) || !d.outline.length) err(`${slug}: sem esboço`);
  (d.outline ?? []).forEach((o, i) => { refOk(o.ref, slug, `${slug}.outline[${i}]`); bilingual(o.title, `${slug}.outline[${i}].title`); });

  if (d.map) {
    const m = d.map;
    if (typeof m.route !== 'boolean') err(`${slug}.map.route: deve ser true/false`);
    if (m.note) bilingual(m.note, `${slug}.map.note`);
    if (!Array.isArray(m.places) || m.places.length < 2) err(`${slug}.map: precisa de pelo menos 2 lugares`);
    const seen = new Set();
    (m.places ?? []).forEach((p, i) => {
      const w = `${slug}.map.places[${i}]`;
      bilingual(p.name, `${w}.name`); bilingual(p.note, `${w}.note`);
      const [lon, lat] = p.lonLat ?? [];
      if (![lon, lat].every(Number.isFinite)) err(`${w}: lonLat inválido`);
      else if (lon < LON[0] || lon > LON[1] || lat < LAT[0] || lat > LAT[1]) err(`${w}: fora da região da costa (${lon}, ${lat})`);
      refOk(p.ref, slug, `${w}.ref`);
      if (p.uncertain !== undefined && typeof p.uncertain !== 'boolean') err(`${w}.uncertain: deve ser true/false`);
      if (p.label && !(p.label.length === 3 && typeof p.label[0] === 'number' && typeof p.label[1] === 'number' && ['start', 'middle', 'end'].includes(p.label[2]))) err(`${w}.label: use [dx, dy, "start"|"middle"|"end"]`);
      if (seen.has(p.name?.pt)) err(`${w}: nome repetido "${p.name?.pt}"`);
      seen.add(p.name?.pt);
    });
  }
}

// Textos bíblicos: 66 livros por versão, mesmos capítulos da KJV; versículo é texto ou null
const bibleSrc = fs.readFileSync(path.join(root, 'src/data/bible.js'), 'utf8');
const versionIds = [...bibleSrc.matchAll(/^\s*id: '(\w+)'/gm)].map((m) => m[1]);
if (!versionIds.length) err('bible.js: nenhuma versão encontrada');
for (const v of versionIds) {
  books.forEach((slug, i) => {
    const f = `public/bible/${v}/${i + 1}.json`;
    if (!fs.existsSync(path.join(root, f))) { err(`${f}: ausente`); return; }
    const chs = read(f);
    if (chs.length !== chaptersOf(slug)) err(`${f}: ${chs.length} capítulos (esperado ${chaptersOf(slug)})`);
    chs.forEach((c, ci) => c.forEach((t, vi) => {
      if (t !== null && (typeof t !== 'string' || !t.trim())) err(`${f} ${ci + 1}:${vi + 1}: versículo vazio ou inválido (use null)`);
      else if (typeof t === 'string' && /\s[,.;:?!]|\s{2,}|^\s|\s$/.test(t)) err(`${f} ${ci + 1}:${vi + 1}: espaçamento irregular`);
    }));
  });
  if (!fs.existsSync(path.join(root, `public/bible/${v}/LICENSE.txt`)) && v !== 'kjv') err(`public/bible/${v}: falta LICENSE.txt`);
}


// Linha do tempo: blocos, períodos e eventos
{
  const tl = read('src/data/timeline.json');
  const year = (y) => Number.isInteger(y) && y !== 0 && y >= -5000 && y <= 120; // não existe o ano 0
  const dateOk = (d, where) => {
    if (!d || !year(d.start)) { err(`${where}: start inválido`); return null; }
    if (d.end !== undefined && (!year(d.end) || d.end < d.start)) err(`${where}: end inválido ou antes de start`);
    if (d.approx !== undefined && typeof d.approx !== 'boolean') err(`${where}.approx: deve ser true/false`);
    if (d.note) bilingual(d.note, `${where}.note`);
    return d;
  };
  // {start,end?} ou {traditional:{...}, scholarly:{...}}
  const datesOk = (dates, where) => {
    if (dates?.start !== undefined) return dateOk(dates, where);
    if (!dates?.traditional || !dates?.scholarly) { err(`${where}: use start/end ou traditional + scholarly`); return null; }
    dateOk(dates.scholarly, `${where}.scholarly`);
    return dateOk(dates.traditional, `${where}.traditional`);
  };
  const blockIds = new Set((tl.blocks ?? []).map((b) => b.id));
  (tl.blocks ?? []).forEach((b) => { bilingual(b.title, `timeline.blocks.${b.id}.title`); if (!(b.ppy > 0)) err(`timeline.blocks.${b.id}: ppy deve ser > 0`); });
  const periodIds = new Set();
  let prev = -Infinity;
  (tl.periods ?? []).forEach((p) => {
    const w = `timeline.periods.${p.id}`;
    if (periodIds.has(p.id)) err(`${w}: id repetido`);
    periodIds.add(p.id);
    if (!blockIds.has(p.block)) err(`${w}: bloco "${p.block}" não existe`);
    bilingual(p.title, `${w}.title`); bilingual(p.summary, `${w}.summary`);
    if (!p.undated) {
      const m = datesOk(p.dates, `${w}.dates`);
      if (m) { if (m.start < prev) err(`${w}: períodos fora de ordem cronológica`); prev = m.start; if (m.end === undefined) err(`${w}: período precisa de end`); }
    }
    (p.books ?? []).forEach((b) => { if (!books.includes(b)) err(`${w}: livro "${b}" não existe`); });
  });
  const eventIds = new Set();
  (tl.events ?? []).forEach((e) => {
    const w = `timeline.events.${e.id}`;
    if (eventIds.has(e.id)) err(`${w}: id repetido`);
    eventIds.add(e.id);
    if (!periodIds.has(e.period)) err(`${w}: período "${e.period}" não existe`);
    bilingual(e.title, `${w}.title`); bilingual(e.note, `${w}.note`);
    datesOk(e.dates, `${w}.dates`);
    if (e.ref) { if (!books.includes(e.ref.book)) err(`${w}.ref: livro "${e.ref.book}" não existe`); else refOk(e.ref.ref, e.ref.book, `${w}.ref`); }
    // lugares ligados ao mapa: precisam existir (nome em PT) no mapa da ficha do livro
    (e.places ?? []).forEach((pl, i) => {
      if (!books.includes(pl.book)) { err(`${w}.places[${i}]: livro "${pl.book}" não existe`); return; }
      const place = (read(`src/data/info/${pl.book}.json`).map?.places ?? []).find((x) => x.name?.pt === pl.name);
      if (!place) err(`${w}.places[${i}]: lugar "${pl.name}" não está no mapa de ${pl.book}`);
      else if (place.name.en !== pl.en) err(`${w}.places[${i}]: "en" deve ser "${place.name.en}"`);
    });
    for (const k of ['attested', 'uncertain']) if (e[k] !== undefined && typeof e[k] !== 'boolean') err(`${w}.${k}: deve ser true/false`);
  });
}


// Personagens: ids, textos, livros, eventos da linha do tempo e lugares do mapa
{
  const { people } = read('src/data/people.json');
  const tl = read('src/data/timeline.json');
  const eventIds = new Set(tl.events.map((e) => e.id));
  const seen = new Set();
  people.forEach((p) => {
    const w = `people.${p.id}`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id ?? '')) err(`${w}: id inválido (use minúsculas e hífens)`);
    if (seen.has(p.id)) err(`${w}: id repetido`);
    seen.add(p.id);
    bilingual(p.name, `${w}.name`); bilingual(p.summary, `${w}.summary`);
    if (p.note) bilingual(p.note, `${w}.note`);
    if (p.uncertain !== undefined && typeof p.uncertain !== 'boolean') err(`${w}.uncertain: deve ser true/false`);
    if (!Array.isArray(p.books) || !p.books.length) err(`${w}: sem livros`);
    const bs = new Set();
    (p.books ?? []).forEach((b, i) => {
      if (!books.includes(b.book)) err(`${w}.books[${i}]: livro "${b.book}" não existe`);
      if (bs.has(b.book)) err(`${w}.books[${i}]: livro "${b.book}" repetido`);
      bs.add(b.book);
      bilingual(b.role, `${w}.books[${i}].role`);
    });
    (p.events ?? []).forEach((id) => { if (!eventIds.has(id)) err(`${w}: evento "${id}" não existe na linha do tempo`); });
    (p.places ?? []).forEach((pl, i) => {
      if (!books.includes(pl.book)) { err(`${w}.places[${i}]: livro "${pl.book}" não existe`); return; }
      const place = (read(`src/data/info/${pl.book}.json`).map?.places ?? []).find((x) => x.name?.pt === pl.name);
      if (!place) err(`${w}.places[${i}]: lugar "${pl.name}" não está no mapa de ${pl.book}`);
      else if (place.name.en !== pl.en) err(`${w}.places[${i}]: "en" deve ser "${place.name.en}"`);
    });
  });
}

if (errors.length) {
  console.error(`${errors.length} problema(s):`);
  errors.slice(0, 60).forEach((e) => console.error(` - ${e}`));
  if (errors.length > 60) console.error(` … e mais ${errors.length - 60}`);
  process.exit(1);
}
const tlData = read('src/data/timeline.json');
const peopleCount = read('src/data/people.json').people.length;
const maps = books.filter((s) => read(`src/data/info/${s}.json`).map).length;
console.log(`OK: ${books.length} fichas (${maps} com mapa), ${versionIds.length} versões (${versionIds.join(', ')}), linha do tempo com ${tlData.periods.length} períodos e ${tlData.events.length} eventos, ${peopleCount} personagens.`);
