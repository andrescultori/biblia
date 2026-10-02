// Gera src/data/people-index.json: versão enxuta de people.json (id, nome, livros) usada para ligar nomes nas fichas
// sem carregar os resumos e bios de todos os personagens. Rode depois de mudar people.json: node scripts/build-people-index.mjs
import fs from 'node:fs';

export function buildIndex() {
  const { people } = JSON.parse(fs.readFileSync('src/data/people.json', 'utf8'));
  return people.map((p) => ({ id: p.id, name: p.name, books: p.books.map((b) => b.book) }));
}

if (process.argv[1].endsWith('build-people-index.mjs')) {
  fs.writeFileSync('src/data/people-index.json', JSON.stringify(buildIndex()) + '\n');
  console.log('src/data/people-index.json atualizado');
}
