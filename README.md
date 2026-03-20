# RemuneData Frontend

Interface web para a plataforma de transparência RemuneData.

## Stack
- **Framework**: [Vue 3](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Router**: [Vue Router](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/)

## Instalação

### Pré-requisitos
- Node.js (v18+)
- npm

### Passo a passo
1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` (baseado no `.env.example`, se disponível).
4. Rode o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

## Scripts Disponíveis
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera o build de produção.
### Qualidade e CI/CD
- **Lint & Typecheck**: `npm run lint` e `npm run typecheck`
- **Testes**: `npm run test:run` (Vitest)
- **CI/CD**: GitHub Actions com deploy automático no Cloudflare Pages após sucesso nos testes.

## 🚀 Deploy e CI/CD

Este projeto utiliza GitHub Actions para automação de testes e deploy.

### Pipeline de Qualidade (PRs)
Toda Pull Request para as branches principais dispara uma validação completa:
- Instalação de dependências (npm ci)
- Verificação de Lint
- Verificação de Tipagem (TypeScript)
- Execução de Testes Unitários
- Teste de Build

### Pipeline de Produção
Pushes na branch `main` executam todos os checks de qualidade e, em caso de sucesso, realizam o deploy direto para o **Cloudflare Pages** através do Wrangler.

Para mais detalhes sobre a configuração, consulte [Guia de Deploy Cloudflare Pages](docs/deploy-cloudflare-pages.md).
- `npm run test`: Executa os testes unitários.
- `npm run lint`: Executa o linting do código.
- `npm run format`: Formata o código com Prettier.

## Estrutura de Pastas
Consulte o arquivo [PROJECT.md](./PROJECT.md) para detalhes da arquitetura.
