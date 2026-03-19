# Plano Formal de Desenvolvimento do Frontend Vue - RemuneData

## 1. Objetivo

Este documento define o plano formal de desenvolvimento do frontend web do projeto **RemuneData**, responsável por consumir a API de remuneração e disponibilizar uma experiência de consulta pública, visualização analítica e monitoramento operacional.

O frontend deverá ser desenvolvido em **Vue**, com foco em:

- consulta pública de remuneração de servidores;
- dashboard analítico com métricas úteis ao cidadão;
- preparação para um módulo administrativo de monitoramento de coletas;
- experiência moderna, responsiva, acessível e escalável;
- integração robusta com a API existente.

---

## 2. Escopo do Produto

### 2.1 Escopo da primeira versão (MVP)

A primeira versão do frontend deverá contemplar:

- Dashboard inicial com indicadores principais;
- Tela de consulta de remuneração com filtros e paginação;
- Exportação de resultados respeitando os limites definidos pela API;
- Tratamento de estados de loading, empty state e erro;
- Persistência de filtros na URL;
- Estrutura técnica preparada para futura autenticação.

### 2.2 Escopo futuro

Itens previstos para evolução posterior:

- módulo administrativo completo de monitoramento de execuções;
- autenticação/autorização;
- autocomplete de filtros;
- ordenação avançada via backend;
- dashboards históricos e comparativos;
- observabilidade ampliada do frontend;
- internacionalização, caso necessário.

---

## 3. Contexto Funcional

O backend atual já oferece três pilares que orientam o frontend:

1. **Busca Rica de Remuneração**
   - consulta paginada por nome, CPF, cargo, órgão, ano e mês;

2. **Dashboard Analítico**
   - resumo agregado de servidores, gasto bruto, média salarial e ranking de órgãos;

3. **Motor de Coleta / Execuções**
   - listagem, acompanhamento, detalhe e exportação de execuções anuais.

O produto atende principalmente dois perfis:

- **Cidadão:** deseja consultar e entender gastos públicos com clareza;
- **Gestor/Analista:** deseja observar tendências, rankings e distribuições.

---

## 4. Premissas Técnicas

- O frontend consumirá a API via HTTP/JSON.
- A API atualmente não exige autenticação para consulta pública.
- O endpoint `/summary` possui cache de 60 segundos.
- A paginação da busca de remuneração começa em `1`.
- O tamanho máximo recomendado por página é `150`.
- O backend não suporta ordenação dinâmica por query param.
- O CPF retornado pelo backend deve ser tratado como texto informativo.
- O frontend deve estar preparado para futura introdução de autenticação via header/token.

---

## 5. Stack Recomendada

### 5.1 Base do projeto

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios
- Vue Query (ou equivalente para gerenciamento de cache/fetch)
- Vitest
- Vue Testing Library
- Playwright

### 5.2 UI e visualização

- Tailwind CSS ou framework equivalente
- biblioteca de componentes reutilizáveis
- Chart.js ou ECharts para gráficos
- ícones e tokens visuais padronizados

---

## 6. Arquitetura Recomendada do Frontend

    src/
      app/
        router/
        providers/
        layouts/
      core/
        http/
        config/
        types/
        constants/
        formatters/
        utils/
        guards/
      shared/
        components/
        composables/
        stores/
        ui/
      modules/
        dashboard/
          components/
          views/
          services/
          types/
        remuneration/
          components/
          views/
          services/
          types/
        executions/
          components/
          views/
          services/
          types/
      assets/

### 6.1 Diretrizes arquiteturais

- separar UI, regras de negócio e consumo HTTP;
- centralizar o client HTTP e interceptors;
- manter contratos tipados com base nos schemas da API;
- desacoplar componentes visuais da lógica de fetch;
- manter filtros sincronizados com query params;
- isolar módulos por domínio funcional.

---

## 7. Requisitos Funcionais

