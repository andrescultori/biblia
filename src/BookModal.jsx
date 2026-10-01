import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { BOOKS, SECTIONS } from './data/books.js';
import { VERSIONS, loadBook } from './data/bible.js';
import { useSettings } from './settings.js';
import { hrefs, sync } from './route.js';

// Fichas carregadas sob demanda: cada src/data/info/<slug>.json vira um chunk separado.
const INFO = import.meta.glob('./data/info/*.json');
const hasInfo = (slug) => `./data/info/${slug}.json` in INFO;

// Mapa (d3-geo + costa) só carrega quando a aba é aberta.
const MapView = lazy(() => import('./MapView.jsx'));

function useInfo(slug) {
  const [state, setState] = useState({ info: null, error: false });
  useEffect(() => {
    let alive = true;
    setState({ info: null, error: false });
    const load = INFO[`./data/info/${slug}.json`];
    if (load) load().then((m) => alive && setState({ info: m.default, error: false })).catch(() => alive && setState({ info: null, error: true }));
    return () => { alive = false; };
  }, [slug]);
  return state;
}

export default function BookModal({ book, lang, t, initialTab, initialPlace, onNavigate, onOpenTimeline, onOpenPerson }) {
  const [tab, setTabState] = useState(initialTab ?? 'summary');
  // a aba e o lugar ficam no link (compartilhável), sem criar entrada no histórico
  const setTab = (k) => { setTabState(k); sync(hrefs.book(book.slug, k)); };
  const section = SECTIONS.find((s) => s.id === book.section);
  const prev = BOOKS[book.n - 2];
  const next = BOOKS[book.n];
  const { info, error: infoError } = useInfo(book.slug);
  const tabs = ['summary', 'sheet', ...(info?.map ? ['map'] : []), 'read'];

  const facts = [
    [t.testament, t[book.testament]],
    [t.section, section[lang]],
    [t.chapters, book.chapters],
    [t.verses, book.verses.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')],
    [t.position, `${book.n} ${t.of} 66`],
  ];

  return (
    <div className="page" style={{ '--c': `var(--s-${book.section})` }} role="region" aria-labelledby="book-title">
      <div className="sheet">
        <div className="head">
          <div className="badge"><span>{book.n}</span><b>{book.ab[lang]}</b></div>
          <div className="ttl">
            <h2 id="book-title">{book.name[lang]}</h2>
            <p>{section[lang]}</p>
          </div>
          <a className="ghost back" href={hrefs.home}>← {t.home}</a>
        </div>

        <div className="seg tabs" role="tablist">
          {tabs.map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} aria-pressed={tab === k} onClick={() => setTab(k)}>{t[k]}</button>
          ))}
        </div>

        <div className="body">
          {tab === 'summary' && (
            <>
              <dl className="facts">
                {facts.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
              </dl>
              {!hasInfo(book.slug) && <p className="soon">{t.soon}</p>}
            </>
          )}
          {tab === 'sheet' && <Sheet book={book} lang={lang} t={t} info={info} error={infoError} />}
          {tab === 'map' && info?.map && (
            <Suspense fallback={<p className="soon">{t.loading}</p>}>
              <MapView book={book} map={info.map} lang={lang} t={t} initialPlace={initialPlace} onPlaceChange={(name) => sync(hrefs.book(book.slug, 'map', name))} onOpenTimeline={onOpenTimeline} onOpenPerson={onOpenPerson} />
            </Suspense>
          )}
          {tab === 'read' && <Reader book={book} lang={lang} t={t} />}
        </div>

        <div className="foot">
          <button type="button" className="ghost" disabled={!prev} onClick={() => prev && onNavigate(prev.slug)}>← {prev ? prev.name[lang] : ''}</button>
          <button type="button" className="ghost" disabled={!next} onClick={() => next && onNavigate(next.slug)}>{next ? next.name[lang] : ''} →</button>
        </div>
      </div>
    </div>
  );
}

const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] ?? v.en : v);

