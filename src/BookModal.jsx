import React, { useEffect, useRef, useState } from 'react';
import { BOOKS, SECTIONS } from './data/books.js';
import { VERSIONS, loadBook } from './data/bible.js';

export default function BookModal({ book, lang, t, onClose, onNavigate }) {
  const ref = useRef(null);
  const [tab, setTab] = useState('summary');
  const section = SECTIONS.find((s) => s.id === book.section);
  const prev = BOOKS[book.n - 2];
  const next = BOOKS[book.n];

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    const handle = () => onClose();
    d?.addEventListener('close', handle);
    return () => { d?.removeEventListener('close', handle); if (d?.open) d.close(); };
  }, []);

  const facts = [
    [t.testament, t[book.testament]],
    [t.section, section[lang]],
    [t.chapters, book.chapters],
    [t.verses, book.verses.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')],
    [t.position, `${book.n} ${t.of} 66`],
  ];

  return (
    <dialog
      ref={ref}
      className="modal"
      style={{ '--c': `var(--s-${book.section})` }}
      onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}
      aria-labelledby="book-title"
    >
      <div className="sheet">
        <div className="head">
          <div className="badge"><span>{book.n}</span><b>{book.ab[lang]}</b></div>
          <div className="ttl">
            <h2 id="book-title">{book.name[lang]}</h2>
            <p>{section[lang]}</p>
          </div>
          <button type="button" className="ghost close" onClick={() => ref.current.close()} aria-label={t.close}>✕</button>
        </div>

        <div className="seg tabs" role="tablist">
          {['summary', 'read'].map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} aria-pressed={tab === k} onClick={() => setTab(k)}>{t[k]}</button>
          ))}
        </div>

        <div className="body">
          {tab === 'summary' && (
            <>
              <dl className="facts">
                {facts.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
              </dl>
              <p className="soon">{t.soon}</p>
            </>
          )}
          {tab === 'read' && <Reader book={book} lang={lang} t={t} />}
        </div>

        <div className="foot">
          <button type="button" className="ghost" disabled={!prev} onClick={() => prev && onNavigate(prev.slug)}>← {prev ? prev.name[lang] : ''}</button>
          <button type="button" className="ghost" disabled={!next} onClick={() => next && onNavigate(next.slug)}>{next ? next.name[lang] : ''} →</button>
        </div>
      </div>
    </dialog>
  );
}

function Reader({ book, lang, t }) {
  const versions = VERSIONS.filter((v) => v.available);
  const [version, setVersion] = useState(versions.find((v) => v.lang === lang)?.id ?? versions[0].id);
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null); setError(false);
    loadBook(version, book.n).then((d) => alive && setData(d)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [version, book.n]);

  const hasLangVersion = versions.some((v) => v.lang === lang);
  const verses = data?.[chapter - 1];

  return (
    <div className="reader">
      {!hasLangVersion && t.noPtText && <p className="soon">{t.noPtText}</p>}
      <div className="row">
        <label htmlFor="ver">{t.version}</label>
        <select id="ver" value={version} onChange={(e) => setVersion(e.target.value)}>
          {versions.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
        <label htmlFor="chap">{t.chapter}</label>
        <select id="chap" value={chapter} onChange={(e) => setChapter(Number(e.target.value))}>
          {Array.from({ length: book.chapters }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
        </select>
      </div>
      {error && <p className="soon">{t.loadError}</p>}
      {!error && !verses && <p className="soon">{t.loading}</p>}
      {verses && (
        <div className="text" lang={VERSIONS.find((v) => v.id === version).lang}>
          {verses.map((v, i) => (<p key={i}><sup>{i + 1}</sup>{v}</p>))}
        </div>
      )}
      {verses && (
        <div className="row pager">
          <button type="button" className="ghost" disabled={chapter <= 1} onClick={() => setChapter(chapter - 1)}>←</button>
          <span>{book.name[lang]} {chapter}</span>
          <button type="button" className="ghost" disabled={chapter >= book.chapters} onClick={() => setChapter(chapter + 1)}>→</button>
        </div>
      )}
    </div>
  );
}
