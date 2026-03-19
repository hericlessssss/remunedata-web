# 05 - Casos de Erro e Comportamentos Especiais

Prepare o frontend para lidar com os cenários de adversidade.

## Códigos HTTP Comuns
| Código | Significado | Tratamento Sugerido |
|---|---|---|
| `200 OK` | Sucesso Total | Renderizar dados. |
| `400 Bad Request` | Parâmetros Inválidos (ex: ano=abc) | Mostrar erro de validação de formulário. |
| `404 Not Found` | Recurso não existe (ex: ID de execução) | Mostrar "Não encontrado" e redirecionar. |
| `500 Server Error` | Erro interno no Backend | Mostrar mensagem global de "Serviço Indisponível". |

## Casos Especiais de UI

### Lista Vazia (Empty State)
Se a busca por `nome=Zezinho` retornar `items: []`, exiba uma ilustração de "Nenhum resultado encontrado" e sugira o uso de filtros menos específicos.

### Filtros Sem Ano
A busca de remuneração pode retornar resultados de anos diferentes se o filtro `ano` não for fornecido. O frontend deve deixar claro ao usuário qual o ano daquela linha específica na tabela (exiba a coluna Ano).

### Exportação Exacerbada
-   **XLSX:** Limite de **1000** itens.
-   **CSV:** Limite de **5000** itens.
Se o usuário tentar exportar uma busca com 10.000 resultados, o arquivo baixado conterá apenas os primeiros itens conforme o limite. Notifique o usuário: "Apenas os primeiros 5.000 registros serão incluídos no CSV".

### Carregamento de Dashboard
O dashboard pode levar de 2 a 3 segundos na primeira carga (antes do cache de 60s). Use **Skeletons** ou **Spinners** elegantes.
