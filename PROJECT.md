# RemuneData - Contexto do Projeto

## Visão Geral
O RemuneData é uma plataforma de transparência para consulta de remuneração de servidores públicos do DF.

## Decisões Técnicas
- **Stack**: Vue 3 (Composition API), TypeScript, Vite, Tailwind CSS 4, Pinia, Vue Router, Vitest.
- **Arquitetura**: Modular por domínio funcional (`src/modules`) com separação de camadas (`core`, `shared`, `app`).
- **CSS**: Tailwind CSS 4 com plugin oficial para Vite (`@tailwindcss/vite`).
- **Testes**: Vitest + JSDOM.

## Estrutura de Pastas
- `src/app`: Configurações globais (router, layouts, providers).
- `src/core`: Lógica de infraestrutura e utilitários globais.
- `src/shared`: Componentes e lógica reutilizável entre módulos.
- `src/modules`: Domínios funcionais da aplicação.

## Hurdles & Fixes
- **Vite & Directory Not Empty**: `create-vite` exige diretório vazio. Resolvido com inicialização em pasta temporária (`temp_init`) e movimentação dos arquivos via `xcopy`.
- **Tailwind 4 Setup**: Configurado via plugin `@tailwindcss/vite` e importação direta no CSS.

## Convenções
- **Conventional Commits**: Seguir padrão (feat, fix, docs, style, refactor, test, chore).
- **TDD**: Ciclo Red-Green-Refactor como padrão obrigatório.
- **Componentes**: Usar `clsx` e `tailwind-merge` para gestão de classes. Preferir Composition API.
- **Testes**: Mínimo de 80% de cobertura em componentes compartilhados e lógica de core.

## Status Atual
- **Etapa 2: Qualidade** concluída.
- **Etapa 3: Integração HTTP** concluída. Axios, contratos de API e serviços base estabelecidos.

## Sugestão de Commit
`feat: api integration, contracts and summary service`
