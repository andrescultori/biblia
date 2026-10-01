import { bySlug } from './data/books.js';

// Rotas por hash, para o botão voltar do navegador e os links compartilháveis funcionarem sem biblioteca:
//   #                       início (grade)
//   #joh  #joh/read         livro (e aba: summary | sheet | map | read)
//   #2ki/map/Laquis         livro, aba Mapa, lugar selecionado (nome em PT)
//   #psa/psalms/51  #psa/read/23   Salmos: aba da tabela com o salmo selecionado; leitor no capítulo
//   #timeline  #timeline/exodo     linha do tempo (e evento em foco)
//   #person  #person/davi          personagens (e pessoa)
const TABS = ['summary', 'sheet', 'map', 'psalms', 'read'];

export function parseHash(hash = location.hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').map((x) => { try { return decodeURIComponent(x); } catch { return x; } });
  const [a, b, c] = parts;
  if (a === 'timeline') return { kind: 'timeline', id: b || null };
  if (a === 'person') return { kind: 'person', id: b || null };
  if (bySlug[a]) return { kind: 'book', slug: a, tab: TABS.includes(b) ? b : 'summary', place: c || null };
  return { kind: 'home' };
}

export const hrefs = {
  home: '#',
  book: (slug, tab, place) => `#${slug}${tab && tab !== 'summary' ? `/${tab}${place ? `/${encodeURIComponent(place)}` : ''}` : ''}`,
  timeline: (id) => (id ? `#timeline/${id}` : '#timeline'),
  person: (id) => (id ? `#person/${id}` : '#person'),
};

// Navegar adiciona uma entrada ao histórico (o botão voltar funciona). Trocar o hash pela mesma rota não faz nada.
export const go = (hash) => { if (location.hash !== hash && !(hash === '#' && !location.hash)) location.hash = hash; };
// Ajuste dentro da mesma página (troca de aba, lugar selecionado): atualiza o link sem criar entrada no histórico.
export const sync = (hash) => { history.replaceState(null, '', hash === '#' ? location.pathname + location.search : hash); };
