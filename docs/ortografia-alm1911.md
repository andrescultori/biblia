# Almeida 1911 com ortografia atualizada (piloto)

A Almeida de 1911 é de domínio público, mas a grafia da época (`elle`, `creou`, `n'elle`, `principio`, `ph`/`th`) estranha ao leitor de hoje. Esta versão (`alm1911a`) **atualiza só a ortografia**: não troca palavras e não é uma revisão oficial do texto.

## Como funciona

`scripts/modernize-alm1911.mjs` lê o texto de `damarals/biblias` (`data/canonical/ALM1911/`) e, palavra por palavra:

1. usa a lista de exceções `scripts/data/alm1911-ortografia.json` (100 palavras: nomes próprios e casos difíceis, como `paes → pais`, `jacob → jacó`, `á → à`);
2. deixa como está toda palavra conhecida na grafia moderna (o vocabulário vem da Bíblia Livre, `public/bible/blivre/`);
3. aplica regras de grafia (`ph→f`, `th→t`, `ll→l`, `ct→t`, `aes→ais`, `eos→eus`…) e só aceita o resultado se ele existir no vocabulário moderno ou se a regra for inequívoca;
4. restaura acentos (`agua → água`, `misericordia → misericórdia`) pelo vocabulário moderno;
5. junta contrações (`n'elle → nele`, `d'elle → dele`, `d'Israel → de Israel`) e ajusta pronomes colados ao verbo (`matal-o → matá-lo`, `vol-o → vo-lo`).

Para gerar ou regenerar livros: `node scripts/modernize-alm1911.mjs <pasta ALM1911 do damarals/biblias> <n>...` (por exemplo `19 43`). O script imprime o relatório de **todas as trocas** e das **palavras que ficaram sem solução**.

## Estado

- Livros do piloto: **Salmos (19) e João (43)**, listados em `books` na entrada `alm1911a` de `src/data/bible.js`. Nos demais livros a versão não aparece.
- Ampliar para os outros livros é rodar o script com mais números e acrescentar exceções conforme o relatório.

## Limites conhecidos

- A decisão "palavra já moderna" usa o vocabulário da Bíblia Livre; palavras corretas que não aparecem nele ficam como estão (o certo, na maioria).
- Palavras que existem hoje com outro sentido e acento (`esta`/`está`, `vira`/`virá`) não são trocadas automaticamente.
- Nomes próprios seguem a grafia que a Almeida atual usa (`Jacó`, `Davi`, `Judá`, `Filipe`). A lista está em `scripts/data/alm1911-ortografia.json` para revisão.
