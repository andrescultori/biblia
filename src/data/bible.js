// Versões de texto. `available` = arquivos presentes em public/bible/<id>/.
// DECISÃO PENDENTE (André): versões em português dependem de licença (SBB: ARA/NAA) ou de uma base de domínio público.
export const VERSIONS = [
  { id: 'kjv', lang: 'en', label: 'KJV', full: 'King James Version', available: true },
];

const cache = new Map();

export async function loadBook(version, n) {
  const key = `${version}/${n}`;
  if (!cache.has(key)) {
    const p = fetch(`${import.meta.env.BASE_URL}bible/${version}/${n}.json`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
    cache.set(key, p);
    p.catch(() => cache.delete(key));
  }
  return cache.get(key);
}
