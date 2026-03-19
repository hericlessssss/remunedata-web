# 02 - Endpoints

Lista compacta de endpoints disponíveis para o frontend.

## Remuneração (Consulta Pública)

| Método | Rota | Objetivo |
|---|---|---|
| `GET` | `/remuneration/` | Busca paginada de servidores com filtros. |
| `GET` | `/remuneration/summary` | Dados agregados para o Dashboard (Top órgãos, Médias). |

## Execuções (Painel de Controle)

| Método | Rota | Objetivo |
|---|---|---|
| `GET` | `/executions/` | Lista todas as coletas anuais realizadas. |
| `POST` | `/executions/` | Dispara o worker para coletar um novo ano. |
| `GET` | `/executions/{id}` | Detalhes de uma execução e status dos 12 meses. |
| `GET` | `/executions/{id}/export` | Download de dados em CSV ou XLSX. |

## Utilitários

| Método | Rota | Objetivo |
|---|---|---|
| `GET` | `/health` | Verifica status da API e ambiente. |
| `GET` | `/docs` | Documentação OpenAPI/Swagger interativa. |

## Observação sobre o Dashboard Integrado
A API serve um dashboard "preview" estático em `http://localhost:8000/dashboard/`. 
Este frontend legado serve como referência de como consumir os dados de `/summary` usando Chart.js.
