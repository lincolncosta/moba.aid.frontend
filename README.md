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
- React Router 5 (rotas `/`, `/side`, `/draft`)
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
| `REACT_APP_LAST_PATCH` | `15.24.1` | Versão do Data Dragon usada para montar a URL das imagens: `http://ddragon.leagueoflegends.com/cdn/<versão>/img/champion/<alias>.png`. Precisa ser uma versão existente em `https://ddragon.leagueoflegends.com/api/versions.json` e recente o bastante para conter todos os campeões. |

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
2. **Side (`/side`)**: o usuário escolhe jogar de azul ou vermelho. O lado vai para a próxima tela via `history.location.state.meuTime`.
3. **Draft (`/draft`)**:
   1. Ao montar, chama `POST /start` e guarda a `targetComposition` (o plano de 5 campeões do AG). A tela só aparece depois dessa resposta.
   2. Percorre a sequência oficial de 20 turnos:

      | Turnos | Ação | Ordem |
      |---|---|---|
      | 0–5 | Bans fase 1 | Azul, Vermelho × 3 |
      | 6–11 | Picks fase 1 | Azul, Vermelho, Vermelho, Azul, Azul, Vermelho |
      | 12–15 | Bans fase 2 | Vermelho, Azul × 2 |
      | 16–19 | Picks fase 2 | Vermelho, Azul, Azul, Vermelho |

   3. Na vez do usuário, ele escolhe um campeão na grade e confirma. Campeões já banidos ou escolhidos ficam bloqueados.
   4. Na vez do AG, a tela chama `POST /suggest` automaticamente e aplica o campeão (e o papel, se for pick) devolvido.
   5. Terminado o *draft*, o usuário atribui um papel a cada um dos seus 5 campeões e clica em *Predict Winner*, que chama `POST /predict`. A tela mostra o lado previsto como vencedor e um botão para recomeçar.

Todo o estado do *draft* fica no `useReducer` de `src/pages/Draft/Draft.js`; o backend não guarda sessão.

## Integração com a API

Funções em `src/api/`:

| Arquivo | Função | Rota | Corpo |
|---|---|---|---|
| `sessao.js` | `iniciarSessao` | `POST /start` | `{ agSide, userSide }` |
| `sugestao.js` | `getSugestao` | `POST /suggest` | `{ goal, agTeam, userTeam, banned, targetComposition }` |
| `predicao.js` | `getPredicao` | `POST /predict` | `{ top_blue, jng_blue, ..., sup_red }` |

Montagem dos dados em `Draft.js`:

- `goal`: `"ban"` ou `"pick"`, conforme o turno.
- `agTeam`: picks do AG como `{ papel: nome }`, preenchido com o `role` devolvido por `/suggest`.
- `userTeam`: nomes dos picks do usuário, sem papel (o papel só é definido no fim).
- `banned`: bans dos dois lados.
- `targetComposition`: o último valor recebido de `/start` ou `/suggest`.
- O campeão devolvido pela API é procurado em `src/database/champions.json` pelo `name` e, se não achar, pelo `alias` (necessário para casos como "Nunu & Willump").

A resposta de `/predict` também traz `win_probability`, `confidence` e `key_factors`, mas a tela hoje exibe apenas `predicted_winner`.

O contrato completo da API está no README do [`compgap`](https://github.com/lincolncosta/compgap#endpoints-da-api).

## Estrutura do projeto

```
src/
├── App.js                    # Tema, imagem de fundo e rotas
├── index.js / index.css
├── api/                      # Chamadas HTTP ao backend (axios)
├── pages/
│   ├── Home/                 # Tela inicial
│   ├── Side/                 # Escolha do lado
│   ├── Draft/                # Tela do draft (estado, chamadas ao AG e predição)
│   ├── Banimentos/           # Tela antiga de bans (não roteada)
│   └── SelecaoCampeoes/      # Tela antiga de picks (não roteada)
├── components/
│   ├── PicksBans/            # Grade de campeões + botão de confirmação
│   ├── Campeao/              # Ícone de um campeão na grade
│   ├── CampeaoBanido/        # Slot de ban
│   ├── CardBlueSide/         # Slot de pick do lado azul
│   ├── CardRedSide/          # Slot de pick do lado vermelho
│   ├── SelecaoRotas/         # Seletor de papel por ícone (usado só pelas telas antigas)
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

Encontrados durante a revisão desta documentação (novembro/2026); não foram alterados neste PR, que só mexe em documentação.

1. **Yunara e Zaahen faltam em `champions.json`**, mas estão no pool do AG no backend (Yunara como bot, Zaahen como top/jng). Se o AG escolher um deles, `findChampion` não encontra o campeão, o turno não avança e a tela tenta de novo a cada renderização até vir outro nome. O usuário também não consegue escolhê-los.
2. **A predição mostra só o vencedor.** A Home promete "a probabilidade de vitória de cada time", e a tese descreve a exibição da probabilidade e dos três fatores; a API já devolve esses campos.
3. **Sem tratamento de erro visível.** Se `/start` falhar, a tela fica em "Preparing draft…"; se `/suggest` falhar, o erro é engolido e o turno é tentado de novo.
4. **Imagens por `http://`.** Hospedado em HTTPS, o navegador pode bloquear as imagens do Data Dragon como conteúdo misto; `https://ddragon.leagueoflegends.com` funciona.
5. **Modo Fearless não exposto.** O backend aceita `fearless` em `/start` e `/suggest`, mas a interface ainda não envia.
6. **Código morto:** `pages/Banimentos`, `pages/SelecaoCampeoes` e `components/SelecaoRotas` não são usados pelas rotas atuais.
7. **Dependências antigas:** `react-scripts` 3.4.3 (webpack 4) exige `--openssl-legacy-provider`; `gh-pages` está nas dependências, mas não há script de deploy nem `homepage` no `package.json`.
