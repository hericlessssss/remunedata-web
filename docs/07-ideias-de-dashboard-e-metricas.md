# 07 - Ideias de Dashboard e Métricas

Inspiração para a camada de visualização de dados.

## Cards de Resumo (Top of Page)
-   **Volume de Dados:** "Total de Servidores Mapeados" (Campo: `total_servidores` em `/summary`).
-   **Gasto Público:** "Investimento Total em Pessoal (Ano Atual)" (Campo: `valor_total_bruto` em `/summary`).
-   **Ticket Médio:** "Remuneração Média Bruta" (Campo: `media_salarial_bruta` em `/summary`).

## Gráficos de Ranking
-   **Bar Chart (Horizontal):** Top 10 Órgãos por quantidade de servidores.
-   **Donut/Pie Chart:** Distribuição de servidores por grandes entidades (Ex: Saúde, Educação, Segurança).
-   **Bar Chart (Vertical):** Melhores Médias Salariais por Órgão (Ranking de órgãos com salários mais altos).

## Gráficos de Tendência (Futuro)
-   **Line Chart:** Evolução do gasto total mês a mês.
-   **Área Chart:** Acúmulo de registros coletados ao longo do tempo.

## Recortes Úteis para o Cidadão
-   **Transparência por Localidade:** Se os dados permitirem, agrupar por região ou secretaria.
-   **Pirâmide Salarial:** Quantos servidores ganham entre 0-5k, 5-10k, 10-20k, etc.
-   **Faixa de Remuneração:** Filtro deslizante no frontend para buscar apenas salários acima de X reais.

## Sugestão de UX
Use o **Dashboard** como a "Porta de Entrada". Quando o usuário clicar em um órgão no gráfico, o frontend deve levá-lo para a tela de **Busca de Remuneração** já pré-filtrada por aquele órgão.
