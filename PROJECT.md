# RemuneData - Frontend Web

Portal de transparência e análise remuneratória dos servidores públicos do Distrito Federal.

## 🚀 Visão do Projeto
O RemuneData é uma plataforma analítica que consome a API de remunerações para fornecer uma visão clara, rápida e acessível sobre os gastos com pessoal. O foco é transformar dados brutos em insights visuais e permitir a exploração detalhada por servidor.

## 🛠️ Stack Tecnológico
- **Core**: Vue 3 (Composition API) + TypeScript + Vite.
- **Estilização**: Tailwind CSS v4 (Design System Utility-first).
- **Estado & Cache**: Vue Query (TanStack) para gestão de estado assíncrono e Pinia para estado global.
- **Navegação**: Vue Router com sincronização de Query Params.
- **Gráficos**: ECharts + Vue-ECharts (Visualizações dinâmicas).
- **Qualidade**: Vitest (Unit/Integration), ESLint 9+ e Prettier.
- **Icons**: Lucide Vue Next.

## 📂 Estrutura de Pastas
```text
src/
├── app/            # Configurações globais (Router, Layouts, Styles)
├── core/           # Lógica central (HTTP Client, Formatters, Types)
├── modules/        # Funcionalidades separadas por domínio
│   ├── dashboard/  # Visão geral e KPIs
│   ├── remuneration/ # Busca e detalhamento de servidores
│   └── executions/ # Histórico de sincronização (Auditoria)
├── shared/         # Componentes UI e Utilitários reutilizáveis (Design System)
```

## 📈 Histórico de Desenvolvimento (Roadmap)

### Etapa 1: Fundação do Projeto
- Inicialização com Vite + Vue 3 + TS.
- Configuração de Alias (`@/*`).

### Etapa 2: Qualidade e Padrões
- Configuração de Linting e Formatting (ESLint/Prettier).
- Setup do ambiente de testes com Vitest e TDD inicial.

### Etapa 3: Integração HTTP e Services
- Implementação do `httpClient` (Axios) com interceptores para a `VITE_API_URL`.
- Definição de contratos de API no `core/types`.

### Etapa 4: Layout e Visualização Analítica
- Desenvolvimento do `MainLayout` (Estrutura de Sidebar e Header).
- Criação do wrapper `BaseChart` para integração agnóstica de gráficos.

### Etapa 5: Dashboard Dinâmico
- Implementação de KPI Cards para visualização de métricas macro (Total servidores, Média salarial).
- Gráfico "Top Órgãos" integrado via Vue Query com cache automático.

### Etapa 6: Consulta e Exploração de Dados
- Criação do motor de busca com filtros: Nome (Debounce), Cargo, Órgão e Período.
- Desenvolvimento da `BaseTable` reutilizável.
- **Inovação**: Sincronização automática dos filtros com os Parâmetros de URL (Query Params).

### Etapa 7: Detalhamento e Evolução Salarial
- Implementação da visão individualizada por servidor.
- Gráfico de linha para série temporal de ganhos (Bruto vs Líquido).

### Etapa 8: Histórico de Execuções e Auditoria
- Log detalhado de cargas de dados com badges de status (Sucesso/Falha).

### Etapa 9: Refinamentos e SEO
- Implementação de SEO dinâmico, acessibilidade ARIA e sidebar responsiva (Mobile Drawer).

### Etapa 10: QA e Documentação
- 24 testes unitários e consolidação de histórico.

### Etapa 11 (Bônus): Painel de Controle
- Adicionada funcionalidade de disparo de sincronização manual via UI, transformando o frontend em uma ferramenta de gestão operacional.
- Suporte a estados `RUNNING` em tempo real e feedback visual dinâmico.

### Etapa 12: Garantia de Qualidade e Homologação
- Correção de 40+ erros de TypeScript/Linting para prontidão de produção.
- Sincronização de interfaces de API (`Execution`) com o backend real.
- Suíte de 25 testes unitários com 100% de aprovação e cobertura validada.
- Correção de configuração do `tsconfig` para suporte estável a aliases de importação (`@/*`).

### Etapa 13: Infraestrutura e Deploy Contínuo (CI/CD)
- Implementação de pipeline robusta via GitHub Actions.
- Estratégia de "Direct Upload" para Cloudflare Pages via Wrangler.
- Gate de produção: deploy condicionado ao sucesso de Lint, Typecheck, Testes Unitários e Build.
- Configuração de fallback para SPA (Single Page Application).
- Documentação detalhada do processo de deploy e operação.

### Etapa 14: Conformidade Documental e Telemetria de RPA
- Implementação de filtros avançados por **CPF** na consulta pública.
- Integração de exportação multi-formato (**XLSX** limitado a 1k e **CSV** limitado a 5k) conforme requisitos regulatórios.
- Enriquecimento da auditoria de execuções com colunas de **Duração** e **Parâmetros** (Ano).
- Indicadores de integridade e última sincronização no Dashboard principal.
- Refiguração da resiliência de navegação (Deep Linking) para contornar limitações de endpoints de ID.

## 6. 💡 Desafios Técnicos e Soluções

| Desafio | Solução |
| :--- | :--- |
| **CORS / Conectividade** | Resolvido via Vite Proxy e caminhos relativos no Axios, isolando a complexidade de rede do código de serviço. |
| **Responsividade da Sidebar** | Implementação de um sistema de `drawer` com overlay e animação controlado por estado reativo para mobile. |
| **Sincronização de Filtros** | Manter a URL sincronizada com os filtros sem loops de navegação, usando `watch` seguro no Route. |
| **Performance de Busca** | Evitar requisições excessivas via estratégia de `debounce` no filtro de nome. |

---
**Entregue com excelência.** 🐒✨

## 🧪 Estratégia de Testes
O projeto segue o princípio de **TDD** para lógica de negócio e componentes core.
- **Unitários**: Validam formatadores, parsers de datas e lógica de composables.
- **Componentes**: Testam interações de UI e renderização condicional (Loading/Empty states).
- **Cobertura**: Foco em manter >80% de cobertura nas pastas `core`, `services` e `composables`.

## 📌 Guia de Estilo (Convenções)
- **Commits**: Seguem o padrão `Conventional Commits` (feat, fix, chore).
- **Componentes**: Vue SFC com `<script setup>` e TypeScript.
- **Estilos**: Tailwind CSS com camadas `@layer base` para customização premium.

---
*Este documento é atualizado ao final de cada etapa de desenvolvimento.*
