# 08 - Gaps Técnicos e Cuidados

O que o frontend deve saber sobre as limitações atuais do ecossistema.

## 1. Dados de CPF
O Portal da Transparência nem sempre fornece o CPF completo ou consistente. Atualmente, ele vem mascarado (`***.123.***-**`). 
**Cuidado:** Não tente validar CPF no frontend como se fosse um dado limpo para processamento, trate-o como uma string informativa.

## 2. Filtro Unificado
A API de Remuneração e a de Summary operam de formas ligeiramente diferentes internamente.
-   No `/remuneration/`, você pode buscar por qualquer termo string. 
-   No `/summary`, a agregação é mais pesada. Se o frontend notar lentidão, considere implementar uma rota de "Sugestões/Autocomplete" no backend no futuro.

## 3. Ausência de Sort Dinâmico
Como mencionado no documento 04, a API não suporta `order_by` via query param no momento.
**Impacto:** O frontend não pode ordenar a lista completa (milhões de registros) por "Maior Salário" no lado do cliente. Recomenda-se solicitar este recurso ao backend se for crítico para o produto final.

## 4. Coletas em Andamento
Se o status de uma coleta anual for `running`, os dados no banco ainda estão parciais. O frontend deve informar ao usuário: "Dados em atualização para o ano de 2025...".

## 5. Limite de Exportação
O limite de 1000/5000 itens é fixo no backend para proteger a memória do servidor. Não tente contornar isso via frontend solicitando múltiplas páginas para exportar, pois isso pode ser interpretado como um ataque de negação de serviço.

## 6. Autenticação e Segurança
Em ambiente de produção, o frontend deve estar preparado para receber um cabeçalho de autenticação (ex: Bearer Token). Embora não exista hoje, prever uma camada de `interceptor` no cliente HTTP é uma boa prática.
