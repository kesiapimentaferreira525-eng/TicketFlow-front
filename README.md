# TicketFlow Front

Frontend do projeto TicketFlow, desenvolvido em Angular, responsável por exibir o catálogo de eventos, detalhar cada item, permitir a compra e acompanhar o status do pedido.

## Visão geral

Este projeto foi construído para consumir uma API REST do backend e apresentar uma experiência de compra de ingressos de forma moderna e responsiva. A interface foi organizada em telas dedicadas para:

- listagem de eventos
- detalhamento do evento selecionado
- compra de ingressos
- confirmação/visualização do status da compra

## O que foi implementado

### 1. Catálogo de eventos

- Tela inicial com grade de cards de eventos
- Busca local por título, local ou categoria
- Estados de carregamento e erro
- Navegação para a tela de detalhes de cada evento

### 2. Detalhamento do evento

- Rota dinâmica por id: `/events/:id`
- Exibição de imagem, descrição, data, local e preço
- Controle de quantidade de ingressos
- Seleção de método de pagamento
- Validação antes da compra

### 3. Fluxo de compra

- Envio de pedido para o backend via `POST /api/purchases`
- Suporte a checkout de pagamento via URL retornada pela API
- Feedback visual de sucesso ou erro
- Tela de resultado do pedido com status final atualizado

### 4. Acompanhamento do pedido

- Rota para exibir o status da compra: `/purchase/result/:id`
- Leitura do pedido pelo backend
- Exibição do valor total, método de pagamento e status da transação

### 5. Integração com a API

- Serviço centralizado `EventService`
- Consumo dos endpoints:
  - `GET /api/events`
  - `GET /api/events/:id`
  - `POST /api/purchases`
  - `GET /api/purchases/:id`
- Normalização dos dados vindos do backend para o formato de domínio da aplicação
- Tratamento robusto de envelopes de resposta como `data`, `results`, `content` e `items`
- Mensagens amigáveis para erro de conexão e falha de busca

### 6. Proxy para desenvolvimento

Foi configurado o proxy do Angular para encaminhar requisições da aplicação para o backend local durante o desenvolvimento.

Arquivo de configuração:

- `proxy.conf.json`

Essa configuração permite que as chamadas com prefixo `/api` sejam redirecionadas para o backend sem problema de CORS durante o uso em ambiente de desenvolvimento.

## Estrutura principal do projeto

```text
src/
  app/
    core/
      api.constants.ts
    events/
      event-card/
      event-detail/
      event-list/
    models/
      event.model.ts
    purchases/
      purchase-result.component.ts
    services/
      event.service.ts
    app.routes.ts
```

## Arquivos importantes

- `src/app/services/event.service.ts`: centraliza todas as chamadas HTTP
- `src/app/models/event.model.ts`: define os modelos e funções de formatação
- `src/app/events/event-list/event-list.component.ts`: lista os eventos
- `src/app/events/event-detail/event-detail.component.ts`: detalha o evento e realiza a compra
- `src/app/purchases/purchase-result.component.ts`: consulta o status da compra
- `proxy.conf.json`: proxy do frontend para o backend

## Tecnologias utilizadas

- Angular 21
- TypeScript
- RxJS
- Angular Router
- Angular HttpClient
- HTML/CSS

## Como executar

Na raiz do projeto, instale as dependências:

```bash
npm install
```

Em seguida, inicie a aplicação:

```bash
npm start
```

A aplicação fica disponível em:

```text
http://localhost:4200
```

## Observação importante sobre o backend

O frontend foi preparado para funcionar com o backend rodando em `http://localhost:8081`, conforme a configuração do proxy. Se o backend estiver em outra porta ou não estiver iniciado, o navegador vai apresentar erro de conexão, como `ECONNREFUSED`.

Nesse caso, é necessário:

1. iniciar o backend;
2. ou ajustar o `target` em `proxy.conf.json` para a porta correta.

## Status atual

A aplicação frontend já possui a base funcional para:

- listar eventos
- visualizar detalhes
- realizar compra
- consultar status do pedido
- lidar com erros e carregamento
- integração com API em desenvolvimento

Este projeto continua evoluindo conforme os requisitos do sistema e da API do backend.
