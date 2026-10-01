// Funções de data da linha do tempo, usadas pela linha do tempo e pelo mapa.
export const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] ?? v.en : v);

// Ano negativo = a.C. (BC); positivo = d.C. (AD).
export function range(d, lang) {
  const a = Math.abs(d.start);
  const bc = d.start < 0;
  const hasEnd = d.end !== undefined && d.end !== d.start;
  const c = d.approx ? 'c. ' : '';
  if (!hasEnd) return c + (lang === 'pt' ? `${a} ${bc ? 'a.C.' : 'd.C.'}` : bc ? `${a} BC` : `AD ${a}`);
  const b = Math.abs(d.end);
  const bcEnd = d.end < 0;
  if (bc === bcEnd) return c + (lang === 'pt' ? `${a}–${b} ${bc ? 'a.C.' : 'd.C.'}` : bc ? `${a}–${b} BC` : `AD ${a}–${b}`);
  return c + (lang === 'pt' ? `${a} a.C.–${b} d.C.` : `${a} BC–AD ${b}`);
}

// dates tem {start,...} ou {traditional:{...}, scholarly:{...}}
export const views = (dates) => (dates.start !== undefined ? [[null, dates]] : [['traditional', dates.traditional], ['scholarly', dates.scholarly]]);
export const main = (dates) => (dates.start !== undefined ? dates : dates.traditional);
