// Versões de texto. `available` = arquivos presentes em public/bible/<id>/ (gerados por scripts/build-bible-data.mjs).
// Dentro de cada idioma, a primeira da lista é a padrão. Só entram versões com licença clara.
// Antes de adicionar outra, leia docs/licencas-texto-biblico.md e confirme a licença em fonte primária.
//   credit/license: texto de crédito mostrado no leitor. attributionRequired: a licença exige esse crédito.
//   note: aviso curto sobre o texto (omissões, ortografia). Versículo ausente na versão é null no JSON.
const PD = { pt: 'Domínio público', en: 'Public domain' };

export const VERSIONS = [
  {
    id: 'kjv', lang: 'en', label: 'KJV', full: 'King James Version', available: true,
    credit: { pt: 'King James Version.', en: 'King James Version.' },
    license: PD, attributionRequired: false,
  },
  {
    id: 'web', lang: 'en', label: 'WEB', full: 'World English Bible', available: true,
    credit: { pt: 'World English Bible (eBible.org).', en: 'World English Bible (eBible.org).' },
    license: PD, attributionRequired: false,
    sourceUrl: 'https://ebible.org/eng-web/',
    note: {
      pt: 'Segue o texto crítico: alguns versículos da KJV não existem (ex.: Lc 17:36) e a doxologia de Rm 16:25–27 está em Rm 14:24–26.',
      en: 'Follows the critical text: some KJV verses are absent (e.g. Luke 17:36) and the doxology of Rom 16:25–27 appears at Rom 14:24–26.',
    },
  },
  {
    id: 'asv', lang: 'en', label: 'ASV', full: 'American Standard Version (1901)', available: true,
    credit: { pt: 'American Standard Version, 1901.', en: 'American Standard Version, 1901.' },
    license: PD, attributionRequired: false,
    sourceUrl: 'https://github.com/openbibleinfo/American-Standard-Version-Bible',
    note: {
      pt: 'Omite versículos que o texto grego crítico não traz (ex.: Mt 17:21, At 8:37). Usa "Jehovah".',
      en: 'Omits verses that the critical Greek text lacks (e.g. Matt 17:21, Acts 8:37). Uses "Jehovah".',
    },
  },
  {
    id: 'blivre', lang: 'pt', label: 'BLIVRE', full: 'Bíblia Livre (2018)', available: true,
    credit: {
      pt: 'Bíblia Livre (BLIVRE), © 2018 Diego Santos, Mario Sérgio e Marco Teles.',
      en: 'Bíblia Livre (BLIVRE), © 2018 Diego Santos, Mario Sérgio and Marco Teles.',
    },
    license: { pt: 'Licença Creative Commons Atribuição 4.0 Internacional', en: 'Creative Commons Attribution 4.0 International License' },
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    attributionRequired: true,
    sourceUrl: 'https://github.com/blivre/BibliaLivre',
    note: {
      pt: 'No Novo Testamento, esta edição segue o texto crítico (Nestle 1904): alguns versículos da tradição tradicional ficam em branco (ex.: Mt 17:21).',
      en: 'In the New Testament this edition follows the critical text (Nestle 1904): some verses of the traditional text are left blank (e.g. Matt 17:21).',
    },
  },
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
