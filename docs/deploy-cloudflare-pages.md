# Deploy Cloudflare Pages - RemuneData Web

Este guia fornece instruções detalhadas para configurar e operar o pipeline de CI/CD para o RemuneData Web no Cloudflare Pages.

##  Estratégia de Deploy: Direct Upload

Diferente do fluxo padrão de integração com o Git da Cloudflare, utilizamos o **GitHub Actions** para realizar o build e o upload direto dos artefatos. Isso garante que o deploy só ocorra se **100% dos testes e validações passarem**.

---

## 🅰️ Na Cloudflare (Setup Inicial)

1. **Acessar Dashboard**: Vá em `Workers & Pages` > `Create application` > `Pages` > `Upload assets`.
2. **Nome do Projeto**: Defina o nome (ex: `remunedata-web`). Este nome será usado no GitHub Secrets.
3. **Primeiro Deploy (Manual)**: Você pode fazer um upload de uma pasta `dist` vazia apenas para criar o projeto, ou aguardar o primeiro deploy via GitHub Actions.
4. **Obter IDs**:
   - **Account ID**: Disponível na barra lateral direita da dashboard principal ou na URL (após `/dash/`).
   - **Project Name**: O nome escolhido no passo 2.

---

## 🅱️ No GitHub (Secrets)

No seu repositório, vá em `Settings > Secrets and variables > Actions` e crie os seguintes **Repository Secrets**:

| Secret | Descrição | Exemplo |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Token com permissão de editar Pages | *Veja seção C* |
| `CLOUDFLARE_ACCOUNT_ID` | ID da sua conta Cloudflare | `abc123...` |
| `CLOUDFLARE_PAGES_PROJECT_NAME` | Nome do projeto no Pages | `remunedata-web` |
| `VITE_API_URL` | URL da API de produção | `https://api.remunedata.com` |

---

## 🅲 Criação do Token Cloudflare

Para gerar o `CLOUDFLARE_API_TOKEN`:
1. Vá em `My Profile > API Tokens > Create Token`.
2. Use o template **"Edit Cloudflare Pages"** ou configure manualmente:
   - **Account** > **Cloudflare Pages** > **Edit**
3. Restrinja o acesso à sua conta específica para maior segurança.

---

## 🅾️ Operação do Deploy

1. **Pull Requests**: Sempre abra um PR para `main`. O workflow de CI validará seu código automaticamente.
2. **Merge**: Ao realizar o merge, o workflow `Production Deploy` iniciará.
3. **Validação**: Acompanhe o progresso na aba `Actions` do GitHub.
4. **Link**: Após o sucesso, sua aplicação estará disponível em `https://[projeto].pages.dev`.

---

## ️ Troubleshooting & Questões Comuns

### 1. Erro de Token Inválido
Verifique se o token tem a permissão `Cloudflare Pages: Edit` e se não expirou.

### 2. SPA com 404 em rotas profundas
O projeto já inclui um arquivo `public/_redirects` com a regra `/* /index.html 200`. Certifique-se de que ele está presente na pasta `dist/` após o build.

### 3. Falha no Build por Variáveis de Ambiente
Verifique se o Secret `VITE_API_URL` foi adicionado ao GitHub. O build no CI depende dele para injetar a URL correta no código.

### 4. Rollback
Se precisar reverter um deploy:
1. Vá na dashboard do Cloudflare Pages.
2. Localize o deploy anterior bem-sucedido.
3. Clique nos três pontos e selecione "Rollback to this deployment".

---
*Documentação atualizada em 20/03/2026.*
