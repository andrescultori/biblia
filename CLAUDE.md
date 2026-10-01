# TaBíblia Interativa (repo `biblia`)

Tabela interativa dos 66 livros da Bíblia (inspirada no "TaBíblia Periódica"), com ficha de estudo e leitor de texto, para uso público em estudo bíblico. Stack: React 18 + Vite, sem backend. Publicação: GitHub Pages via GitHub Actions.

## Como trabalhar (preferências do André)
- Em repositório existente: diagnostique antes de aplicar e espere confirmação. Decisões de mérito (nomes, licenças, o que publicar, conteúdo teológico) são dele.
- Pode abrir PR sem pedir confirmação. O merge continua sendo do André.
- Respostas diretas e objetivas. Aprofunde só quando pedido.
- Prefira soluções que reduzam custo operacional (sem APIs pagas nem serviços que cobrem por uso).
- Se outra ferramenta do ecossistema Claude servir melhor a uma tarefa, diga.

## Estrutura
- `src/data/books.js`: os 66 livros (slug, siglas e nomes PT/EN, seção, testamento). A ordem canônica é o número do livro (1 a 66), igual ao nome dos arquivos de texto.
- `src/data/counts.json`: capítulos e versículos por livro. É gerado pelo script, não editar à mão.
- `src/data/bible.js`: versões de texto disponíveis e carregamento por livro.
- `public/bible/<versão>/<n>.json`: texto por livro (array de capítulos, cada capítulo é um array de versículos).
- `scripts/build-bible-data.mjs`: gera os dois itens acima a partir de um JSON de origem.
- `src/i18n.js`: textos da interface (PT/EN). Novo idioma = nova chave em `T` e em `LANGS`.
- `src/BookModal.jsx`: modal do livro (abas Resumo e Ler). `src/App.jsx`: grade, filtros, tema, idioma, link direto por hash (`#joh`).

## Regras de conteúdo
- Texto bíblico em português só entra com licença clara. ARA e NAA pertencem à Sociedade Bíblica do Brasil (SBB) e aguardam autorização (contato do termo de uso: direitos@sbb.org.br). A KJV é de domínio público. Só a edição original de 1898 da ARC é de domínio público; a ARC da SBB (1995) tem direitos.
- Antes de adicionar qualquer versão, leia `docs/licencas-texto-biblico.md` (situação de cada versão, regras da SBB, ESV e NKJV) e confirme a licença em fonte primária. Mostre a evidência ao André e espere a confirmação dele.
- Fichas dos livros: nunca inventar dados. Onde autoria, data ou local forem debatidos, registrar as posições e marcar a incerteza. Versículo-chave guarda só a referência; o texto vem do leitor.
- Não reproduzir a arte do TaBíblia Periódica original. O design deste projeto é próprio.

## Decisões em aberto
- Atos está na seção "Evangelhos e Atos" (como na imagem original). Alternativa: seção própria.
- Versões em português: ARA e NAA aguardam autorização da SBB (André vai pedir). Enquanto isso, adicionar só versões com licença clara (ver `docs/licencas-texto-biblico.md`).
- ESV e NKJV: avaliadas, não adicionadas. ESV só via API não comercial e exigiria proxy; NKJV exige permissão escrita.

## Roadmap
1. Publicar o repositório e o GitHub Pages.
2. Fichas completas por livro, revisadas por seção (começando pela Lei): autor, data, local, destinatários, versículo-chave, tema, contexto histórico, personagens, esboço, conexões.
3. Mapa: costa em vetor com d3 (sem tiles externos) e linha do tempo. A demo aprovada está em `docs/map-demo/` (abrir `mapa-biblico.html`; o README explica a origem dos dados e como implementar no app).
4. Páginas de personagens bíblicos e outros conteúdos.

## Comandos
- `npm install` e `npm run dev`: desenvolvimento.
- `npm run build`: build de produção em `dist/`.
- `node scripts/build-bible-data.mjs kjv caminho/en_kjv.json`: regenera os dados da KJV (fonte: github.com/thiagobodruk/bible, `json/en_kjv.json`).