### 7.1 Dashboard

O sistema deverá:

- exibir o total de servidores;
- exibir o valor total bruto;
- exibir a média salarial bruta;
- exibir ranking de órgãos;
- permitir navegação para a busca já filtrada ao interagir com um órgão;
- indicar o ano de referência do resumo;
- suportar loading elegante na primeira carga.

### 7.2 Consulta de Remuneração

O sistema deverá:

- permitir filtro por nome;
- permitir filtro por CPF;
- permitir filtro por cargo;
- permitir filtro por órgão;
- permitir filtro por ano;
- permitir filtro por mês;
- listar resultados em tabela paginada;
- exibir coluna de referência temporal;
- exibir valores formatados em BRL;
- tratar lista vazia;
- tratar página além do limite;
- permitir exportação do contexto filtrado.

### 7.3 Monitor de Execuções

O sistema deverá, em módulo próprio:

- listar execuções disponíveis;
- exibir detalhe de execução por ID;
- exibir status mensal de coleta;
- exibir total de registros coletados;
- sinalizar execução em andamento;
- suportar exportação por execução;
- prever ação de disparo de nova coleta em ambiente protegido.

---

## 8. Requisitos Não Funcionais

### 8.1 Performance

- aplicar debounce de 300ms a 500ms na busca textual;
- evitar refetch desnecessário do dashboard dentro da janela de cache;
- manter headers/estrutura visível durante loading parcial;
- evitar payloads excessivos;
- respeitar limites de exportação definidos pela API.

### 8.2 Usabilidade

- filtros persistidos na URL;
- mensagens claras para estados vazios e erros;
- feedback claro para limites de exportação;
- navegação intuitiva entre dashboard e busca;
- layout adaptado para desktop, tablet e mobile.

### 8.3 Qualidade

- tipagem forte em services, composables e modelos;
- cobertura de testes unitários e de integração;
- componentes reutilizáveis;
- tratamento global de erros;
- padrão visual consistente.

### 8.4 Segurança e robustez

- preparar interceptors para autenticação futura;
- sanitizar e validar parâmetros de entrada no frontend;
- não tentar contornar limites do backend;
- evitar lógica sensível baseada em CPF;
- não assumir ordenação global sem suporte da API.

---

## 9. Regras de Negócio e Cuidados

1. O CPF retornado pode vir mascarado e não deve ser tratado como dado confiável para validação rígida.
2. A ordenação dinâmica não é suportada pela API nesta fase.
3. A ordenação local, se aplicada, deve afetar apenas os dados já carregados na página atual.
4. O endpoint de resumo pode demorar mais na primeira carga antes do cache.
5. A exportação possui limites fixos:
   - XLSX: até 1.000 registros
   - CSV: até 5.000 registros
6. O frontend não deve contornar esses limites paginando e consolidando exportações por conta própria.
7. Caso o usuário não filtre por ano, resultados de anos diferentes podem ser exibidos.
8. Se uma execução estiver com status `running`, o sistema deve informar que os dados ainda estão em atualização.

---

## 10. Fases do Desenvolvimento

## Fase 1 - Descoberta, alinhamento e preparação técnica

### Objetivo
Consolidar requisitos, estruturar a base técnica e estabelecer a arquitetura inicial do frontend.

### Tarefas
- revisar toda a documentação da API;
- consolidar requisitos funcionais e não funcionais;
- definir stack final do projeto Vue;
- criar o projeto base com Vue + TypeScript;
- configurar roteamento inicial;
- configurar variáveis de ambiente;
- configurar cliente HTTP;
- criar estrutura de pastas por domínio;
- definir padrão de tipagem e convenções do projeto;
- criar formatadores utilitários iniciais.

### Entregáveis
- projeto inicial configurado;
- arquitetura base definida;
- convenções documentadas;
- client HTTP funcional;
- tipagens base criadas.

