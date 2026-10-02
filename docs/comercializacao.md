# Comercialização: planos, hospedagem e fases

Plano de levar o projeto de site público gratuito para produto com três planos. Decisões do André estão marcadas como **[decidido]**; o que Claude assumiu para seguir está como **[assumido, confirmar]**; o que falta está em "Pendências".

## Planos

| | Free | Pro | Premium (mais para frente, com o produto consolidado) |
|---|---|---|---|
| Preço | R$0 | De R$39,90 por R$19,90 | De R$59,90 por R$29,90 |
| Cobrança | n/a | Pagamento único (vitalício) | Pagamento único (vitalício) |
| Conteúdo | Todos os livros: Resumo, Ficha, Leitura. Mapa só nos Evangelhos e em Gênesis. Estrutura só em Salmos | Tudo completo | Tudo do Pro, mais itens abaixo |

Premium (a definir o que entra): fichas em PDF (cogitado); devocionais (5 min) e "Palavras" (15 a 30 min) com IA, **com limite mensal de produções** [decidido]; plano de leitura com marcação; integração do projeto de leitura bíblica gamificada (a decidir).

## Decisões já tomadas

- **[decidido]** O **Pro é o projeto completo como está hoje**. O Free é restrito conforme a tabela acima. O Premium só entra depois, com o produto consolidado.
- **[decidido]** O **texto bíblico fica disponível em todos os planos, inclusive o Free** (importante para as licenças de uso).
- **[decidido]** A **licença do código e do conteúdo pode mudar** (hoje MIT). Atenção: mudar a licença não revoga o MIT de quem já copiou o que foi publicado; e partes de terceiros mantêm a licença original (mapas OpenBible e Bíblia Livre, CC BY 4.0, com atribuição).
- **[decidido]** Mudar a licença e **tornar o repositório privado**, **depois** de o Cloudflare Pages estar no ar: o GitHub Pages só serve repositório privado em plano pago (Pro, Team ou Enterprise) e proíbe uso para negócio online (docs.github.com, limites do GitHub Pages). O André acredita que ninguém copiou o conteúdo (0 forks, 0 estrelas em 02/10/2026).
- **[decidido]** Nova licença: **todos os direitos reservados** (código e conteúdo), mantendo a atribuição às partes de terceiros (OpenBible, Bíblia Livre; arquivo de avisos a criar). Troca do arquivo `LICENSE` junto com a mudança para repositório privado.
- **[decidido]** Divisão Free x Pro confirmada: Free = texto bíblico (todas as versões), Resumo e Ficha de todos os livros, mapa dos Evangelhos e de Gênesis, estrutura de Salmos. Pro = o resto (demais mapas, linha do tempo, personagens, Salmos completos).
- **[decidido]** O conteúdo Pro aparece no Free **"embaçado"**, com a mensagem "Disponível na versão Pro". **Regra técnica:** o embaçado é desenhado com conteúdo de mentira (esqueleto ou texto genérico). Nunca enviar o dado real ao navegador do usuário Free e escondê-lo com CSS, porque isso se desfaz pelo inspetor.
- **[decidido]** Se preciso, mudar a estrutura para manter o conteúdo privado no Supabase.
- **[decidido]** Nome ainda em aberto; o André quer algo bíblico ligado a Palavra, Estudo Bíblico ou Discípulo. "Bereia" (Atos 17) e "Bere.IA" foram avaliados e descartados por já haver apps e livraria com o nome no Brasil. Ver pendências.
- **[informado]** O André já usa o Mercado Pago no projeto LGND Checklist e a conta não exigiu domínio próprio.
- **[decidido]** Hospedagem no **Cloudflare Pages**, no endereço `nome-do-projeto.pages.dev`. **Sem domínio próprio por enquanto**: primeiro validar se vende.
- **[decidido]** Vercel descartado: o plano Hobby é restrito a uso não comercial (fonte: vercel.com/docs/limits/fair-use-guidelines).
- **[decidido]** Reescrita em **Next.js**, com **Supabase** (login, banco, regras de acesso por plano) e conteúdo Pro fora do repositório público.
- **[decidido]** Cobrança por **Mercado Pago**, com checkout hospedado por eles.
- **[decidido]** **PWA** no roadmap. Apps nas lojas (Apple e Google) ficam para depois de validar a venda.
- **[assumido, confirmar]** Free **sem login**; login só para Pro e Premium.
- **[assumido, confirmar]** Lançamento só com texto em domínio público ou CC BY (KJV, WEB, ASV, Almeida 1911 atualizada, Bíblia Livre) mais links para o YouVersion. ARA e NAA entram só com autorização por escrito (ver `docs/licencas-texto-biblico.md`).

## Restrições verificadas

