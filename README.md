# MOBA AID: frontend

Interface web do **MOBA AID** (*MOBA Artificial Intelligence Draft*), ferramenta para treinar técnicos e jogadores de League of Legends na fase de *draft*. O usuário escolhe um lado (azul ou vermelho) e disputa os 20 turnos de bans e picks contra um Algoritmo Genético; no fim, atribui papéis aos seus campeões e pede a previsão do vencedor.

A interface imita a tela de seleção do cliente do jogo. Toda a inteligência (AG e classificador) fica no backend, [`lincolncosta/compgap`](https://github.com/lincolncosta/compgap), que este projeto consome por HTTP.

## Sumário

- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Como executar](#como-executar)
- [Fluxo da aplicação](#fluxo-da-aplicação)
- [Integração com a API](#integração-com-a-api)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Atualizando a lista de campeões](#atualizando-a-lista-de-campeões)
- [Pontos de atenção conhecidos](#pontos-de-atenção-conhecidos)

## Stack

- React 16 com Create React App (`react-scripts` 3.4.3)
- React Router 5 (rotas `/`, `/fearless`, `/side`, `/teams`, `/draft`)
- styled-components + styled-system para layout e tema
- axios para as chamadas à API
- Imagens dos campeões servidas pelo Data Dragon da Riot (`ddragon.leagueoflegends.com`)

## Pré-requisitos

- **Node.js 24** (definido em `.nvmrc` e em `engines`). Com `nvm`: `nvm use`.
  - Em outra versão, `yarn install` recusa por causa do campo `engines`; use `yarn install --ignore-engines` (testado com Node 22).
- **Yarn 1.x** (o projeto tem `yarn.lock`).
- O backend `compgap` rodando e acessível (por padrão em `http://localhost:5000`).

Os scripts definem `NODE_OPTIONS=--openssl-legacy-provider`, necessário para o webpack 4 do `react-scripts` 3 rodar em Node ≥ 17.

## Configuração

As variáveis ficam em arquivos `.env` (não versionados). Copie o exemplo:

```bash
cp .env.example .env
```

| Variável | Exemplo | Uso |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:5000` | URL base do backend `compgap`, sem barra no final |
| `REACT_APP_LAST_PATCH` | `16.22.1` | Versão do Data Dragon usada para montar a URL das imagens: `https://ddragon.leagueoflegends.com/cdn/<versão>/img/champion/<alias>.png`. Precisa ser uma versão existente em `https://ddragon.leagueoflegends.com/api/versions.json` e recente o bastante para conter todos os campeões. |

`yarn start` e `yarn build` leem `.env`; `yarn start:production` e `yarn build:production` leem `.env.production`.

## Como executar

```bash
yarn install
yarn start                 # desenvolvimento em http://localhost:3000
```

Build de produção (gera a pasta `build/`):

```bash
yarn build                 # usa as variáveis do ambiente / .env
yarn build:production      # usa .env.production
```

`yarn test` existe, mas o projeto não tem testes.

## Fluxo da aplicação

1. **Home (`/`)**: apresentação e botão *Start*.
2. **Fearless (`/fearless`)**: etapa extra, antes de tudo. O usuário marca quantos campeões quiser (os já usados na série); eles ficam indisponíveis para os dois times durante o *draft* inteiro. *Skip* segue sem nenhum.
3. **Side (`/side`)**: o usuário escolhe jogar de azul ou vermelho.
4. **Times e jogadores (`/teams`)**: chama `GET /teams` e mostra dois quadros (seu time e o adversário). Escolhido o time (com filtro por liga), o elenco mais recente aparece preenchido e cada rota pode ser trocada por qualquer jogador profissional daquela rota. Com o adversário escolhido, aparece o quadro **Preparation** (`POST /scout`): bans e picks iniciais prováveis, assinatura do time e campeões recentes de cada jogador. *Skip (champions only)* segue sem times (a força conta como neutra e só o draft e o lado entram na previsão). Lado, Fearless e `lados` (`{ blue: {team, players}, red: {...} }`) vão para o Draft via `history.location.state`. Acessar `/draft` direto, sem lado, volta para a Home.
5. **Draft (`/draft`)**:
   1. Percorre a sequência oficial de 20 turnos:

      | Turnos | Ação | Ordem |
      |---|---|---|
      | 0–5 | Bans fase 1 | Azul, Vermelho × 3 |
      | 6–11 | Picks fase 1 | Azul, Vermelho, Vermelho, Azul, Azul, Vermelho |
      | 12–15 | Bans fase 2 | Vermelho, Azul × 2 |
      | 16–19 | Picks fase 2 | Vermelho, Azul, Azul, Vermelho |

   2. **Vez do usuário**: o quadro **Pick/Ban suggestion** chama `POST /suggest` (`side` = lado do usuário). Mostra a sugestão com o ganho de draft em pontos percentuais (campeão + counters), os jogos do jogador naquele campeão (só informação), contra quem o campeão é bom ou fraco (só ordem), alternativas, uma ideia de composição para as rotas abertas e o aviso quando parte do ganho está fora da faixa dos drafts reais. *Use* aplica a sugestão (com a rota); o usuário também pode escolher qualquer campeão na grade e ajustar a rota no seletor do card.
   3. **Vez do adversário**: a tela chama `POST /opponent/move`, que devolve a jogada mais provável do time real escolhido (modelo do adversário da etapa 2, E10), com a rota.
   4. **Análise ao vivo**: a cada passo (e a cada troca de rota) a tela chama `POST /predict` com o draft parcial e mostra a probabilidade, o ponto de partida (confronto espelhado, só o lado), a força (times + jogadores) e o draft (campeões + counters) em pp, jogadores e campeões rota a rota (jungle marcada como incerta), os confrontos mais fortes só como ordem, a fase de rotas (ouro aos 15 min, não é chance de vitória) e o perfil descritivo das composições.
   5. Se `/opponent/move` ou `/predict` falhar, a tela mostra a mensagem e um botão *Try again*.

Todo o estado do *draft* fica no `useReducer` de `src/pages/Draft/Draft.js`; o backend não guarda sessão.

## Integração com a API

Funções em `src/api/`:

| Arquivo | Função | Rota | Corpo |
|---|---|---|---|
| `times.js` | `getTimes` | `GET /teams` | — |
| `adversario.js` | `getScout` | `POST /scout` | `{ team, opponent, players }` |
| `adversario.js` | `getJogadaAdversario` | `POST /opponent/move` | `{ side, goal, state }` |
| `sugestao.js` | `getSugestao` | `POST /suggest` | `{ side, goal, state }` |
| `predicao.js` | `getPredicao` | `POST /predict` | `{ blue, red }` |
| `sessao.js` | `iniciarSessao` | `POST /start` | não é mais usado (AG antigo) |

`state = { blue, red, bans, fearless }`, com cada lado no formato `{ team, players: { rota: id }, picks: [{ champion, role }] }`. Picks do usuário sem rota vão com `role: null` e a API usa a rota mais provável do campeão. O campeão devolvido pela API é procurado em `src/database/champions.json` pelo `name` e, se não achar, pelo `alias`.

O contrato completo da API está no README do [`compgap`](https://github.com/lincolncosta/compgap#endpoints-da-api).

## Estrutura do projeto

```
src/
├── App.js                    # Tema, imagem de fundo e rotas
├── index.js / index.css
├── api/                      # Chamadas HTTP ao backend (axios)
├── pages/
│   ├── Home/                 # Tela inicial
│   ├── Fearless/             # Bans livres da série, antes da escolha do lado
│   ├── Side/                 # Escolha do lado
│   ├── Teams/                # Times, jogadores e preparação contra o adversário
│   └── Draft/                # Tela do draft (estado, sugestões, adversário simulado e análise)
├── components/
│   ├── Analysis/             # Previsão explicada (blocos, rotas, fase de rotas, perfil)
│   ├── Advisor/              # Sugestão de pick/ban com alternativas
│   ├── Scout/                # Preparação: tendências do adversário
│   ├── Panel/                # Estilos comuns dos painéis
│   ├── PicksBans/            # Grade de campeões + botão de confirmação
│   ├── Campeao/              # Ícone de um campeão na grade
│   ├── CampeaoBanido/        # Slot de ban
│   ├── CardBlueSide/         # Slot de pick do lado azul
│   ├── CardRedSide/          # Slot de pick do lado vermelho
│   ├── Box, Text, Button, Icon, Loading
├── database/champions.json   # Lista de campeões: id, name, alias (Data Dragon), squarePortraitPath
├── themes/                   # Tema do styled-components
└── assets/                   # Fundo, ícones e ícones de papel (rotas/)
```

Os imports são absolutos a partir de `src/` (`jsconfig.json` com `baseUrl: "src"`).

## Atualizando a lista de campeões

`src/database/champions.json` precisa conter todos os campeões que o backend pode devolver, com:

- `name`: igual ao nome usado pelo backend (Oracle's Elixir);
- `alias`: o identificador do Data Dragon, usado na URL da imagem (ex.: `MonkeyKing` para Wukong);
- `id`: a `key` numérica do Data Dragon.

Ao lançar campeão novo, adicione-o aqui e atualize `REACT_APP_LAST_PATCH` para uma versão do Data Dragon que já tenha a imagem.

## Pontos de atenção conhecidos

- **Dependências antigas:** `react-scripts` 3.4.3 (webpack 4) exige `--openssl-legacy-provider`, e o ESLint dele não aceita chamada opcional (`f?.()`); `gh-pages` está nas dependências, mas não há script de deploy nem `homepage` no `package.json`.
- **Yunara (id 804) e Zaahen (id 904)** foram adicionados em novembro/2026; as imagens só aparecem com `REACT_APP_LAST_PATCH` numa versão do Data Dragon que já tenha os dois (16.22.1 tem).
