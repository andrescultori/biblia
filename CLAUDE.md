# TaBíblia Interativa (repo `biblia`)

Tabela interativa dos 66 livros da Bíblia (inspirada no "TaBíblia Periódica"), com ficha de estudo e leitor de texto, para uso público em estudo bíblico. Stack: React 18 + Vite, sem backend. Publicação: GitHub Pages via GitHub Actions.

## Como trabalhar (preferências do André)
- Este é um projeto pessoal do André, não da UniMissional. Só trate como da UniMissional (nome, instituição, contas, licenças em nome dela) quando ele pedir isso de forma explícita.
- Em repositório existente: diagnostique antes de aplicar e espere confirmação. Decisões de mérito (nomes, licenças, o que publicar, conteúdo teológico) são dele.
- Pode abrir PR sem pedir confirmação. O merge continua sendo do André.
- Respostas diretas e objetivas. Aprofunde só quando pedido.
- Prefira soluções que reduzam custo operacional (sem APIs pagas nem serviços que cobrem por uso).
- Se outra ferramenta do ecossistema Claude servir melhor a uma tarefa, diga.

## Estrutura
- `src/data/books.js`: os 66 livros (slug, siglas e nomes PT/EN, seção, testamento). A ordem canônica é o número do livro (1 a 66), igual ao nome dos arquivos de texto.
- `src/data/counts.json`: capítulos e versículos por livro. É gerado pelo script, não editar à mão.
- `src/data/bible.js`: versões de texto disponíveis (com crédito e licença mostrados no leitor) e carregamento por livro. Dentro de cada idioma, a primeira da lista é a padrão.
- `public/bible/<versão>/<n>.json`: texto por livro (array de capítulos; cada capítulo é um array em que a posição i é o versículo i+1; versículo ausente na versão é `null`).
- `scripts/build-bible-data.mjs`: gera o texto por livro a partir da fonte de cada versão (`kjv`, `web`, `asv`, `alm1911`, `blivre`). Só a KJV recalcula `counts.json` e aplica `scripts/data/kjv-fixes.json` (notas de margem removidas da fonte).
- `src/i18n.js`: textos da interface (PT/EN). Novo idioma = nova chave em `T` e em `LANGS`.
- `src/data/info/<slug>.json`: ficha de cada livro (PT/EN), com a chave opcional `map` (lugares do mapa; formato no README).
- `src/data/land.json`: costa em vetor (Natural Earth 50m, recortada). Não editar à mão.
- `src/MapView.jsx`: aba Mapa (d3-geo, SVG em pixels reais). Carregada sob demanda.
- `src/BookModal.jsx`: modal do livro (abas Resumo, Ficha, Mapa e Ler). `src/App.jsx`: grade, filtros, tema, idioma, link direto por hash (`#joh`).

## Regras de conteúdo
- Texto bíblico em português só entra com licença clara. ARA e NAA pertencem à Sociedade Bíblica do Brasil (SBB) e aguardam autorização (contato do termo de uso: direitos@sbb.org.br). A KJV é de domínio público. Só a edição original de 1898 da ARC é de domínio público; a ARC da SBB (1995) tem direitos.
- Antes de adicionar qualquer versão, leia `docs/licencas-texto-biblico.md` (situação de cada versão, regras da SBB, ESV e NKJV) e confirme a licença em fonte primária. Mostre a evidência ao André e espere a confirmação dele.
- Fichas dos livros: nunca inventar dados. Onde autoria, data ou local forem debatidos, registrar as posições e marcar a incerteza. Versículo-chave guarda só a referência; o texto vem do leitor.
- Lugares do mapa: coordenadas do OpenBible (CC BY 4.0, atribuição visível na aba e no README). Localização debatida leva `uncertain: true`. Não inventar coordenadas.
- Não reproduzir a arte do TaBíblia Periódica original. O design deste projeto é próprio.

## Decisões em aberto
- Atos está na seção "Evangelhos e Atos" (como na imagem original). Alternativa: seção própria.
- Versões em português: no site, Bíblia Livre (CC BY 4.0, atribuição obrigatória) e Almeida 1911. ARA e NAA aguardam autorização da SBB (André vai pedir). TB não entra (a SBB declara copyright sobre a edição de 2010). ARC de 1898: sem fonte digital confiável. Detalhes em `docs/licencas-texto-biblico.md`.
- ESV e NKJV: avaliadas, não adicionadas. ESV só via API não comercial e exigiria proxy; NKJV exige permissão escrita.

## Roadmap
1. Publicar o repositório e o GitHub Pages. **Feito.**
2. Fichas completas por livro: autor, data, local, destinatários, versículo-chave, tema, contexto histórico, personagens, esboço, conexões. **Rascunho dos 66 livros pronto**; a revisão do André é manual e segue em andamento (pontos de atenção: autoria das cartas do NT, datação de Daniel, versículos-chave, traduções em EN).
3. Mapa: costa em vetor com d3 (sem tiles externos). **Aba pronta** (demo em `docs/map-demo/`); os lugares entram por seção, livro a livro, com revisão do André. **Linha do tempo: pendente.**
4. Textos: **KJV, WEB, ASV, Bíblia Livre e Almeida 1911 no site.** Pendentes: ARA e NAA (autorização da SBB) e, se aparecer fonte confiável, a ARC de 1898.
5. Páginas de personagens bíblicos e outros conteúdos.

## Comandos
- `npm install` e `npm run dev`: desenvolvimento.
- `npm run check`: confere fichas (campos PT/EN, referências de capítulo), lugares do mapa (coordenadas dentro da costa, nome repetido) e textos bíblicos (66 livros, capítulos iguais aos da KJV, null só onde falta versículo). Rode antes de abrir PR.
- `npm run build`: build de produção em `dist/`. O CI (`.github/workflows/ci.yml`) roda `check` e `build` em todo PR.
- `node scripts/build-bible-data.mjs <id> <caminho-da-fonte>`: regenera os dados de uma versão. Fontes e formatos no README (seção "Dados do texto bíblico").
