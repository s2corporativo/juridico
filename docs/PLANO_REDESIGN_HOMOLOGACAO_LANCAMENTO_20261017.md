# Atlas Forense + JuridIA — Redesign, homologação e plano de 30 dias

**Data-base:** 17/10/2026. **Branch:** `feat/atlas-juridia-design-system-20261017`.
**Escopo:** experiência e comunicação; não alterar regras jurídicas, contas, sigilo, fontes ou migrações.

## 1. Planta do produto e público
O Atlas é o ambiente de pesquisa e verificação de fontes; a JuridIA é o ambiente autenticado de pesquisa aplicada, análise, documentos e curadoria, com revisão humana. Não tratar a plataforma como venda aberta de serviços jurídicos nem inventar prova social, avaliações ou resultados.

### Hierarquia de rotas e percurso
1. Atlas `/`: mensagem de proveniência, acesso ao compêndio, resumo do acervo, filtros e limites dos dados.
2. Atlas `/compendio`: pesquisa, fichas, fontes e necessidade de validação.
3. Atlas `/juridia`: acesso integrado conforme configuração SSO; mostrar bloqueio quando não habilitado.
4. JuridIA `/`: início autenticado com quatro ações — elaborar documento, pesquisar fundamentos, analisar caso e consultar biblioteca; ferramentas especializadas em menu secundário.
5. JuridIA `landing`: descrição institucional, etapas de trabalho, uso restrito e limites jurídicos.

### Identidade
- Base clara `#f7f9f6`, verde institucional `#123b2c`, dourado discreto `#bb985e`.
- Superfícies brancas, bordas suaves, hierarquia tipográfica consistente, cards com títulos legíveis.
- Ícones `lucide-react`, sem biblioteca adicional e sem fotos ou depoimentos inventados.
- Hierarquia: uma ação principal por seção; recursos especializados ficam em navegação secundária.

## 2. Hero e mensagens para teste editorial
**Atual Atlas:** “Pesquisa jurídica com origem verificável.”  
**Atual JuridIA:** “Inteligência jurídica com método, fontes e revisão.”

Alternativas de título a testar **somente se os dados comportarem comparação**:
1. “Do fundamento à referência: pesquise com proveniência.”
2. “Pesquisa e redação jurídica sem perder a rastreabilidade.”
3. “Fontes verificáveis para decisões jurídicas mais informadas.”

CTA principal do Atlas: “Pesquisar acervo”; secundário: “Mais recursos”.
CTA principal da JuridIA: “Acessar plataforma”; secundário: “Consultar Atlas”.
Não mencionar “ganhar processos”, probabilidade de sucesso, LGPD totalmente garantida, aprovação automática ou uso de precedentes não verificados.

## 3. Comportamento e acessibilidade
- Indicador `:focus-visible` em navegação, cards e botões; elementos de toque preferencialmente ≥ 40 px.
- Estado selecionado, erro, vazio e carregamento devem ser distinguíveis sem depender apenas de cor.
- Menu avançado fora do contêiner que corta a rolagem horizontal no mobile.
- Responsividade de referência: até 700px, 701–1100px, acima de 1100px.
- Respeitar `prefers-reduced-motion`; proibir animações infinitas decorativas e movimento de indicadores operacionais.
- Alvo WCAG 2.2 AA, **a aferir** por testes reais de teclado e leitores de tela.

## 4. Componentes e divisão de responsabilidade
- `apps/juridia/src/components/landing/hero.tsx`: hero institucional reutilizável do produto.
- `apps/juridia/src/components/app/dashboard.tsx`: dashboard com dados reais, estado de erro e quatro ações.
- `apps/juridia/src/components/app/index.tsx`: navegação operacional e menu de ferramentas.
- `apps/juridia/src/app/globals.css`: tokens e estilos responsivos; sem folha duplicada.
- `apps/atlas-forense/client/src/pages/Home.tsx`: percurso público e barra de ações.
- `apps/atlas-forense/client/src/index.css`: identidade editorial do Atlas.
Sem criar dependências, backend adicional, duplicação de layout ou módulos.

