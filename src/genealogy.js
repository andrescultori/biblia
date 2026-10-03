import g from './data/genealogia.json';
import { people } from './data/people.json';
import { bySlug } from './data/books.js';
import { pick } from './timelineUtil.js';

// Genealogia: nós e ligações pai → filho (cada ligação com referências bíblicas). Usada pela página da árvore e pelo bloco "Família" do personagem.
export const { trees, nodes } = g;
export const personById = Object.fromEntries(people.map((p) => [p.id, p]));

const parentLink = {};
const childLinks = {};
for (const l of g.links) {
  parentLink[l.to] = l;
  (childLinks[l.from] ??= []).push(l);
}
export const parentOf = (id) => parentLink[id] ?? null;
export const childrenOf = (id) => childLinks[id] ?? [];
export const nodesOfPerson = (personId) => Object.keys(nodes).filter((id) => nodes[id].personId === personId);
export const treeOf = (nodeId) => trees.find((tr) => nodeId === tr.root || hasAncestor(nodeId, tr.root)) ?? trees[0];
function hasAncestor(id, root) {
  for (let l = parentLink[id]; l; l = parentLink[l.from]) if (l.from === root) return true;
  return false;
}

// "Gn 5:3 · Lc 3:38"
export const refsText = (refs, lang) => refs.map((r) => `${bySlug[r.book].ab[lang]} ${r.ref}`).join(' · ');
export const nodeName = (id, lang) => pick(nodes[id].name, lang);
