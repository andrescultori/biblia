# Personagens do plano Essencial

Lista de **50 personagens** (meta: 30 a 50) entre os 210 de `src/data/people.json`, aprovada pelo André em 03/10/2026 com os Doze completos. Os ids existem em `people.json` (conferido em 03/10/2026). Quando aprovada, a lista vira um arquivo de configuração lido pelo script que separa o pacote público (Essencial) do pacote Pro (ver `docs/comercializacao.md`, Fase 3).

## Critério

1. Figuras centrais da narrativa bíblica, do Gênesis ao Novo Testamento, em ordem canônica.
2. Quem aparece nos livros cujo conteúdo completo o Essencial já tem (mapas do Pentateuco e dos Evangelhos, Salmos completo).
3. Quem dá nome a algo conhecido (inclusive Timóteo, que dá nome ao produto).
4. Sem peso para a contagem de livros ligados: ela mede ligação no app, não relevância (Abraão tem 2 livros ligados; Timóteo, 7).

## Lista

| Grupo | Personagens (`id`) |
|---|---|
| Origens (3) | Adão (`adao`), Eva (`eva`), Noé (`noe`) |
| Patriarcas e matriarca (5) | Abraão (`abraao`), Sara (`sara`), Isaque (`isaque`), Jacó (`jaco`), José, filho de Jacó (`jose`) |
| Êxodo e conquista (3) | Moisés (`moises`), Arão (`arao`), Josué (`josue`) |
| Juízes e Rute (4) | Débora (`debora`), Gideão (`gideao`), Sansão (`sansao`), Rute (`rute`) |
| Monarquia (4) | Samuel (`samuel`), Saul (`saul`), Davi (`davi`), Salomão (`salomao`) |
| Profetas (7) | Elias (`elias`), Eliseu (`eliseu`), Isaías (`isaias`), Jeremias (`jeremias`), Ezequiel (`ezequiel`), Daniel (`daniel`), Jonas (`jonas`) |
| Exílio e retorno (2) | Ester (`ester`), Neemias (`neemias`) |
| Jesus e família (4) | Jesus (`jesus`), Maria, mãe de Jesus (`maria-mae-de-jesus`), José, marido de Maria (`jose-marido-de-maria`), João Batista (`joao-batista`) |
| Os Doze (12) | Pedro (`pedro`), André (`andre`), Tiago, filho de Zebedeu (`tiago-zebedeu`), João, o apóstolo (`joao-apostolo`), Filipe (`filipe-apostolo`), Bartolomeu (`bartolomeu`), Mateus (`mateus`), Tomé (`tome`), Tiago, filho de Alfeu (`tiago-alfeu`), Tadeu (`tadeu`), Simão, o zelote (`simao-zelote`), Judas Iscariotes (`judas-iscariotes`) |
| Evangelhos e Atos (3) | Maria Madalena (`maria-madalena`), Pôncio Pilatos (`pilatos`), Estêvão (`estevao`) |
| Igreja primitiva (3) | Paulo (`paulo`), Barnabé (`barnabe`), Timóteo (`timoteo`) |

## Decisões

1. **Os Doze:** decidido incluir os 12. Em troca, saíram Caim, Abel e Jó.
2. **Salmos (em aberto):** o Essencial terá o livro de Salmos completo, e os Salmos ligam a 7 personagens. Davi e Saul estão na lista; ficam de fora Absalão (`absalao`), Natã (`nata`), Bate-Seba (`bate-seba`), Joabe (`joabe`), Asafe, Corá, Fineias e Melquisedeque. Quem abrir esses nomes verá o convite ao Pro. Incluir os quatro primeiros levaria a 54 e exigiria cortar outros.
3. **Reserva, se quiser trocar alguém:** Rebeca, Esaú, Lia, Raquel, Judá, Ismael, Agar, Miriã, Calebe, Nicodemos, Zaqueu, Marta, Lázaro, Maria de Betânia, Herodes o Grande, Caim, Abel e Jó.
4. **Timóteo e Paulo** entram por coerência com o nome do produto e por serem a base das cartas pastorais.

## Efeito no app (para a Fase 3)

- Nome de personagem fora da lista, na ficha de um livro: texto comum ou convite ao Pro, nunca link quebrado.
- Bloco **Família** e genealogia: só no Pro.
- Eventos da linha do tempo ligados a personagens do Essencial: a linha do tempo inteira é Pro.
