# TaBíblia Interativa

**PT** · Tabela interativa dos 66 livros da Bíblia, inspirada na ideia da "tabela periódica" bíblica. Cada livro abre uma ficha de estudo e o texto para leitura. Interface em português e inglês.

**EN** · An interactive table of the 66 books of the Bible. Each book opens a study sheet and the text for reading. Interface in Portuguese and English.

## Estado atual / Current status

- [x] Grade dos 66 livros por seção, busca e filtro por testamento
- [x] Ficha com dados básicos (testamento, seção, capítulos, versículos)
- [x] Leitor de texto (KJV)
- [x] Tema claro/escuro, PT/EN
- [ ] Ficha completa por livro (autor, data, local, personagens, esboço, tema, contexto, conexões)
- [ ] Mapa e linha do tempo
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

## Créditos

Ideia original da tabela: "TaBíblia Periódica" (Grupo de Jovens Conquistando as Nações; fonte indicada: Sociedade Bíblica do Brasil). Este projeto tem design e código próprios.
