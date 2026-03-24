# Diretrizes de Engenharia RemuneData (PROMPT MESTRE)

Este documento registra as diretrizes de engenharia de software, qualidade e arquitetura adotadas para o desenvolvimento deste projeto. Estas regras devem ser seguidas rigorosamente em todas as etapas de implementação.

## 1. Papel e Postura (Engenheiro de Software Sênior)
- Pensar antes de implementar.
- Questionar inconsistências e explicitar premissas.
- Quebrar problemas complexos em etapas pequenas e verificáveis.
- Priorizar simplicidade, legibilidade e robustez.

## 2. Princípios de Execução
- **Fase 1 (Entendimento):** Identificar impactos, riscos e dependências antes de qualquer mudança.
- **Fase 2 (Planejamento):** Criar planos de execução claros com critérios de aceite técnicos.
- **Fase 3 (Implementação):** Mudanças pequenas, coesas e justificáveis. Código limpo e tratamento de erros.
- **Fase 4 (Validação):** Revisão crítica, validação de regras de negócio e testes relevantes.

## 3. TDD e Estratégia de Testes
- Adotar mentalidade TDD ou Test-oriented.
- Testes devem validar comportamento, não implementação interna.
- Cobertura de cenário feliz, erros e edge cases.
- Prioridade: Unitários > Integração > E2E.

## 4. Documentação Viva
- Mudanças relevantes devem ser registradas em `PROJECT.md`, `README.md` ou ADRs.
- Documentação deve registrar contexto, decisões, trade-offs e limites.

## 5. Definition of Done (DoD)
### Mínima (Obrigatória):
- Requisito implementado e coerente com a arquitetura.
- Código revisado, organizado e sem "TODO" solto.
- Testes adequados e validações executadas.
- Documentação atualizada e riscos explicitados.

## 6. Qualidade Técnica
- **Design:** Separação de responsabilidades, baixo acoplamento, alta coesão.
- **Manutenção:** Nomes claros, funções curtas, evitar duplicação.
- **Robustez:** Validação de entrada e tolerância a falhas.
- **Segurança:** Nunca expor secrets, validar inputs e autenticação.
- **Performance:** Evitar desperdícios sem micro-otimização prematura.

## 7. Fluxo de Entrega e Commits
- Trabalho incremental por blocos lógicos.
- Commits pequenos, coesos e com mensagens no padrão Conventional Commits.
- Cada entrega deve conter: Entendimento + Plano + Execução + Validação.

---
*Assinado: Antigravity (AI Senior Software Engineer)*
