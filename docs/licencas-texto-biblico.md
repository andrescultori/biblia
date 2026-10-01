# Licenças do texto bíblico

Levantamento feito em 01/10/2026 a partir das páginas oficiais citadas abaixo. Os termos podem mudar e não substituem confirmação por escrito. Decisões de licença são do André.

## Situação por versão

| Versão | Idioma | Situação | O que fazer |
|---|---|---|---|
| KJV | EN | Domínio público | Já no site. |
| WEB (World English Bible) | EN | Domínio público | Candidata. Confirmar a fonte antes de adicionar. |
| ASV (American Standard Version, 1901) | EN | Domínio público | Candidata. Confirmar a fonte. |
| TB (Tradução Brasileira) | PT | Domínio público, segundo o repositório `damarals/biblias` | Candidata. Confirmar em fonte primária. |
| Almeida 1911 (ALM1911) | PT | Domínio público, segundo o mesmo repositório | Candidata. Conferir qual edição é e se é a de 1898 ou outra. |
| Bíblia Livre (BLIVRE) | PT | O repositório a lista como domínio público; o projeto fala em "licença livre" sem detalhar na página consultada | Verificar a licença exata e se permite redistribuir. |
| ARC (SBB, 1995) | PT | **Com direitos** (SBB) | Não adicionar. A edição original de 1898 é de domínio público, mas as revisões da SBB não. |
| ARA, NAA, NTLH | PT | **Com direitos** (SBB) | Só com autorização escrita. |
| ACF | PT | Com direitos (Sociedade Bíblica Trinitariana do Brasil) | Não adicionar. |
| NVI | PT | Com direitos (Biblica) | Não adicionar. |
| NKJV | EN | Com direitos (Thomas Nelson / HarperCollins Christian Publishing) | Ver abaixo. |
| ESV | EN | Com direitos (Crossway) | Ver abaixo. |

Atenção: a "ARC" que os aplicativos costumam mostrar é a revisão da SBB de 1995, que tem direitos. Só a edição original de 1898 é de domínio público.

## SBB (ARA e NAA): como pedir autorização

O termo de uso da SBB (EULA) permite uso pessoal e sem fins lucrativos, como leitura, cultos, estudo bíblico e atividades educacionais, e exige autorização prévia por escrito para uso comercial. Proíbe copiar, distribuir ou modificar sem permissão. Não encontrei regras para integrar o texto em site de terceiros nem limites de versículos.

Passo a passo:
1. O pedido é do André, como projeto pessoal (não é da UniMissional). Dizer isso no e-mail. Se algum dia for pedido em nome da UniMissional, isso precisa ser decidido por ele e dito de forma explícita.
2. Escrever para **direitos@sbb.org.br** (endereço indicado no EULA para pedidos de autorização), com cópia para **contato@sbb.org.br**.
3. Informar: quem é o solicitante, o projeto (TaBíblia Interativa), o endereço do site e do repositório, e que é gratuito, sem anúncios, sem venda e para estudo bíblico.
4. Dizer exatamente o que quer: quais versões (ARA, NAA), exibição por capítulo, sem botão de download, texto servido do próprio site ou por API, idiomas da interface.
5. Pedir resposta por escrito com: autorização ou negativa, condições, texto exato do aviso de direitos autorais que deve aparecer e prazo de validade.
6. Sem resposta em cerca de 10 dias úteis, ligar para (11) 4195-9590 ou usar o WhatsApp 800-727-8888, ambos listados em sbb.org.br/fale-conosco.
7. Não publicar o texto antes da autorização escrita. Guardar a resposta no repositório (por exemplo em `docs/`) e exibir o aviso exigido no rodapé.

## ESV (Crossway)

- Citação livre: até 500 versículos, sem passar de 50% de qualquer livro e sem ser 25% ou mais do texto total da obra.
- O texto completo da ESV **não pode ser hospedado** no site. Pelo que as páginas mostram, o cache local é limitado a 500 versículos.
- A API gratuita (api.esv.org) é só para uso **não comercial**: sem cobrança de acesso, anúncios ou patrocínio. Limites informados: 60 requisições por minuto, 1.000 por hora e 5.000 por dia; até 500 versículos (ou meio livro) por consulta; o texto não pode ser alterado.
- A ESV não pode ser traduzida nem citada em obra publicada sob licença Creative Commons.
- Aviso exigido: "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved."
- Licenças acima desse limite são pedidas pelo formulário em crossway.org/permissions/digital/, e a política citada é licenciar a organizações, não a indivíduos. Como este é um projeto pessoal, o caminho realista é só a API gratuita não comercial, se valer a pena.
- Consequência técnica: a chave da API ficaria exposta em um site estático. Seria preciso um proxy serverless pequeno, o que foge do "sem backend". Avaliar custo e se vale a pena antes de qualquer trabalho.

## NKJV (HarperCollins Christian Publishing / Thomas Nelson)

- Citação livre: até 500 versículos, sem ser livro completo e sem passar de 25% do texto da obra.
- Um site com a Bíblia inteira está fora desse limite e exige permissão escrita. Pedido pelo formulário em harpercollinschristian.com/permissions ou por correio ao Departamento de Permissões (P.O. Box 141000, Nashville, TN 37214).
- Aviso exigido: "Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved."
- Não encontrei API gratuita oficial. Provavelmente não vale o esforço agora.

## Ordem sugerida
1. Agora: adicionar versões com licença clara (WEB, ASV, TB, Almeida 1911, e Bíblia Livre se a licença confirmar).
2. Em paralelo: pedido da SBB para ARA e NAA.
3. Depois: ESV via API só se houver proxy simples e o uso for não comercial.
4. NKJV: deixar de fora por enquanto.

## Fontes consultadas
- SBB, termo de uso (EULA): sbb.org.br/acordo-de-licenca-de-usuario-final-eula
- SBB, contato: sbb.org.br/fale-conosco
- Crossway, permissões: crossway.org/permissions
- ESV API: api.esv.org
- NKJV, termos de citação (StudyLight): studylight.org/site-resources/copyright-statements/eng/nkj.html
- Situação das versões em português: github.com/damarals/biblias (informação de terceiros, a confirmar em fonte primária)
