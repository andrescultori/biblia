import React, { useEffect, useMemo, useState } from 'react';
import { BOOKS, SECTIONS, bySlug } from './data/books.js';
import { LANGS, T } from './i18n.js';
import BookModal from './BookModal.jsx';

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
  const t = T[lang];

  useEffect(() => { document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'; store.set('lang', lang); }, [lang]);
  useEffect(() => {
    const r = document.documentElement;
    if (theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', theme);
    store.set('theme', theme);
  }, [theme]);
  useEffect(() => {
    const onHash = () => setOpenSlug(bySlug[location.hash.slice(1)] ? location.hash.slice(1) : null);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const open = (slug) => { history.replaceState(null, '', `#${slug}`); setOpenSlug(slug); };
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

      {openSlug && <BookModal key={openSlug} book={bySlug[openSlug]} lang={lang} t={t} onClose={close} onNavigate={open} />}
    </>
  );
}
