import React, { useState } from 'react';
import { useSettings } from './settings.js';
import { hrefs, go } from './route.js';

const COLORS = ['lei', 'historicos', 'poesia', 'profMaiores', 'profMenores', 'evangelhos', 'atos', 'paulo', 'outras'];
const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] ?? v.en : v);

// Estrutura do livro: cada capítulo colorido pela parte (ou pela voz, em Jó) em que predomina, a lista das partes e, quando há, as leituras.
export default function StructureView({ book, structure, lang, t }) {
  const { showScholarly } = useSettings();
  const [sel, setSel] = useState(null);
  const { parts, voices, note, readings } = structure;
  const colorIdx = (p, i) => (p.voice ? voices.findIndex((v) => v.id === p.voice) : i);
  const color = (p, i) => `var(--s-${COLORS[colorIdx(p, i) % COLORS.length]})`;
  const partOf = new Map(parts.flatMap((p, i) => p.chapters.map((c) => [c, i])));
  const shown = (readings ?? []).filter((r) => showScholarly || r.view !== 'scholarly');

  return (
    <div className="structure">
      {voices && (
        <div className="tl-chips ps-legend">
          {voices.map((v, i) => <span key={v.id} className="tl-chip" style={{ '--c': `var(--s-${COLORS[i % COLORS.length]})` }}>{pick(v.name, lang)}</span>)}
        </div>
      )}
      <div className="ps-grid" role="group" aria-label={t.structure}>
        {Array.from({ length: book.chapters }, (_, k) => k + 1).map((c) => {
          const i = partOf.get(c);
          return (
            <button key={c} type="button" className="ps-tile" aria-pressed={sel === i} style={{ '--c': color(parts[i], i), opacity: sel === null || sel === i ? 1 : 0.3 }}
              aria-label={`${book.name[lang]} ${c}`} title={pick(parts[i].title, lang)} onClick={() => setSel(sel === i ? null : i)}>{c}</button>
          );
        })}
      </div>
      {note && <p className="tl-scalenote">{pick(note, lang)}</p>}

      <ol className="st-parts">
        {parts.map((p, i) => (
          <li key={p.ref} aria-current={sel === i}>
            <button type="button" className="st-part" style={{ '--c': color(p, i) }} onClick={() => setSel(sel === i ? null : i)}>
              <span className="st-ref">{book.ab[lang]} {p.ref}</span>
              <span>{pick(p.title, lang)}</span>
            </button>
            {sel === i && (
              <button type="button" className="ghost st-read" onClick={() => go(hrefs.book(book.slug, 'read', String(p.chapters[0])))}>{t.structureRead} {p.chapters[0]}</button>
            )}
          </li>
        ))}
      </ol>

      {shown.length > 0 && (
        <section className="st-readings">
          <h4>{t.structureReadings}</h4>
          {shown.map((r) => (
            <div key={r.name.pt} className="st-reading">
              <p><b>{pick(r.name, lang)}</b>{r.view && <i> · {t[r.view]}</i>}</p>
              <p>{pick(r.summary, lang)}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
