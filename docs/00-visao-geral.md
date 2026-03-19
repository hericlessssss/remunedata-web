# 00 - Visão Geral

O **RemuneData** é uma plataforma de transparência focada na coleta, análise e visualização de dados de remuneração dos servidores públicos do Distrito Federal.

## O que é a API?
A API (`remunedata-api`) é um motor de coleta (RPA) e um servidor de dados que consome informações do Portal da Transparência do DF, trata essas informações, indexa campos de busca e as disponibiliza via endpoints REST.

## Recursos Principais para o Frontend
Atualmente, o backend oferece três pilares fundamentais:
1.  **Motor de Coleta:** Capacidade de disparar e monitorar coletas anuais e mensais de dados do governo.
2.  **Busca Rica:** Lista de remunerações com filtros por Nome, CPF (se disponível), Cargo e Órgão.
3.  **Analíticos (Dashboard):** Endpoints de agregação que retornam médias salariais, total de gasto bruto e ranking de órgãos por volume de servidores.

## Público Alvo
- **Cidadão:** Consulta rápida e visual de gastos públicos por órgão ou servidor específico.
- **Gestor/Analista:** Acompanhamento de tendências e médias por categorias funcionais.

## Estado Atual
A API está em versão `0.1.0`, com persistência robusta em PostgreSQL, suporte a cache para alta performance e processamento assíncrono via Celery.
