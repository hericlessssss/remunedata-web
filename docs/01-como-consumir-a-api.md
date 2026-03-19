# 01 - Como Consumir a API

Este documento descreve os detalhes técnicos necessários para estabelecer a comunicação entre o `remunedata-web` (Frontend) e o `remunedata-api` (Backend).

## Base URL Local
Por padrão, a API roda no endereço:
`http://localhost:8000/api/v1`

## Como rodar a API localmente
Para que o frontend consiga consumir os dados, o ambiente do backend deve estar ativo via Docker:
```bash
# No repositório remunedata-api
make up
make migrate
```

## Formato das Respostas
Todas as respostas são em formato **JSON**. 
As datas seguem o padrão **ISO 8601** (ex: `2026-03-19T12:00:00Z`).

## Headers Sugeridos
Embora não haja autenticação obrigatória no momento (versão atual), recomenda-se o uso de:
- `Content-Type: application/json`
- `Accept: application/json`

## Autenticação
**Nenhuma.** Nesta fase pública do projeto, os endpoints de consulta são abertos. 
*Nota: Endpoints de disparar novas coletas (POST) podem exigir proteção no futuro.*

## Observações de Performance
- **Caching:** O endpoint `/summary` (Dashboard) possui um cache de **60 segundos**. Requisições subsequentes dentro deste intervalo serão extremamente rápidas.
- **Paginação:** Sempre use os parâmetros `page` e `size` para evitar payloads excessivos. O teto recomendado para `size` é **150**.
