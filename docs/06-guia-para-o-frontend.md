# 06 - Guia para o Frontend

Tradução técnica dos recursos da API para componentes de UI/UX.

## Estrutura de Páginas Sugerida
1.  **Dashboard (Home):** Visualização rápida de KPIS e rankings.
2.  **Consulta de Remuneração:** Busca avançada com filtros e tabela paginada.
3.  **Monitor de Coletas (Admin):** Status das execuções e histórico de coletas anuais.

## Componentes de UI Recomendados

### Tabela de Remuneração
-   **Colunas:** Servidor, CPF, Órgão, Cargo, Valor Bruto, Valor Líquido, Referência.
-   **Ações:** "Visualizar Detalhes" ou "Exportar XLSX do Filtro Atual".
-   **Estados:** Loading (Table Skeleton), Empty (Illustration), Error (Toast).

### Filtros Lateral/Superior
-   **Pesquisa Nominal:** Input de texto com *debounce* (mín 3 caracteres).
-   **Selects:** Órgão e Cargo (Idealmente vindos de uma lista única do backend, ou digitáveis `ilike`).
-   **Período:** Sliders ou selects de Ano e Mês.

### Cards de Dashboard
-   **KPI 1:** Total de Servidores no Banco.
-   **KPI 2:** Total de Gastos (R$) na última competência completa.
-   **KPI 3:** Média Salarial Bruta do DF.

## Boas Práticas de Integração
-   **Debounce em Pesquisas:** Evite disparar requisições a cada tecla. Use 300ms a 500ms de debounce.
-   **Preservação de Estado na URL:** Recomenda-se salvar os filtros e a página atual na URL (Query Params). Ex: `/search?nome=FRANCISCO&page=2`. Isso permite que o usuário use o botão de "Voltar" do navegador.
-   **Tratamento de Moeda:** Use `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` para formatar os valores retornados.
-   **Loading states:** Priorize loaders parciais (ex: apenas no corpo da tabela) ao trocar de página, mantendo o cabeçalho visível.
