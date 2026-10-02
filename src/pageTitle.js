import { useEffect } from 'react';

// Título da aba do navegador por página: "João · Mapa · TaBíblia Interativa". Sem argumento, volta ao título da página inicial.
export function usePageTitle(parts, base, enabled = true) {
  const key = parts.filter(Boolean).join(' · ');
  useEffect(() => {
    if (!enabled) return;
    document.title = key ? `${key} · ${base}` : base;
  }, [key, base, enabled]);
}