## 5. Auditoria de conversão (CRO funcional, não publicidade)
**Conversão do produto interno:** iniciar uma tarefa útil e concluí-la com revisão; **não** confundir clique com documento juridicamente apto.

| Etapa | Atrito a investigar | Medida, sem dados pessoais |
| --- | --- | --- |
| Entrada | não identificar pesquisa/documentos | distribuição agregada de acessos por área, quando houver instrumentação consentida |
| Ação | esforço até abrir a ferramenta | taxa `inícios_de_tarefa / sessões_autenticadas` |
| Produção | falha de API ou espera excessiva | taxa de tarefas concluídas e p95 de tempo de resposta |
| Revisão | documento gerado sem revisão | taxa de revisão humana confirmada; não usar como “êxito jurídico” |
| Pesquisa | referência com origem incerta | fração de resultados com fonte oficial comprovada |

**Instrumentação:** métricas agregadas, minimização e retenção definida; **não** enviar CPF/CNPJ, partes, texto de processos, prompts ou documentos a analytics. Não declarar métricas medidas antes de configurar e homologar coleta.

## 6. Três experimentos prioritários
1. **Navegação:** menu avançado separado versus configuração anterior. Hipótese: reduzir erros de toque/rolagem mobile. Critério: menos falhas de interação observadas em cinco tarefas assistidas e ausência de regressão de teclado.
2. **Primeira ação:** CTA único “Criar documento” no dashboard. Hipótese: reduzir tempo para iniciar minuta. Medida: mediana de segundos do início à abertura do gerador, em tarefas sintéticas de QA.
3. **Compreensão de fontes:** texto “origem verificável” junto ao CTA Atlas. Hipótese: usuários identificam melhor que precisam validar fonte. Medida: proporção que consegue localizar fonte e data durante teste de usabilidade.

Com pouco tráfego, realizar testes qualitativos sequenciais; não declarar significância estatística por poucos cliques.

## 7. Checklists e calendário de lançamento
### Pré-publicação — bloqueios
- [ ] Testar com usuário real autenticado e perfil de menor privilégio, desktop e mobile.
- [ ] Comprovar SSO OIDC/PKCE, autorização entre serviços e retorno/erros de sessão.
- [ ] Build + tipagem + lint + regressão do SHA exato.
- [ ] Verificar página inicial, navegação, formulário, documentos, editor, pesquisa e exportação.
- [ ] Verificar LCP, INP, CLS com ferramentas reais (alvos usuais: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 no p75, se houver amostra).
- [ ] Revisar contraste, rótulos, teclado, zoom 200%, redução de movimento, mobile 320px.
- [ ] Backup de produção **restaurado e verificado** (SQLite, MariaDB, arquivos e configurações).
- [ ] Gateway CI GitHub e rollback funcional, com versão anterior preservada.
- [ ] Smoke autenticado e observabilidade após corte.
**Sem concluir os gates acima, não fazer corte de produção.**

### Primeiros 30 dias (contados da publicação efetiva)
- **Dias 1–3:** smoke de produção e checagens de erros de navegação; observação de acesso e autorização, sem coletar processos.
- **Dias 4–7:** cinco tarefas de usabilidade com profissionais autorizados; corrigir erros P0/P1.
- **Semana 2:** verificar filtros, pesquisa e início de minutas; estudar atritos com dados agregados.
- **Semana 3:** um experimento editorial por vez; avaliar desempenho mobile.
- **Semana 4:** consolidar regressões, listar decisões, avaliar estabilidade e manter o layout vencedor.

**Ritmo:** revisão semanal; incidentes graves são tratados imediatamente.
**Parar de mexer na interface:** quando P0/P1 zerados por duas revisões, sem queda de desempenho nem falhas nos fluxos críticos, e ajustes subsequentes não revelarem ganhos validados. Não confundir ausência de feedback com evidência de melhoria.

## 8. Estado e limites de homologação
Os builds e testes automatizados não substituem teste de navegador real, analytics configurado, SSO funcional, restauração ou promoção. As pendências técnicas externas ao CSS devem permanecer explícitas.