### Critérios de aceite
- projeto sobe localmente sem erros;
- existe separação clara entre módulos, serviços e UI;
- variáveis de ambiente estão configuradas;
- client HTTP está apto a consumir a API;
- há interceptors preparados para futura autenticação.

---

## Fase 2 - Modelagem dos contratos e serviços da API

### Objetivo
Implementar a camada de integração com a API de forma segura, tipada e reutilizável.

### Tarefas
- mapear contratos de request/response;
- criar tipos para:
  - remuneração;
  - summary;
  - execuções;
  - detalhe de execução;
  - erros de API;
- implementar services para:
  - `GET /remuneration/`
  - `GET /remuneration/summary`
  - `GET /executions/`
  - `GET /executions/{id}`
  - `POST /executions/`
  - `GET /executions/{id}/export`
  - `GET /health`
- implementar normalização de respostas, quando necessário;
- centralizar tratamento de erro.

### Entregáveis
- camada de serviços implementada;
- contratos tipados;
- tratamento base de erro definido.

### Critérios de aceite
- todos os endpoints essenciais podem ser consumidos pela camada de serviço;
- contratos estão tipados e reutilizáveis;
- erros 400, 404 e 500 são tratados de forma consistente;
- chamadas estão isoladas da camada visual.

---

## Fase 3 - Layout base, navegação e componentes compartilhados

### Objetivo
Construir a base visual e navegacional da aplicação.

### Tarefas
- criar layout principal da aplicação;
- definir navegação principal;
- criar página inicial/base;
- criar componentes compartilhados:
  - botão;
  - input;
  - select;
  - tabela;
  - paginação;
  - skeleton;
  - empty state;
  - toast/alerta;
  - badges de status;
- criar utilitários de formatação:
  - moeda;
  - datas;
  - status;
  - labels de competência.

### Entregáveis
- design system inicial;
- layout e navegação funcional;
- biblioteca mínima de componentes compartilhados.

### Critérios de aceite
- componentes base estão reutilizáveis;
- navegação entre rotas funciona corretamente;
- layout é responsivo em nível básico;
- estados visuais padrão já existem.

---

## Fase 4 - Dashboard analítico

### Objetivo
Entregar a tela inicial com visão resumida e navegável dos dados públicos.

### Tarefas
- criar view do dashboard;
- integrar com `GET /remuneration/summary`;
- implementar cards de KPI:
  - total de servidores;
  - valor total bruto;
  - média salarial bruta;
- implementar gráfico/ranking de órgãos;
- exibir ano de referência;
- implementar skeletons para carregamento inicial;
- permitir clique em órgão para redirecionar à busca filtrada;
- tratar indisponibilidade do summary.

### Entregáveis
- dashboard funcional;
- cards e gráfico integrados à API;
- navegação por drill-down para a busca.

### Critérios de aceite
- o dashboard carrega corretamente os indicadores principais;
- o ranking de órgãos é exibido corretamente;
- o clique em um órgão leva à tela de busca com filtro aplicado;
- loading, erro e vazio estão tratados;
- a experiência suporta a primeira carga mais lenta.

---

## Fase 5 - Consulta de remuneração

### Objetivo
Entregar a principal funcionalidade pública da aplicação: busca detalhada e paginada de remunerações.

### Tarefas
- criar tela de busca de remuneração;
- implementar formulário de filtros;
- aplicar debounce na busca por nome;
- sincronizar filtros com query params da URL;
- consumir `GET /remuneration/`;
- renderizar tabela com colunas:
  - servidor;
  - CPF;
  - órgão;
  - cargo;
  - valor bruto;
  - valor líquido;
  - ano;
  - mês/referência;
- implementar paginação;
- tratar página sem dados;
- tratar lista vazia;
- tratar erro de parâmetros inválidos;
- manter cabeçalho e filtros estáveis durante loading parcial.

### Entregáveis
- tela de busca funcional;
- filtros persistidos na URL;
- tabela paginada integrada à API.

