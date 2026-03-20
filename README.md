# RemuneData Frontend

Interface web para a plataforma de transparência RemuneData.

## Stack Tecnológica
- **Framework**: [Vue 3](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Router**: [Vue Router](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/)

## Metodologia de Desenvolvimento

### Test Driven Development (TDD)
O projeto seguiu princípios de TDD especialmente no desenvolvimento do núcleo lógico:
1. **Formatadores**: Testes escritos previamente para garantir precisão em moedas e datas.
2. **Serviços de API**: Definição de contratos e mapeamento de dados validados via testes antes da integração com componentes.
3. **Componentes Shared**: Componentes de UI base como `BaseTable` e `BaseButton` possuem cobertura total de seus estados e emissões.

### Definition of Done (DoD)
Para que uma funcionalidade seja considerada concluída, deve obedecer aos seguintes critérios:
- Código validado por Linter (ESLint) sem avisos.
- Verificação de tipos TypeScript (tsc) sem erros.
- 100% dos testes unitários da suíte aprovados.
- Build de produção gerado com sucesso.
- Deploy validado em ambiente de staging/produção (Cloudflare Pages).
- Documentação técnica e histórico do projeto atualizados no `PROJECT.md`.

## Qualidade e Cobertura
- **Média Geral de Cobertura (Núcleo)**: ~85.4%
- **Formatadores e Core**: 100%
- **UI Components (Shared)**: 100%
- **Lint & Typecheck**: Obrigatórios em cada Pull Request via GitHub Actions.

## Instalação e Execução

### Pré-requisitos
- Node.js (v18+)
- npm

### Passo a passo
1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` (baseado no `.env.example`).
4. Rode o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

## Scripts Disponíveis
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera o build de produção.
- `npm run test:run`: Executa os testes unitários com Vitest.
- `npm run lint`: Executa a verificação estática de código.
- `npm run format`: Formata o código fonte.

## Estrutura e Arquitetura
Consulte o arquivo [PROJECT.md](./PROJECT.md) para detalhes da arquitetura modular e histórico de etapas.

---
Deploy automático via GitHub Actions integrado ao Cloudflare Pages.