function Sheet({ book, lang, t, info, error }) {
  const { showScholarly } = useSettings();
  if (!hasInfo(book.slug)) return <p className="soon">{t.soon}</p>;
  if (error) return <p className="soon">{t.loadError}</p>;
  if (!info) return <p className="soon">{t.loading}</p>;

  const ref = (r) => `${book.ab[lang]} ${r}`;
  const view = (pair) => (
    <>
      <p><b>{t.traditional}.</b> {pick(pair.traditional, lang)}</p>
      {showScholarly && <p><b>{t.scholarly}.</b> {pick(pair.scholarly, lang)}</p>}
    </>
  );
  const text = (label, v) => (<section><h3>{label}</h3><p>{pick(v, lang)}</p></section>);

  return (
    <div className="sheetinfo">
      <section><h3>{t.author}</h3>{view(info.author)}</section>
      <section><h3>{t.date}</h3>{view(info.date)}</section>
      {text(t.place, info.place)}
      {text(t.recipients, info.recipients)}
      <section><h3>{t.keyVerse}</h3><p>{ref(info.keyVerse)}</p></section>
      {text(t.theme, info.theme)}
      {text(t.historicalContext, info.historicalContext)}
      <section>
        <h3>{t.characters}</h3>
        <ul>{info.characters.map((c, i) => (<li key={i}><b>{pick(c.name, lang)}</b>: {pick(c.role, lang)}</li>))}</ul>
      </section>
      <section>
        <h3>{t.outline}</h3>
        <ol className="outline">{info.outline.map((o, i) => (<li key={i}><span>{ref(o.ref)}</span> {pick(o.title, lang)}</li>))}</ol>
      </section>
      {text(t.connections, info.connections)}
      <p className="note">{t.sheetNote}</p>
    </div>
  );
}

const LANG_NAME = { pt: 'Português', en: 'English' };

// Versão preferida por idioma, lembrada entre livros e visitas (localStorage pode falhar; o leitor funciona sem ele).
const readPref = (lang) => { try { return localStorage.getItem(`ver:${lang}`); } catch { return null; } };
const writePref = (lang, id) => { try { localStorage.setItem(`ver:${lang}`, id); } catch { /* ignora */ } };

// Prioriza o idioma da interface: preferida salva, senão a primeira versão desse idioma.
function pickVersion(versions, lang) {
  const inLang = versions.filter((v) => v.lang === lang);
  return (inLang.find((v) => v.id === readPref(lang)) ?? inLang[0] ?? versions[0]).id;
}

function Reader({ book, lang, t }) {
  const versions = VERSIONS.filter((v) => v.available && (!v.books || v.books.includes(book.n)));
  const [version, setVersion] = useState(() => pickVersion(versions, lang));
  const [chapter, setChapter] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null); setError(false);
    loadBook(version, book.n).then((d) => alive && setData(d)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [version, book.n]);

  const current = versions.find((v) => v.id === version);
  const groups = [lang, ...Object.keys(LANG_NAME).filter((l) => l !== lang)]
    .map((l) => [l, versions.filter((v) => v.lang === l)]).filter(([, vs]) => vs.length);
  const verses = data?.[chapter - 1];

  const choose = (id) => {
    setVersion(id);
    writePref(versions.find((v) => v.id === id).lang, id);
  };

  return (
    <div className="reader">
      <div className="row">
        <label htmlFor="ver">{t.version}</label>
        <select id="ver" value={version} onChange={(e) => choose(e.target.value)} title={current.full}>
          {groups.map(([l, vs]) => (
            <optgroup key={l} label={LANG_NAME[l]}>
              {vs.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
            </optgroup>
          ))}
        </select>
        <label htmlFor="chap">{t.chapter}</label>
        <select id="chap" value={chapter} onChange={(e) => setChapter(Number(e.target.value))}>
          {Array.from({ length: book.chapters }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
        </select>
      </div>
      {error && <p className="soon">{t.loadError}</p>}
      {!error && !verses && <p className="soon">{t.loading}</p>}
      {verses && (
        // O número vem da posição: versículo que a versão não tem é null e fica sem texto, sem deslocar os seguintes.
        <div className="text" lang={current.lang}>
          {verses.map((v, i) => (v === null ? null : <p key={i}><sup>{i + 1}</sup>{v}</p>))}
        </div>
      )}
      {verses && (
        <div className="row pager">
          <button type="button" className="ghost" disabled={chapter <= 1} onClick={() => setChapter(chapter - 1)}>←</button>
          <span>{book.name[lang]} {chapter}</span>
          <button type="button" className="ghost" disabled={chapter >= book.chapters} onClick={() => setChapter(chapter + 1)}>→</button>
        </div>
      )}
      <div className="credit">
        <p>
          {pick(current.credit, lang)} {pick(current.license, lang)}
          {current.licenseUrl && <> (<a href={current.licenseUrl} target="_blank" rel="noreferrer">{t.verLicense}</a>)</>}.
          {current.sourceUrl && <> <a href={current.sourceUrl} target="_blank" rel="noreferrer">{t.verSource}</a>.</>}
        </p>
        {current.note && <p>{pick(current.note, lang)}</p>}
      </div>
    </div>
  );
}