### Critérios de aceite
- todos os filtros principais funcionam;
- a paginação respeita `page`, `size`, `pages` e `total`;
- o debounce evita requisições excessivas;
- ao recarregar a página, o estado da busca é preservado pela URL;
- resultados vazios são tratados visualmente;
- ano e mês ficam claros quando não houver filtro de ano.

---

## Fase 6 - Exportação e feedback de limites

### Objetivo
Permitir ao usuário exportar dados com clareza e segurança operacional.

### Tarefas
- implementar fluxo de exportação por contexto;
- permitir exportação em CSV/XLSX quando aplicável;
- exibir aviso de limitação antes ou durante exportação;
- informar truncamento quando o total exceder o limite suportado;
- validar UX para cenários de exportação ampla;
- registrar comportamento esperado em documentação.

### Entregáveis
- botões/fluxos de exportação;
- mensagens de orientação ao usuário;
- prevenção de uso incorreto.

### Critérios de aceite
- exportação respeita os limites do backend;
- o usuário é avisado quando houver truncamento;
- não existe tentativa de contornar o limite por múltiplas requisições automáticas;
- o fluxo é compreensível e não ambíguo.

---

## Fase 7 - Monitor de execuções

### Objetivo
Implementar o módulo de acompanhamento operacional das coletas.

### Tarefas
- criar listagem de execuções;
- consumir `GET /executions/`;
- criar tela de detalhe;
- consumir `GET /executions/{id}`;
- renderizar status mensal de coleta;
- exibir total de registros coletados;
- exibir badge visual por status:
  - pending
  - running
  - success
  - partial_success
  - error
- exibir mensagem de dados em atualização quando aplicável;
- preparar ação de disparo de coleta via `POST /executions/` para contexto administrativo;
- implementar exportação por execução.

### Entregáveis
- módulo de execuções funcional;
- detalhe de execução implementado;
- estados operacionais claros.

### Critérios de aceite
- a listagem exibe execuções de forma compreensível;
- o detalhe exibe o desdobramento mensal corretamente;
- status são claramente diferenciados visualmente;
- execuções em andamento informam dados parciais;
- erro de ID inexistente é tratado com tela/mensagem apropriada.

---

## Fase 8 - Tratamento global de erros, acessibilidade e refinamento

### Objetivo
Refinar a aplicação para produção, com foco em robustez, UX e qualidade final.

### Tarefas
- criar página 404;
- criar fallback para 500/indisponibilidade;
- padronizar mensagens de erro;
- revisar responsividade geral;
- revisar acessibilidade:
  - foco visível;
  - labels;
  - contraste;
  - navegação por teclado;
- revisar consistência visual;
- revisar feedbacks e microinterações;
- revisar comportamento de back/forward do navegador;
- revisar estados de loading.

### Entregáveis
- tratamento global de erros;
- melhoria de acessibilidade;
- refinamento final de UX.

### Critérios de aceite
- aplicação lida corretamente com falhas de API;
- navegação é estável e previsível;
- páginas críticas são acessíveis;
- principais jornadas funcionam em diferentes tamanhos de tela;
- a experiência final está coerente e pronta para validação.

---

## Fase 9 - Testes e validação de qualidade

### Objetivo
Assegurar confiabilidade do frontend por meio de testes automatizados e validação manual.

### 9.1 Testes unitários

#### Tarefas
- testar formatadores de moeda;
- testar formatadores de data;
- testar helpers de query params;
- testar mapeamento de contratos;
- testar lógica de paginação;
- testar renderização de badges/status.

#### Critérios de aceite
- cobertura adequada das regras utilitárias críticas;
- testes passam localmente e em CI.

### 9.2 Testes de integração

#### Tarefas
- testar integração dos services com mocks;
- testar fluxo de dashboard;
- testar fluxo de busca de remuneração;
- testar paginação;
- testar filtros;
- testar tratamento de erro 400/404/500;
- testar persistência de estado na URL.

