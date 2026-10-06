# Roadmap de Melhorias Derivado do Benchmark

## Critério de priorização

Foram privilegiadas funcionalidades que aumentam **rastreabilidade, qualidade da pesquisa e controle operacional** sem depender de perfis de partes, promessas preditivas ou coleta ampla de conteúdo processual. A ordem considera impacto para o uso profissional, aderência à arquitetura já existente e risco de privacidade.

| Prioridade | Melhoria | Valor operacional | Esforço estimado | Salvaguarda necessária | Referência de padrão |
|---|---|---|---|---|---|
| P0 | **Fila de revisão de evidências** | Transforma a pré-validação atual em decisão humana registrada: aprovar, rejeitar, devolver, justificar e versionar. | **Médio** — aproveita usuários, lotes e eventos de auditoria existentes. | Somente administradores; nenhum item entra como precedente confirmado sem fonte e decisão de revisão. | Curadoria de dados e revisão humana da Lex Machina. [2] |
| P0 | **Dossiê de citação e trilha de prova** | Gera pacote exportável por tese/julgado com URL, trecho, status, lote, hash e ressalva metodológica. | **Baixo** — deriva das tabelas de fontes, julgados e teses existentes. | Link oficial obrigatório; vedar texto gerado sem fonte correspondente. | Pesquisa verificável e fontes explícitas em Westlaw/vLex. [3] [4] |
| P1 | **Monitor de alterações de autoridade** | Avisa que uma fonte, tese ou URL oficial exige nova revisão quando houver nova versão, invalidade ou mudança de status. | **Médio-alto** — exige política de periodicidade, responsáveis e execução controlada. | Implantar apenas após política de periodicidade, responsável e registro de falha de coleta; não monitorar processos ou partes por padrão. | Alertas e fluxos de monitoramento por API. [5] |
| P1 | **Score de qualidade da evidência** | Exibe completude objetiva: fonte oficial, número, data, tribunal, inteiro teor, revisão e atualidade. | **Baixo** — cálculo determinístico sobre metadados já persistidos. | O score mede qualidade documental, não probabilidade de êxito ou força jurídica absoluta. | Governança de fonte e explicabilidade. [1] [3] |
| P1 | **Painel de cobertura por fonte** | Mostra fonte, período, tribunais/aliases, falhas, total exato e limitação antes da leitura de um gráfico. | **Médio** — consolida manifestos e eventos de ingestão. | Proibir agregação de bases com escopos distintos sem rótulo. | Painéis temáticos e metadados de DataJud. [1] |
| P2 | **Pesquisa assistida ancorada no Compêndio** | Consulta em linguagem natural que retorna somente teses, julgados e trechos já catalogados, com citações clicáveis. | **Alto** — requer arquitetura de recuperação, avaliação e controles de retenção. | Não responder fora do acervo; revisão humana obrigatória antes de uso profissional; política explícita de retenção. | RAG ancorado em fontes verificáveis. [3] |
| P2 | **Taxonomia de eventos e pedidos** | Codifica tipos de petição, movimento e desfecho como observação documental, permitindo comparação apenas onde houver cobertura suficiente. | **Médio-alto** — necessita protocolo de anotação e amostragem revisada. | Não tratar movimento como decisão, nem produzir taxa de êxito sem desenho e validação. | Classificação de eventos e documentos. [2] [6] |
| P3 | **Alertas/integrações empresariais opcionais** | Futuramente, conectar fontes licenciadas a webhooks e filas internas do EJC. | **Alto** — depende de contratos, segredos, política LGPD e aprovação de integração. | Exigir contrato de fonte, segredo por ambiente, política LGPD e aprovação antes de ativar qualquer conector. | APIs com recursos, autenticação e eventos. [5] |

## Recomendações de não adoção imediata

O Atlas não deve, nesta etapa, criar **ranking de magistrados**, perfis de litigantes, “taxas de vitória”, pontuação de advogados ou previsão de resultado. Sistemas internacionais divulgam esse tipo de análise em bases próprias e com cobertura editorial extensa, mas a transposição automática para dados brasileiros heterogêneos elevaria risco metodológico, reputacional e de proteção de dados. [2] [6]

Também não é recomendável alimentar um modelo generativo com PDFs ou processos em massa. A primeira versão de pesquisa assistida deve ser estritamente **RAG sobre o Compêndio curado**, com resposta limitada ao conjunto de fontes que o Atlas já consegue auditar.

## Sequência sugerida

O próximo ciclo deve entregar a **fila de revisão de evidências** e o **dossiê de citação**, pois ambos aproveitam as tabelas, lotes, fontes e eventos de auditoria já existentes. Depois, o **score documental** e o **painel de cobertura** dão transparência aos dados nacionais. Somente então é recomendável introduzir pesquisa assistida, sempre limitada ao acervo aprovado e com revisão humana.

## Validação de aderência

As prioridades foram confrontadas com a documentação oficial do CNJ/DataJud, Lex Machina, vLex, Jusbrasil, Bloomberg Law e Thomson Reuters. Nenhuma recomendação exige coletar partes, CPF, conteúdo sigiloso ou credenciais em código. As funcionalidades de monitoramento, integração e pesquisa assistida ficam condicionadas a controles adicionais; não foram tratadas como recursos prontos para ativação.

## Referências

[1] [CNJ — DataJud](https://www.cnj.jus.br/sistemas/datajud/)

[2] [Lex Machina — How it Works](https://lexmachina.com/what-we-do/how-it-works/)

[3] [vLex — Modelos, RAG e Privacidade do Vincent](https://support.vlex.com/vincent-by-vlex/vincent/security-privacy-and-compliance/understanding-the-ai-models-used-by-vincent)

[4] [Thomson Reuters — Westlaw Precision](https://legal.thomsonreuters.com/en/products/westlaw-precision)

[5] [Jusbrasil Soluções — Documentação da API](https://api.jusbrasil.com.br/docs/index.html)

[6] [Bloomberg Law — Legal AI](https://pro.bloomberglaw.com/products/ai-and-bloomberg-law/)