- **Cloudflare, plano gratuito:** o contrato (Self-Serve Subscription Agreement, seção 2.2.1(h)) proíbe "process or collect personal or business credit card information on any web property that is receiving Free Services". Portanto **nenhum campo de cartão no site**: o pagamento acontece na página hospedada pela Asaas ou pelo Mercado Pago. A seção 2.2 inteira foi lida pelo André na fonte (01/10/2026): não há proibição geral de uso comercial. Regra de projeto: **nenhum campo de número de cartão em páginas do nosso domínio** (nem formulário embutido); o cliente digita o cartão na página do Mercado Pago. Checkout próprio com cartão exigiria plano pago da Cloudflare. Limites do Pages gratuito: 500 builds/mês, 20.000 arquivos, 25 MiB por arquivo; funções do Pages contam na cota de 100 mil requisições/dia do Workers.
- **Plano B de hospedagem: Hostinger** (hospedagem de aplicações web com Node.js, deploy pelo GitHub). O contrato de hospedagem não proíbe cobrar clientes ("responsible for collecting, and managing all end customer payments"), mas todos os planos têm limites de CPU, RAM e processos, com risco de lentidão ou suspensão. Preços da página (promocionais, com contrato de 48 meses; renovação 3 a 4 vezes maior): Premium R$10,99/mês (renova R$38,99), Unlimited R$13,99 (R$64,99), Cloud Startup R$39,99 (R$129,99); reembolso só em 30 dias. A página de planos e a documentação de suporte divergem nos nomes dos planos com Node.js; confirmar na contratação. Mantendo o Next.js estático com Supabase, a troca de host é só mudar o deploy.
- **Apple e Google (fase posterior):** compra de conteúdo premium dentro do app exige o sistema de compra da loja (Apple, diretriz 3.1.1); comissão de 15% a 30% (no Brasil, regras novas pelo acordo com o CADE, a confirmar); app que é só o site é recusado (diretriz 4.2). Conta Google pessoal nova exige teste fechado com 12 testadores por 14 dias. Conta Apple: US$99/ano.
- **Texto bíblico:** o uso comercial muda a conta das licenças (SBB, YouVersion). Ver `docs/licencas-texto-biblico.md` e a sessão dedicada a direitos.

## Fases

**0. Decisões do André (antes de tocar no código)**
- O que é Pro? As fichas, personagens, mapas e linha do tempo **já estão no repositório público sob MIT** e no histórico do git: o que já foi publicado não dá para despublicar. Definir se o Pro vende conteúdo novo, recursos (PDF, plano de leitura, IA) ou uma experiência melhor sobre o que já é aberto.
- Escolher a nova licença (código e conteúdo) e a visibilidade do repositório. Para o Free ser de fato restrito, o conteúdo Pro não pode continuar sendo servido a todos: o site atual publica todos os JSON, e o repositório público guarda tudo, inclusive no histórico.
- Nome do produto (checar INPI e lojas; "Bereia" já aparece em apps e livraria no Brasil).
- Confirmar os dois itens "assumido".

**1. Migrar o site atual para o Cloudflare Pages (sem reescrever)**
- Build `npm run build`, saída `dist`. O `base: './'` do Vite já funciona em subpasta e na raiz.
- Conectar o repositório ao Cloudflare Pages, deploy em `*.pages.dev`; GitHub Pages continua no ar até validar.
- Conferir hash (`#joh`), carregamento de `public/bible/` e fichas.

**2. Supabase: login, banco e regras de acesso**
- Tabelas para o conteúdo Pro, com RLS por plano; tabela de compras e direitos (entitlements).
- Mover o conteúdo Pro para fora do repositório público (repo privado do produto; o atual vira vitrine com o Free).

**3. Reescrita em Next.js (exportação estática)**
- Páginas públicas do Free pré-renderizadas (SEO); áreas Pro carregam do Supabase após login.
- Rodar no Cloudflare Pages; manter o código portável para outro host (ex.: Hostinger com Node.js).

**4. Cobrança**
- Mercado Pago, checkout hospedado por eles; webhook em Edge Function do Supabase libera o plano.
- Páginas de termos de uso, política de privacidade e contato (LGPD). Verificar se o Mercado Pago exige domínio ou URL do site para aprovar a conta (não verificado).

**5. PWA**
- Manifesto, ícones, service worker e leitura offline do que o plano permitir.

**6. Premium**
- IA com cota mensal por usuário e registro de uso, plano de leitura com marcação, PDF das fichas e (se aprovado) gamificação.

**7. Lojas (depois de validar a venda)**
- Expo ou Capacitor com recursos nativos que justifiquem o app; compra via sistema da loja ou fluxo "reader"; contas Apple e Google.

## Pendências e riscos

- Texto de ARA/NAA: autorização da SBB e termos da YouVersion (sessão dedicada).
- Cloudflare: sem confirmação escrita de uso comercial no gratuito; plano pago do Workers como alternativa.
- Custo do Supabase quando houver clientes (plano gratuito pausa projetos inativos; limites a verificar).
- Preço vitalício com IA: o custo é contínuo; o limite mensal precisa caber na receita de uma venda única.
- Pagar em `*.pages.dev` funciona, mas passa menos confiança no checkout; revisar quando houver vendas.