#### Critérios de aceite
- cenários principais de integração estão validados;
- mudanças nos contratos quebram testes previsivelmente.

### 9.3 Testes end-to-end

#### Tarefas
- abrir dashboard e validar KPIs;
- clicar em órgão e navegar para busca filtrada;
- buscar por nome;
- navegar entre páginas;
- validar empty state;
- validar erro de parâmetro inválido;
- validar fluxo de exportação;
- abrir detalhe de execução;
- validar aviso de dados em atualização.

#### Critérios de aceite
- principais jornadas do usuário funcionam ponta a ponta;
- regressões críticas são detectáveis automaticamente.

### 9.4 Testes manuais

#### Tarefas
- validar experiência mobile;
- validar legibilidade da tabela;
- validar contraste;
- validar navegação por teclado;
- validar comportamento com API fora do ar;
- validar botão voltar e histórico do navegador.

#### Critérios de aceite
- principais fluxos funcionam manualmente sem quebra visual ou funcional.

---

## 11. Backlog Inicial Estruturado

### Épico 1 - Fundação do Projeto
- setup Vue + TypeScript
- roteamento
- ambiente/configuração
- client HTTP
- interceptors
- estrutura de pastas

### Épico 2 - Base Visual
- layout principal
- componentes compartilhados
- skeletons
- tabelas
- paginação
- feedback visual

### Épico 3 - Dashboard
- summary
- cards
- ranking de órgãos
- drill-down

### Épico 4 - Consulta Pública
- filtros
- URL state
- tabela paginada
- loading/erro/empty

### Épico 5 - Exportação
- CSV/XLSX
- tratamento de limite
- mensagens de orientação

### Épico 6 - Execuções
- listagem
- detalhe
- exportação
- futura ação de disparo

### Épico 7 - Qualidade
- testes
- acessibilidade
- responsividade
- refinamento final

---

## 12. Ordem Recomendada de Implementação

1. fundação técnica do projeto;
2. client HTTP e contratos tipados;
3. layout base e componentes compartilhados;
4. dashboard;
5. consulta de remuneração;
6. paginação e URL state;
7. exportação;
8. módulo de execuções;
9. tratamento global de erros;
10. testes e refinamentos finais.

---

## 13. Riscos e Dependências

### Riscos
- ausência de ordenação dinâmica via API pode limitar experiências analíticas mais avançadas;
- filtros textuais amplos podem gerar alto volume de resultados;
- exportação limitada pode exigir UX cuidadosa;
- futuras mudanças no backend podem afetar contratos;
- dashboard pode sofrer com primeira carga sem cache.

### Dependências
- disponibilidade do backend local e de homologação;
- definição da base URL por ambiente;
- confirmação do escopo do módulo administrativo;
- eventual padronização visual/design system;
- confirmação futura sobre autenticação e proteção de rotas.

---

## 14. Definição de Pronto (Definition of Done)

Uma fase ou funcionalidade será considerada pronta quando:

- estiver implementada conforme escopo;
- possuir tratamento de loading, erro e vazio;
- tiver testes aplicáveis implementados;
- respeitar contratos da API;
- estiver responsiva;
- estiver validada manualmente;
- estiver documentada minimamente;
- não introduzir regressões nos fluxos existentes.

---

## 15. Conclusão

Este plano organiza o desenvolvimento do frontend Vue do RemuneData de forma progressiva, segura e orientada a valor.

A recomendação é iniciar pela entrega de um **MVP público**, priorizando:

- Dashboard;
- Consulta de Remuneração;
- Exportação;
- Base técnica sólida.

O módulo de execuções pode evoluir em seguida, preferencialmente em rota protegida ou contexto administrativo separado.

Com isso, o projeto entrega valor cedo ao cidadão, mantém clareza de escopo e reduz riscos técnicos logo nas primeiras fases.
