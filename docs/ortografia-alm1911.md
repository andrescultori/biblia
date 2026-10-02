# Almeida 1911 com ortografia atualizada

A Almeida de 1911 é de domínio público, mas a grafia da época (`elle`, `creou`, `n'elle`, `principio`, `ph`/`th`) estranha ao leitor de hoje. Esta versão (`alm1911a`) **atualiza só a ortografia**: não troca palavras e não é uma revisão oficial do texto.

## Como funciona

`scripts/modernize-alm1911.mjs` lê o texto de `damarals/biblias` (`data/canonical/ALM1911/`) e, palavra por palavra:

1. usa as listas de `scripts/data/alm1911-ortografia.json`: `palavras` (exceções feitas à mão, como `paes → pais`, `oleo → óleo`, `á → à`) e `nomes` (nomes próprios, como `benjamin → benjamim`, `zedekias → zedequias`; obtidos alinhando cada nome ao mesmo versículo da Bíblia Livre, só para palavras que aparecem em maiúscula no meio da frase; **revisar**);
2. deixa como está toda palavra conhecida na grafia moderna (o vocabulário vem da Bíblia Livre, `public/bible/blivre/`);
3. aplica regras de grafia (`ph→f`, `th→t`, `ll→l`, `ct→t`, `aes→ais`, `eos→eus`…) e só aceita o resultado se ele existir no vocabulário moderno ou se a regra for inequívoca;
4. restaura acentos (`agua → água`, `misericordia → misericórdia`) pelo vocabulário moderno;
5. junta contrações (`n'elle → nele`, `d'elle → dele`, `d'Israel → de Israel`) e ajusta pronomes colados ao verbo (`matal-o → matá-lo`, `vol-o → vo-lo`).

Para gerar ou regenerar livros: `node scripts/modernize-alm1911.mjs <pasta ALM1911 do damarals/biblias> <n>...` (por exemplo `19 43`). O script imprime o relatório de **todas as trocas** e das **palavras que ficaram sem solução**.

## Estado

- **Os 66 livros estão publicados** (`public/bible/alm1911a/`), gerados com `node scripts/modernize-alm1911.mjs <pasta ALM1911> $(seq 1 66)`.
- O texto é automático e **ainda não foi revisado**. O relatório do script lista as trocas e as palavras sem solução (mais de 7 mil, quase todas formas legítimas da Almeida ou combinações com pronome, como `convertel`). Correções entram em `palavras` (à mão) ou `nomes`, e o script é rodado de novo.
- Em Salmos e João a revisão do André começou antes; no restante, a revisão é por amostragem.

## Limites conhecidos

- A decisão "palavra já moderna" usa o vocabulário da Bíblia Livre; palavras corretas que não aparecem nele ficam como estão (o certo, na maioria).
- Palavras que existem hoje com outro sentido e acento (`esta`/`está`, `vira`/`virá`) não são trocadas automaticamente.
- Nomes próprios seguem a grafia que a Almeida atual usa (`Jacó`, `Davi`, `Judá`, `Filipe`). A lista está em `scripts/data/alm1911-ortografia.json` para revisão.
