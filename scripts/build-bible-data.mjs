// Gera os arquivos de texto por livro e as contagens de capítulos/versículos.
//
// Uso:  node scripts/build-bible-data.mjs kjv [caminho/para/en_kjv.json]
//
// Fonte da KJV (domínio público): https://github.com/thiagobodruk/bible  (json/en_kjv.json)
// Formato de entrada: [{ abbrev, name, chapters: [[verso, verso, ...], ...] }, ...] (66 livros, ordem canônica)
// Saída: public/bible/<versão>/<n>.json  (n = 1..66; cada arquivo é um array de capítulos com strings de versículos)
//        src/data/counts.json            (n -> [capítulos, versículos]; calculado a partir do texto)
import fs from 'node:fs';
import path from 'node:path';

const [version = 'kjv', source] = process.argv.slice(2);
if (!source) {
  console.error('Informe o caminho do JSON de origem. Ex.: node scripts/build-bible-data.mjs kjv ./en_kjv.json');
  process.exit(1);
}
const raw = fs.readFileSync(source, 'utf8').replace(/^﻿/, '');
const books = JSON.parse(raw);
if (books.length !== 66) throw new Error(`Esperava 66 livros, recebi ${books.length}`);

const outDir = path.join('public', 'bible', version);
fs.mkdirSync(outDir, { recursive: true });

const counts = {};
let totalVerses = 0;
books.forEach((b, i) => {
  const n = i + 1;
  const chapters = b.chapters.map((c) => c.map((v) => v.trim()));
  fs.writeFileSync(path.join(outDir, `${n}.json`), JSON.stringify(chapters));
  const verses = chapters.reduce((s, c) => s + c.length, 0);
  counts[n] = [chapters.length, verses];
  totalVerses += verses;
});

fs.writeFileSync(path.join('src', 'data', 'counts.json'), JSON.stringify(counts));
console.log(`OK: ${version} -> ${outDir} | ${totalVerses} versículos`);
