# 04 - Filtros, Paginação e Ordenação

Manual de como gerenciar a navegação de dados.

## Filtros Validados
O frontend pode confiar plenamente nos seguintes filtros em `/remuneration/`:
-   **Nome:** Busca por `ilike` (parcial e sem case-sensitive).
-   **Cargo:** Busca `ilike` por cargo.
-   **Órgão:** Busca `ilike` por nome de órgão.
-   **Ano/Mês:** Filtros exatos úteis para filtrar competências específicas.

## Paginação
-   **Índice:** Começa em **1** (conforme padrão Pydantic/FastAPI).
-   **Params:** `page` e `size`.
-   **Objeto de Resposta:** `total` (itens totais), `pages` (páginas totais), `page` e `size` atuais.

### Exemplo de Lógica de UI:
```javascript
const totalPages = response.pages;
const currentPage = response.page;
const hasNext = currentPage < totalPages;
const hasPrevious = currentPage > 1;
```

## Ordenação
A ordenação padrão no backend é por **Nome do Servidor (Ascendente)**.
No momento, a API não aceita um parâmetro dinâmico de `sort`. Caso o usuário clique em uma coluna na tabela do frontend, a ordenação deve ser feita localmente (se for na página atual) ou solicitada como melhoria de API futuro.

## Limites
-   `size` padrão: **25**.
-   `size` máximo: **150** (limite técnico da API do Portal da Transparência).
-   Se o frontend pedir `size=1000`, o backend poderá ignorar ou retornar erro. Recomenda-se manter entre 25 e 150.

## Comportamento de Fim de Dados
Quando o frontend solicitar uma página além do limite (`page > pages`), a API retornará uma lista vazia (`items: []`) com `total` e `pages` corretos. Trate isso como "Página não encontrada" ou "Fim dos dados".
