# 03 - Contratos de Request e Response

Este documento detalha os principais objetos JSON trafegados.

## 1. Pesquisa de Remuneração (`GET /remuneration/`)

### Parâmetros de Query
| Parâmetro | Tipo | Descrição |
|---|---|---|
| `nome` | string | Filtro por nome do servidor (case-insensitive) |
| `cpf` | string | Filtro por CPF (opcional) |
| `ano` | int | Filtro por ano de exercício |
| `mes` | string | Filtro por mês de referência (ex: "01", "12") |
| `cargo` | string | Filtro por cargo do servidor |
| `orgao` | string | Filtro por nome de órgão ou entidade |
| `page` | int | Número da página (começa em 1) |
| `size` | int | Itens por página (máx 150) |

### Exemplo de Resposta (Paginação)
```json
{
  "items": [
    {
      "id": 123,
      "ano_exercicio": 2025,
      "mes_referencia": "01",
      "nome_servidor": "FRANCISCO DA SILVA",
      "cpf_servidor": "***.123.***-**",
      "nome_orgao": "POLICIA CIVIL DO DISTRITO FEDERAL",
      "cargo": "Delegado de Policia",
      "valor_bruto": 25000.50,
      "valor_liquido": 18000.20,
      "created_at": "2026-03-19T14:30:00Z"
    }
  ],
  "total": 5402,
  "page": 1,
  "size": 150,
  "pages": 37
}
```

## 2. Dashboard Summary (`GET /remuneration/summary`)

Utilizado para montar cards rápidos e rankings.

### Resposta
```json
{
  "total_servidores": 25402,
  "valor_total_bruto": 1250400300.50,
  "media_salarial_bruta": 11500.20,
  "ano_referencia": 2025,
  "top_orgaos": [
    {
      "nome_orgao": "SECRETARIA DE SAUDE",
      "total_servidores": 8402,
      "media_bruta": 9500.20
    }
  ]
}
```

## 3. Detalhe de Execução (`GET /executions/{id}`)

### Resposta
```json
{
  "id": 1,
  "ano_exercicio": 2025,
  "status": "success",
  "total_registros_coletados": 250000,
  "monthly_executions": [
    {
      "mes_referencia": "01",
      "status": "success",
      "registros_coletados": 24500
    }
  ]
}
```

## Campos Importantes para UI
-   `valor_bruto`: Exibir como moeda (R$).
-   `valor_liquido`: Exibir como moeda (R$).
-   `nome_servidor`: Exibir em caixa alta (padrão de banco).
-   `cpf_servidor`: Já vem mascarado do backend.
-   `status`: Pode ser `pending`, `running`, `success`, `partial_success` ou `error`.
