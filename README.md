# TaBíblia Interativa

**PT** · Tabela interativa dos 66 livros da Bíblia, inspirada na ideia da "tabela periódica" bíblica. Cada livro abre uma ficha de estudo e o texto para leitura. Interface em português e inglês.

**EN** · An interactive table of the 66 books of the Bible. Each book opens a study sheet and the text for reading. Interface in Portuguese and English.

## Estado atual / Current status

- [x] Grade dos 66 livros por seção, busca e filtro por testamento
- [x] Ficha com dados básicos (testamento, seção, capítulos, versículos)
- [x] Leitor de texto: KJV, WEB e ASV (inglês); Bíblia Livre e Almeida 1911 (português)
- [x] Tema claro/escuro, PT/EN
- [ ] Ficha completa por livro (autor, data, local, personagens, esboço, tema, contexto, conexões)
- [x] Aba Mapa por livro, com costa vetorial e lugares da ficha (Êxodo, Atos e Apocalipse; demais livros em andamento)
- [ ] Linha do tempo
- [ ] ARA e NAA (aguardam autorização da SBB)

## Rodar localmente

```bash
npm install
npm run dev
```

## Dados do texto bíblico

Os textos ficam em `public/bible/<versão>/<n>.json` (n = 1..66, ordem canônica). Cada arquivo é um array de capítulos, e cada capítulo é um array em que a posição *i* guarda o versículo *i + 1*. Versículo que a versão não tem (por exemplo, os que a ASV omite) fica `null`, para a numeração continuar certa.

| Id | Versão | Licença | Fonte do arquivo |
|---|---|---|---|
| `kjv` | King James Version | Domínio público | [thiagobodruk/bible](https://github.com/thiagobodruk/bible) (`json/en_kjv.json`) |
| `web` | World English Bible | Domínio público | [seven1m/open-bibles](https://github.com/seven1m/open-bibles) (`eng-web.usfx.xml`, do eBible.org) |
| `asv` | American Standard Version (1901) | Domínio público | [openbibleinfo/American-Standard-Version-Bible](https://github.com/openbibleinfo/American-Standard-Version-Bible) (`usx-english-only/`) |
| `blivre` | Bíblia Livre (2018) | CC BY 4.0 (atribuição obrigatória) | [damarals/biblias](https://github.com/damarals/biblias) (`data/canonical/BLIVRE/`) |
| `alm1911` | Almeida, edição de 1911 | Domínio público | [damarals/biblias](https://github.com/damarals/biblias) (`data/canonical/ALM1911/`; texto do Project Gutenberg nº 62383) |

Para regenerar uma versão, passe o id e o caminho da fonte baixada:

```bash
node scripts/build-bible-data.mjs web caminho/para/eng-web.usfx.xml
node scripts/build-bible-data.mjs asv caminho/para/usx-english-only
node scripts/build-bible-data.mjs blivre caminho/para/data/canonical/BLIVRE
```

Só a KJV recalcula `src/data/counts.json` (capítulos e versículos por livro), que é a referência de numeração do site.

Para adicionar uma versão: incluir o formato da fonte em `scripts/build-bible-data.mjs`, gerar os arquivos, registrar em `src/data/bible.js` (nome, idioma, crédito e licença; o leitor mostra o crédito) e documentar a evidência em `docs/licencas-texto-biblico.md`. **Antes de publicar qualquer tradução, confirme a licença em fonte primária.** ARA, NAA, NVI, ACF, ESV, NKJV e a ARC da SBB (1995) têm direitos e não estão no site.

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
- Textos: WEB ([eBible.org](https://ebible.org/eng-web/), domínio público); ASV (domínio público, edição digital de [openbibleinfo](https://github.com/openbibleinfo/American-Standard-Version-Bible)); Almeida 1911 (domínio público, [Project Gutenberg nº 62383](https://www.gutenberg.org/ebooks/62383)); **Bíblia Livre (BLIVRE), © 2018 Diego Santos, Mario Sérgio e Marco Teles, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**, [fonte](https://github.com/blivre/BibliaLivre).

Ideia original da tabela: "TaBíblia Periódica" (Grupo de Jovens Conquistando as Nações; fonte indicada: Sociedade Bíblica do Brasil). Este projeto tem design e código próprios.
