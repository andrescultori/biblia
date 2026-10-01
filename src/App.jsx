import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BOOKS, SECTIONS, bySlug } from './data/books.js';
import { LANGS, T } from './i18n.js';
import BookModal from './BookModal.jsx';

// Linha do tempo só carrega quando aberta.
const Timeline = lazy(() => import('./Timeline.jsx'));
const People = lazy(() => import('./People.jsx'));

const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignora */ } },
};

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function App() {
  const [lang, setLang] = useState(() => store.get('lang', navigator.language?.startsWith('en') ? 'en' : 'pt'));
  const [theme, setTheme] = useState(() => store.get('theme', 'auto')); // auto | light | dark
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [openSlug, setOpenSlug] = useState(() => (bySlug[location.hash.slice(1)] ? location.hash.slice(1) : null));
  // Linha do tempo: null (fechada) ou { id } (id opcional do evento em foco). Hash: #timeline ou #timeline/<evento>.
  const hashTimeline = () => (location.hash.startsWith('#timeline') ? { id: location.hash.split('/')[1] ?? null } : null);
  const [timeline, setTimeline] = useState(hashTimeline);
  // Personagens: null (fechado) ou { id } (id opcional da pessoa). Hash: #person ou #person/<id>.
  const hashPeople = () => (location.hash.startsWith('#person') ? { id: location.hash.split('/')[1] ?? null } : null);
  const [peopleView, setPeopleView] = useState(hashPeople);
  // Livro aberto direto numa aba/lugar (vindo da linha do tempo): { tab, place }.
  const [bookOpts, setBookOpts] = useState(null);
  const t = T[lang];

  useEffect(() => { document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'; store.set('lang', lang); }, [lang]);
  useEffect(() => {
    const r = document.documentElement;
    if (theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', theme);
    store.set('theme', theme);
  }, [theme]);
  useEffect(() => {
    const onHash = () => {
      setOpenSlug(bySlug[location.hash.slice(1)] ? location.hash.slice(1) : null);
      setTimeline(hashTimeline());
      setPeopleView(hashPeople());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const open = (slug, opts = null) => { history.replaceState(null, '', `#${slug}`); setTimeline(null); setPeopleView(null); setBookOpts(opts); setOpenSlug(slug); };
  const openMap = (slug, place) => open(slug, { tab: 'map', place });
  const openTimeline = (id = null) => { history.replaceState(null, '', id ? `#timeline/${id}` : '#timeline'); setOpenSlug(null); setPeopleView(null); setTimeline({ id }); };
  const openPerson = (id = null) => { history.replaceState(null, '', id ? `#person/${id}` : '#person'); setOpenSlug(null); setTimeline(null); setPeopleView({ id }); };
  const closePeople = () => { history.replaceState(null, '', location.pathname + location.search); setPeopleView(null); };
  const closeTimeline = () => { history.replaceState(null, '', location.pathname + location.search); setTimeline(null); };
  const close = () => { history.replaceState(null, '', location.pathname + location.search); setOpenSlug(null); };

  const groups = useMemo(() => {
    const q = norm(query.trim());
    return SECTIONS.map((s) => ({
      ...s,
      books: BOOKS.filter((b) => b.section === s.id
        && (filter === 'all' || b.testament === filter)
        && (!q || norm(b.name.pt).includes(q) || norm(b.name.en).includes(q) || norm(b.ab.pt).includes(q) || norm(b.ab.en).includes(q))),
    })).filter((g) => g.books.length);
  }, [filter, query]);

  const cycleTheme = () => setTheme((x) => (x === 'auto' ? 'dark' : x === 'dark' ? 'light' : 'auto'));

  return (
    <>
      <header className="top">
        <div className="brand">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="tools">
          <div className="seg" role="group" aria-label="Idioma / Language">
            {LANGS.map((l) => (
              <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
            ))}
          </div>
          <button type="button" className="ghost" onClick={cycleTheme} aria-label={t.theme} title={`${t.theme}: ${theme}`}>
            {theme === 'auto' ? 'Auto' : theme === 'dark' ? '☾' : '☀'}
          </button>
        </div>
      </header>

      <main>
        <div className="controls">
          <div className="seg" role="group">
            {['all', 'at', 'nt'].map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{t[f]}</button>
            ))}
          </div>
          <button type="button" className="ghost" onClick={() => openTimeline()}>{t.timeline}</button>
          <button type="button" className="ghost" onClick={() => openPerson()}>{t.people}</button>
          <input type="search" id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search} />
        </div>

        {groups.length === 0 && <p className="empty">{t.noResults}</p>}
        {groups.map((g) => (
          <section key={g.id} className="group" style={{ '--c': `var(--s-${g.id})` }}>
            <h2><i aria-hidden="true" />{g[lang]}<span>{g.books.length}</span></h2>
            <div className="tiles">
              {g.books.map((b) => (
                <button key={b.slug} type="button" className="tile" onClick={() => open(b.slug)} aria-label={b.name[lang]}>
                  <span className="num">{b.n}</span>
                  <span className="ab">{b.ab[lang]}</span>
                  <span className="nm">{b.name[lang]}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
        <p className="note">{t.legendNote}</p>
      </main>

      {timeline && (
        <Suspense fallback={null}>
          <Timeline key={timeline.id ?? ''} lang={lang} t={t} focusId={timeline.id} onClose={closeTimeline} onOpenBook={open} onOpenMap={openMap} onOpenPerson={openPerson} />
        </Suspense>
      )}
      {peopleView && (
        <Suspense fallback={null}>
          <People key={peopleView.id ?? ''} lang={lang} t={t} focusId={peopleView.id} onClose={closePeople} onOpenBook={open} onOpenTimeline={openTimeline} onOpenMap={openMap} />
        </Suspense>
      )}
      {openSlug && <BookModal key={openSlug} book={bySlug[openSlug]} lang={lang} t={t} initial={bookOpts} onClose={close} onNavigate={(slug) => open(slug)} onOpenTimeline={openTimeline} onOpenPerson={openPerson} />}
    </>
  );
}
