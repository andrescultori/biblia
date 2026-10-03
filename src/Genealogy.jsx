import React, { useEffect, useMemo, useRef } from 'react';
import { hierarchy, tree as d3tree } from 'd3-hierarchy';
import { bySlug } from './data/books.js';
import { pick } from './timelineUtil.js';
import BackButton from './BackButton.jsx';
import { usePageTitle } from './pageTitle.js';
import { trees, nodes, parentOf, childrenOf, personById, refsText, nodeName } from './genealogy.js';

const W = 168; // largura do nó
const H = 30; // altura do nó
const DX = 184; // distância entre colunas
const DY = 46; // distância entre gerações
const SPLIT = 34;
const COLOR = { mt: 'var(--s-evangelhos)', lc: 'var(--s-atos)' };

function build(id) {
  return { id, kids: childrenOf(id).map((l) => build(l.to)) };
}

// Página da árvore genealógica: SVG vertical (d3-hierarchy), com painel de detalhe (referências, notas, página do personagem).
export default function Genealogy({ lang, t, treeId, focusNode, onOpenBook, onOpenPerson, onSelect }) {
  const tr = trees.find((x) => x.id === treeId) ?? trees[0];
  const sel = focusNode && nodes[focusNode] ? focusNode : null;
  const svgRef = useRef(null);

  const layout = useMemo(() => {
    const root = hierarchy(build(tr.root), (d) => d.kids);
    d3tree().nodeSize([DX, DY]).separation(() => 1)(root);
    const all = root.descendants();
    all.forEach((n) => { if (nodes[n.data.id].branch) n.y += SPLIT; }); // espaço para o título de cada ramo
    const xs = all.map((n) => n.x);
    return { all, links: root.links(), minX: Math.min(...xs) - W / 2 - 8, maxX: Math.max(...xs) + W / 2 + 8, maxY: Math.max(...all.map((n) => n.y)) + H + 12 };
  }, [tr]);

  usePageTitle([sel && nodeName(sel, lang), pick(tr.title, lang), t.genealogy], t.title);
  useEffect(() => {
    if (!sel) return;
    const el = svgRef.current?.querySelector(`[data-node="${sel}"]`);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [sel, tr]);

  const select = (id) => onSelect(tr.id, id);
  const color = (id) => COLOR[nodes[id].branch] ?? 'var(--muted)';
  const branchStart = {};
  for (const n of layout.all) { const b = nodes[n.data.id].branch; if (b && !branchStart[b]) branchStart[b] = n; }

  const link = sel ? parentOf(sel) : null;
  const kids = sel ? childrenOf(sel) : [];
  const person = sel && nodes[sel].personId ? personById[nodes[sel].personId] : null;
  const branchName = (id) => { const b = nodes[id].branch; return b ? pick(tr.branches[b], lang) : null; };

  return (
    <div className="page wide" role="region" aria-labelledby="gn-title">
      <div className="sheet" style={{ '--c': 'var(--s-atos)' }}>
        <div className="head">
          <div className="ttl">
            <h2 id="gn-title">{pick(tr.title, lang)}</h2>
            <p>{t.genealogy}</p>
          </div>
          <div className="head-actions">
            <a className="ghost" href="#person">{t.people}</a>
            <BackButton t={t} />
          </div>
        </div>
        <div className="body">
          <p className="pp-summary">{pick(tr.intro, lang)}</p>
          <p className="tl-warn">{pick(tr.note, lang)}</p>
          <div className="gn-wrap">
            <div className="gn-tree">
              <svg ref={svgRef} className="gn-svg" viewBox={`${layout.minX} -34 ${layout.maxX - layout.minX} ${layout.maxY + 34}`} role="group" aria-label={pick(tr.title, lang)}>
                {layout.links.map((l) => (
                  <path key={l.target.data.id} className="gn-link" stroke={color(l.target.data.id)}
                    d={`M${l.source.x},${l.source.y + H} V${(l.source.y + H + l.target.y) / 2} H${l.target.x} V${l.target.y}`} />
                ))}
                {Object.entries(branchStart).map(([b, n]) => (
                  <text key={b} className="gn-branch" x={n.x} y={n.y - 7} textAnchor="middle" fill={COLOR[b]}>{pick(tr.branches[b], lang)}</text>
                ))}
                {layout.all.map((n) => {
                  const id = n.data.id;
                  const on = id === sel;
                  return (
                    <g key={id} data-node={id} className={`gn-node${on ? ' on' : ''}`} transform={`translate(${n.x - W / 2},${n.y})`}
                      role="button" tabIndex={0} aria-pressed={on} aria-label={nodeName(id, lang)}
                      onClick={() => select(id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(id); } }}>
                      <rect width={W} height={H} rx="6" stroke={color(id)} />
                      <text x={W / 2} y={H / 2 + 5} textAnchor="middle">{nodeName(id, lang)}</text>
                      {nodes[id].note && <circle className="gn-dot" cx={W - 8} cy={8} r="3.5" />}
                    </g>
                  );
                })}
              </svg>
            </div>

            <aside className="gn-panel" aria-live="polite">
              {!sel && <p className="tl-warn">{t.treeHint}</p>}
              {sel && (
                <div className="tl-detail">
                  <h3>{nodeName(sel, lang)}</h3>
                  {branchName(sel) && <p className="tl-warn">{branchName(sel)}</p>}
                  {person && <button type="button" className="ghost" onClick={() => onOpenPerson(person.id)}>{t.treePersonPage}</button>}
                  {link && (
                    <>
                      <h4>{t.treeParent}</h4>
                      <p>
                        <button type="button" className="tl-chip" style={{ '--c': color(link.from) }} onClick={() => select(link.from)}>{nodeName(link.from, lang)}</button>
                        {' '}<small>{refsText(link.refs, lang)}</small>
                      </p>
                      {link.mother && (
                        <p>{t.treeMother}: {personById[link.mother] ? (
                          <button type="button" className="tl-chip" style={{ '--c': 'var(--s-atos)' }} onClick={() => onOpenPerson(link.mother)}>{pick(personById[link.mother].name, lang)}</button>
                        ) : link.mother}</p>
                      )}
                      {link.note && <p className="tl-warn">{pick(link.note, lang)}</p>}
                    </>
                  )}
                  {kids.length > 0 && (
                    <>
                      <h4>{t.treeChildren}</h4>
                      <div className="tl-chips">
                        {kids.map((k) => (
                          <button key={k.to} type="button" className="tl-chip" style={{ '--c': color(k.to) }} onClick={() => select(k.to)}>{nodeName(k.to, lang)}</button>
                        ))}
                      </div>
                    </>
                  )}
                  {nodes[sel].note && <p className="tl-warn gn-note">{pick(nodes[sel].note, lang)}</p>}
                  {link && (
                    <>
                      <h4>{t.treeRead}</h4>
                      <div className="tl-chips">
                        {[...new Set(link.refs.map((r) => r.book))].map((b) => (
                          <button key={b} type="button" className="tl-chip" style={{ '--c': `var(--s-${bySlug[b].section})` }} onClick={() => onOpenBook(b)}>{bySlug[b].name[lang]}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
