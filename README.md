# TaBíblia Interativa

**PT** · Tabela interativa dos 66 livros da Bíblia, inspirada na ideia da "tabela periódica" bíblica. Cada livro abre uma ficha de estudo e o texto para leitura. Interface em português e inglês.

**EN** · An interactive table of the 66 books of the Bible. Each book opens a study sheet and the text for reading. Interface in Portuguese and English.

## Estado atual / Current status

- [x] Grade dos 66 livros por seção, busca e filtro por testamento
- [x] Ficha com dados básicos (testamento, seção, capítulos, versículos)
- [x] Leitor de texto (KJV)
- [x] Tema claro/escuro, PT/EN
- [ ] Ficha completa por livro (autor, data, local, personagens, esboço, tema, contexto, conexões)
- [x] Aba Mapa por livro, com costa vetorial e lugares da ficha (Êxodo, Atos e Apocalipse; demais livros em andamento)
- [ ] Linha do tempo
- [ ] Texto em português (aguardando definição de licença)

## Rodar localmente

```bash
npm install
npm run dev
```

## Dados do texto bíblico

Os textos ficam em `public/bible/<versão>/<n>.json` (n = 1..66, ordem canônica). Para regenerar a KJV:

```bash
# fonte: https://github.com/thiagobodruk/bible (json/en_kjv.json)
node scripts/build-bible-data.mjs kjv caminho/para/en_kjv.json
```

O script também recalcula `src/data/counts.json` (capítulos e versículos por livro).

Para adicionar uma versão: gerar os arquivos na mesma estrutura e registrar em `src/data/bible.js`. **Antes de publicar qualquer tradução, confirme a licença.** A KJV é de domínio público; ARA e NAA pertencem à Sociedade Bíblica do Brasil.

## Publicar no GitHub Pages

Settings → Pages → Source: *GitHub Actions*. O workflow em `.github/workflows/deploy.yml` faz o build a cada push na `main`.

## Mapa

A aba **Mapa** do modal aparece nos livros cuja ficha (`src/data/info/<slug>.json`) tem a chave `map`. O desenho usa `d3-geo` sobre a costa em `src/data/land.json`, sem tiles externos. O visual segue a demo aprovada em `docs/map-demo/`.

```json
"map": {
  "route": true,
  "note": { "pt": "...", "en": "..." },
  "places": [
    { "name": { "pt": "Monte Sinai", "en": "Mount Sinai" }, "lonLat": [33.97, 28.54],
      "note": { "pt": "...", "en": "..." }, "ref": "19–20", "uncertain": true, "label": [10, 4, "start"] }
  ]
}
```

- `lonLat` é `[longitude, latitude]`, com duas casas decimais. `ref` guarda só a referência, sem a sigla do livro.
- `uncertain: true` desenha o pin tracejado e marca "?" no rótulo. Use para localização debatida.
- `label` (opcional) é `[dx, dy, âncora]` em pixels, para evitar sobreposição de rótulos. O rótulo vai para o lado oposto sozinho se não couber.
- `route: true` liga os lugares na ordem listada, em linha simplificada (não é o trajeto exato).
- Confira cada coordenada no OpenBible antes de publicar e marque a incerteza.

## Créditos

- Costa: [Natural Earth](https://www.naturalearthdata.com/) (domínio público), pelo pacote `world-atlas`, recortada e simplificada.
- Lugares do mapa: [OpenBible.info Bible Geocoding Data](https://www.openbible.info/geo/), licença [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Coordenadas arredondadas e adaptadas.
- Projeção: [d3-geo](https://github.com/d3/d3-geo) (ISC).

Ideia original da tabela: "TaBíblia Periódica" (Grupo de Jovens Conquistando as Nações; fonte indicada: Sociedade Bíblica do Brasil). Este projeto tem design e código próprios.
