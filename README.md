# TaBíblia Interativa

**PT** · Tabela interativa dos 66 livros da Bíblia, inspirada na ideia da "tabela periódica" bíblica. Cada livro abre uma ficha de estudo e o texto para leitura. Interface em português e inglês.

**EN** · An interactive table of the 66 books of the Bible. Each book opens a study sheet and the text for reading. Interface in Portuguese and English.

## Estado atual / Current status

- [x] Grade dos 66 livros por seção, busca e filtro por testamento
- [x] Ficha com dados básicos (testamento, seção, capítulos, versículos)
- [x] Leitor de texto: KJV, WEB e ASV (inglês); Bíblia Livre e Almeida 1911 (português)
- [x] Tema claro/escuro, PT/EN
- [x] Ficha completa dos 66 livros, PT e EN (autor, data, local, personagens, esboço, tema, contexto, conexões). A revisão de conteúdo é manual e segue em andamento
- [x] Aba Mapa com legenda e zoom, em 46 dos 66 livros (livros sem `map` na ficha não mostram a aba)
- [ ] Personagens: estrutura pronta, 66 personagens (em crescimento)
- [x] Linha do tempo: 13 períodos e 44 eventos (AT e NT); datas e notas aguardam a revisão do André
- [ ] ARA e NAA (aguardam autorização da SBB)

## Rodar localmente

```bash
npm install
npm run dev
npm run check   # confere fichas, mapas e textos
npm run build
```

Todo pull request roda `npm run check` e `npm run build` (`.github/workflows/ci.yml`). O deploy no Pages só acontece no push para a `main`.

## Dados do texto bíblico

Os textos ficam em `public/bible/<versão>/<n>.json` (n = 1..66, ordem canônica). Cada arquivo é um array de capítulos, e cada capítulo é um array em que a posição *i* guarda o versículo *i + 1*. Versículo que a versão não tem (por exemplo, os que a ASV omite) fica `null`, para a numeração continuar certa.

