# Demo do mapa (aprovada)

`mapa-biblico.html` é uma página única e autônoma que mostra como será a aba de mapa da ficha de cada livro. Abra no navegador (precisa de internet só para carregar o d3 pela CDN).

## O que a demo define
- Mapa vetorial desenhado com **d3** (`d3.geoMercator` + `d3.geoPath`), **sem tiles externos**: leve, sem custo e funciona offline.
- Três livros de exemplo: Êxodo, Atos e Apocalipse. Troca de livro por botões; clicar em um pin ou no cartão da lista destaca o lugar.
- Enquadramento automático dos pontos do livro (`fitExtent`), com extensão mínima para a costa não ficar recortada.
- Cor do pin = cor da seção do livro (mesmos tokens de `src/styles.css`).
- Tema claro e escuro por variáveis de cor (`--sea`, `--land`, `--coast`, `--halo`).
- Lugares de localização debatida aparecem com contorno tracejado e "?" no rótulo (ex.: Mar dos Juncos).
- Rotas são linhas simplificadas entre cidades, não o trajeto exato.

## Origem dos dados da costa
- Natural Earth 50m (terra), pelo pacote npm `world-atlas` (`land-50m.json`), convertido para GeoJSON com `topojson-client`.
- Recortado para a região (lon -12 a 72, lat -2 a 52) e simplificado (tolerância 0,012) com `shapely`; coordenadas arredondadas a 2 casas. Resultado: cerca de 56 KB embutidos no HTML.
- Coordenadas dos lugares são aproximadas. Antes de publicar um mapa real, conferir cada lugar e marcar incertezas.

## Para implementar no app
- Guardar a geometria da costa como arquivo próprio (por exemplo `src/data/land.json`) e os lugares de cada livro no JSON da ficha (`src/data/info/<slug>.json`), com `name`, `lonLat`, `note`, `ref` e `uncertain`.
- Carregar o d3 como dependência npm (importar só `d3-geo` e `d3-selection` basta).
