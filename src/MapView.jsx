import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import land from './data/land.json';

// Nomes de mares exibidos como rótulos de fundo.
const WATERS = [
  { name: { pt: 'Mar Mediterrâneo', en: 'Mediterranean Sea' }, c: [19, 34.3] },
  { name: { pt: 'Mar Negro', en: 'Black Sea' }, c: [34, 43.3] },
  { name: { pt: 'Mar Vermelho', en: 'Red Sea' }, c: [35.4, 24] },
  { name: { pt: 'Mar Egeu', en: 'Aegean Sea' }, c: [25.2, 39.7], small: true },
];

const pickText = (v, lang) => (v && typeof v === 'object' ? v[lang] ?? v.en : v);

// Se o rótulo não cabe no lado definido, passa para o lado oposto do pin.
function labelPos(x, label, text, fontSize, W) {
  let [dx, dy, anchor] = label ?? [8, -8, 'start'];
  const width = text.length * fontSize * 0.6;
  if (anchor === 'start' && x + dx + width > W - 4) { dx = -dx; anchor = 'end'; }
  else if (anchor === 'end' && x + dx - width < 4) { dx = -dx; anchor = 'start'; }
  return [dx, dy, anchor];
}

// Largura do contêiner em pixels. O SVG é desenhado em pixels reais para o texto manter o tamanho no celular.
function useWidth(ref) {
  const [w, setW] = useState(640);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setW(Math.max(240, Math.round(el.clientWidth)));
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export default function MapView({ book, map, lang, t }) {
  const boxRef = useRef(null);
  const [sel, setSel] = useState(0);
  const W = useWidth(boxRef);
  const H = Math.round(W < 480 ? W * 0.9 : W / 1.5);
  const places = map.places;

  const { projection, landPath } = useMemo(() => {
    const lons = places.map((p) => p.lonLat[0]);
    const lats = places.map((p) => p.lonLat[1]);
    const cx = (Math.min(...lons) + Math.max(...lons)) / 2;
    const cy = (Math.min(...lats) + Math.max(...lats)) / 2;
    // extensão mínima para a costa não parecer recortada
    const dx = Math.max(Math.max(...lons) - Math.min(...lons), 5.5);
    const dy = Math.max(Math.max(...lats) - Math.min(...lats), 3.6);
    const box = { type: 'MultiPoint', coordinates: [[cx - dx / 2, cy - dy / 2], [cx + dx / 2, cy + dy / 2]] };
    const padX = Math.min(50, Math.round(W * 0.1));
    const padY = W < 480 ? 28 : 40;
    const proj = geoMercator().fitExtent([[padX, padY], [W - padX, H - padY]], box);
    return { projection: proj, landPath: geoPath(proj)(land) };
  }, [places, W, H]);

  const routePath = useMemo(
    () => (map.route ? geoPath(projection)({ type: 'LineString', coordinates: places.map((p) => p.lonLat) }) : null),
    [map.route, places, projection],
  );

  const color = `var(--s-${book.section})`;
  const choose = (i) => setSel(i);
  const onKey = (i) => (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(i); } };

  return (
    <div className="mapview" style={{ '--c': color }}>
      <div className="mapbox" ref={boxRef}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`${t.mapAria}: ${book.name[lang]}`}>
          <path className="land" d={landPath} />
          {WATERS.map((w) => {
            const [x, y] = projection(w.c);
            const fs = w.small ? 9 : 11;
            const half = (w.name[lang].length * fs * 0.85) / 2; // maiúsculas com espaçamento entre letras
            if (x - half <= 4 || x + half >= W - 4 || y <= 20 || y >= H - 20) return null;
            return <text key={w.name.en} className="water" x={x} y={y} textAnchor="middle" fontSize={fs}>{w.name[lang]}</text>;
          })}
          {routePath && <path className="route" d={routePath} stroke={color} />}
          {places.map((p, i) => {
            const [x, y] = projection(p.lonLat);
            const name = pickText(p.name, lang);
            const text = name + (p.uncertain ? ' ?' : '');
            const fs = W < 480 ? 11.5 : 12.5;
            const [dx, dy, anchor] = labelPos(x, p.label, text, fs, W);
            return (
              <g key={name} className="spot" role="button" tabIndex={0} aria-pressed={i === sel}
                aria-label={`${name}${p.uncertain ? `, ${t.mapUncertain}` : ''}`}
                onClick={() => choose(i)} onKeyDown={onKey(i)}>
                <circle className="hit" cx={x} cy={y} r={16} />
                <circle className="pin" cx={x} cy={y} r={i === sel ? 9 : 6} fill={color} strokeDasharray={p.uncertain ? '3 2' : undefined} />
                <text className="lbl" x={x + dx} y={y + dy} textAnchor={anchor} style={{ fontSize: fs }}>{text}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mplaces">
        {places.map((p, i) => (
          <button key={pickText(p.name, lang)} type="button" className="place" aria-current={i === sel} onClick={() => choose(i)}>
            <b>{pickText(p.name, lang)}{p.uncertain ? ' ?' : ''}</b>
            <span>{pickText(p.note, lang)}</span>
            <small>{book.ab[lang]} {p.ref}</small>
          </button>
        ))}
      </div>

      {map.note && <p className="mapnote">{pickText(map.note, lang)}</p>}
      <p className="mapnote">
        {t.mapUncertainHelp} {t.mapCoast} <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a>. {t.mapPlaces}{' '}
        <a href="https://www.openbible.info/geo/" target="_blank" rel="noreferrer">OpenBible.info</a> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>). {t.mapApprox}
      </p>
    </div>
  );
}