| Id | Versão | Licença | Fonte do arquivo |
|---|---|---|---|
| `kjv` | King James Version | Domínio público | [thiagobodruk/bible](https://github.com/thiagobodruk/bible) (`json/en_kjv.json`), com o espaço antes da pontuação removido e 40 notas de margem retiradas (`scripts/data/kjv-fixes.json`) |
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
- `label` (opcional) é `[dx, dy, âncora]` em pixels e vale como primeira tentativa de posição do rótulo. O mapa testa outras 8 posições sozinho para não sobrepor outros rótulos, pins e bordas; o lugar selecionado sempre mostra o rótulo, e os que não acharem espaço ficam sem rótulo (o nome continua na lista).
- Quando há 3 ou mais lugares muito próximos (1,5° ou menos), aparece o botão **Ampliar região**, que reenquadra o grupo do lugar selecionado (ou o grupo mais denso). Escolher na lista um lugar fora do grupo volta à visão completa. O botão também aparece quando todos os lugares cabem numa área menor que a visão mínima (5,5° × 3,6°), como nos livros históricos.
- `route: true` liga os lugares na ordem listada, em linha simplificada (não é o trajeto exato).
- Confira cada coordenada no OpenBible antes de publicar e marque a incerteza. Critério usado nos mapas: `uncertain: true` se o melhor candidato do OpenBible tem menos de 400 pontos, se o segundo tem mais de 40% da pontuação do primeiro, ou se há 5 ou mais candidatos; regiões e nomes alternativos recebem a incerteza do lugar a que se referem.

## Créditos

- Costa: [Natural Earth](https://www.naturalearthdata.com/) (domínio público), pelo pacote `world-atlas`, recortada e simplificada.
- Lugares do mapa: [OpenBible.info Bible Geocoding Data](https://www.openbible.info/geo/), licença [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Coordenadas arredondadas e adaptadas.
- Projeção: [d3-geo](https://github.com/d3/d3-geo) (ISC).
- Textos: WEB ([eBible.org](https://ebible.org/eng-web/), domínio público); ASV (domínio público, edição digital de [openbibleinfo](https://github.com/openbibleinfo/American-Standard-Version-Bible)); Almeida 1911 (domínio público, [Project Gutenberg nº 62383](https://www.gutenberg.org/ebooks/62383)); **Bíblia Livre (BLIVRE), © 2018 Diego Santos, Mario Sérgio e Marco Teles, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**, [fonte](https://github.com/blivre/BibliaLivre).

Ideia original da tabela: "TaBíblia Periódica" (Grupo de Jovens Conquistando as Nações; fonte indicada: Sociedade Bíblica do Brasil). Este projeto tem design e código próprios.

## Linha do tempo

O botão **Linha do tempo** abre um modal com duas camadas: (1) períodos e eventos da história bíblica e (2) os livros ligados a cada período. Dados em `src/data/timeline.json`; componente em `src/Timeline.jsx`.

- Anos são inteiros: negativo = a.C., positivo = d.C. (não existe o ano 0). `approx: true` mostra "c.".
- `dates` é `{start, end?, approx?, note?}` ou, quando a datação é debatida, `{traditional: {...}, scholarly: {...}}` (as duas leituras aparecem lado a lado, como nas fichas).
- A **escala muda por bloco** (`blocks[].ppy` = pixels por ano); períodos curtos ganham largura mínima. A tela avisa disso.
- Livros ligados a um período seguem o **cenário que o próprio texto descreve**, não a data de composição. Livros de datação ou ambientação debatida, poéticos e de sabedoria ficam de fora (a tela lista quais).
- Evento com `attested: true` tem data também atestada por fonte fora da Bíblia (marcado com ◆). `npm run check` valida anos, ordem dos períodos, livros e referências. A base de cada data está em `docs/linha-do-tempo-fontes.md`.
- **Ligação com o mapa:** um evento pode ter `places: [{ "book": "2ki", "name": "Laquis", "en": "Lachish" }]`, com `name` igual ao nome em PT do lugar no mapa da ficha daquele livro (`npm run check` confere, inclusive o `en`). O evento mostra botões "Ver no mapa" e o lugar, no mapa, lista os eventos ligados a ele. Link direto: `#timeline/<id-do-evento>`.

## Personagens

O botão **Personagens** abre um modal com a lista (busca e filtro por livro) e, para cada pessoa, o resumo, os livros onde aparece (com o papel em cada um), os eventos da linha do tempo e os lugares do mapa. Dados em `src/data/people.json`; componente em `src/People.jsx`. Links diretos: `#person` e `#person/<id>`.

```json
{ "id": "davi", "name": { "pt": "Davi", "en": "David" }, "summary": { "pt": "...", "en": "..." },
  "books": [{ "book": "1sa", "role": { "pt": "...", "en": "..." } }],
  "events": ["davi"],
  "places": [{ "book": "2sa", "name": "Hebrom", "en": "Hebron" }],
  "note": { "pt": "...", "en": "..." } }
```

- `events` usa os ids de `timeline.json`; `places` usa o nome em PT do lugar no mapa da ficha daquele livro (e o `en` igual). `npm run check` confere ids únicos, livros, eventos, lugares e PT/EN.
- O evento da linha do tempo lista as pessoas ligadas a ele e o lugar do mapa também.
- O resumo se limita ao que o texto bíblico diz. Pessoas distintas de mesmo nome têm ids distintos (`josue`, `josue-sacerdote`). Genealogia ainda não faz parte.

## Configurações

O botão ⚙ abre as preferências de estudo, guardadas no navegador (`localStorage`). Por enquanto: **mostrar a posição acadêmica** (padrão: ligado). Desligada, a ficha mostra só a posição tradicional de autoria e datação, e a linha do tempo só a leitura tradicional das datas. O aviso de que a outra posição existe fica só na própria tela de Configurações. Em Personagens, a lista pode ser ordenada A–Z ou por livro (lembrada no navegador).
