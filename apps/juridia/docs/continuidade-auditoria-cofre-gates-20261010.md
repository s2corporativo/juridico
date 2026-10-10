# Continuidade da auditoria — JuridIA/Atlas, cofre de provas e gates

**Data:** 10/10/2026  
**Commit de código compilado e testado:** `3c1007a` na branch `fix/juridia-rag-safety-audit-20261010`  
**Ambiente:** worktree isolado `/opt/atlas-juridico/audit-vps-rag-20261010`; banco de homologação SQLite e MariaDB staging; sem corte de produção.  
**Decisão:** **NO-GO** para publicação como IA jurídica profissional autônoma.

## Corrigido nesta execução

1. **Originais preservados com autorização por processo**. Antes o upload guardava apenas excertos e SHA-256. Novo `src/lib/private-originals.ts` mantém o arquivo original no cofre privado, fora do `public/`, por hash SHA-256 do caso e do conteúdo; rejeita traversal e symlinks, limita a 8 MB, usa permissões de diretório 0700, arquivo 0600 e publicação atômica após `fsync`.
2. **Criptografia AES-256-GCM autenticada**. A chave de 32 bytes é fornecida por `JURIDIA_PRIVATE_UPLOAD_KEY` (64 hex) em segredo de infraestrutura. Sem chave/diretório válido, **não arquiva**; quando o cofre está explicitamente configurado mas falha, o upload responde 503 e não afirma retenção.
3. **Rastreabilidade**. `EvidenceRef.documentHash` e `metadata.originalRetained` relacionam o arquivo ao caso; o upload vincula citações com trechos/páginas e registra auditoria sem texto privado. O mesmo hash não é gravado novamente quando já existe um objeto íntegro.
4. **Download seguro**. Nova rota `GET /api/originals?caseId=...&hash=...`: exige sessão e propriedade do caso ou administrador; exige evidência vinculada com marca de original arquivado; revalida integridade, gera download como anexo com `no-store`, `nosniff` e registra evento de auditoria. Arquivo adulterado recusa download (503).
5. **UI do Cérebro**. Exibe link autorizado de recuperação quando há original; indicação visual diferente quando original não foi guardado. Corrigido identificador fantasma `cerebro-session`: histórico e vínculo usam apenas o ID de um caso real autorizado. Removida promessa imprecisa de pesquisa jurídica em todas as etapas.
6. **Auditoria do cofre**. Novo `scripts/audit-private-originals.ts` percorre evidências marcadas `originalRetained=true` e verifica existência, autenticação GCM e hash do arquivo. Relata totais, não revela nomes nem caminhos. Bloqueia a liberação quando os parâmetros do cofre não existem ou há objetos ilegíveis.
7. **Gate de publicação de conhecimento**. Novo `scripts/knowledge-release-readiness.ts` lê o acervo e emite JSON com bloqueadores concretos; **não** transforma sucesso da compilação em licença para liberar pareceres. Os controles externos e revisão humana não podem ser aprovados automaticamente.

## Testes e evidências executados

| Gate | Resultado |
|---|---|
| JuridIA `tsc --noEmit` | **Aprovado** |
| JuridIA Bun | **106 testes, 180 verificações, 0 falhas**, 14 arquivos |
| JuridIA `next build` | **Aprovado** no commit `3c1007a` |
| Atlas TypeScript e Vitest | **216 testes, 48 arquivos**, aprovados |
| HTTP cofre sem criptografia (fase estrutural) | 18/18; duas verificações de nomes de header corrigidas |
| HTTP cofre criptografado AES-GCM | **19/19**, com A, B e administrador fictícios |
| Arquivo adulterado | Download 503; reupload sobre objeto corrompido recusado |
| Ensaio de backup + restore criptografado | Cópia do arquivo original cifrado restaurada e validada; ao adulterar 1 byte o gate passa a bloquear |
| Testes unitários de cofre | Sem root configurado, symlink, traversal, dedup, chave incorreta, hash, restauração: aprovados |
| Bancos original e staging | `PRAGMA integrity_check=ok`; originais do usuário não alterados |
| Serviços `atlas-juridico`, `dpt-erp`, `dpt-notificacao` | **Ativos** no encerramento |
| Release apontado em produção | `/opt/atlas-juridico/releases/20260909-011059` — **não alterado** |

### Resultado objetivo do gate de conhecimento

`DATABASE_URL=file:/opt/atlas-juridico/staging/juridia-fts-homologation.db bun scripts/knowledge-release-readiness.ts`

**Exit code 2 / releaseBlocked=true**. Indicadores de staging:

- LegalSource: **717**, assinadas por humano **0**, atualização comprovada nos últimos 30 dias **0**, URLs oficiais inválidas **0**.
- SkillVersion: **2.000**, com aprovação automática **2.000**, revisadas por humano **0**.
- KnowledgeDocument sem URL: **249**.
- Templates: **10**.
- Conjunto-ouro jurídico assinado por advogado: **0/60**.
- Cofre de documentos originais: aprovado **funcionalmente em testes isolados**, mas **não configurado nem habilitado** no ambiente padrão da futura produção.
- Integrações e rollback final: gate humano externo pendente.
- Atlas STJ HTTP **200**, DJEN HTTP **403**. MariaDB staging registrou 1 execução editorial em `failed` e nenhum candidato aprovado.

### Qualidade real do modelo jurídico

As avaliações anteriores de Qwen3 4B e Qwen3 4B Instruct não alcançaram a latência ou robustez requeridas. Um teste de precedente sem fonte oficial produziu afirmação negativa não fundamentada em 106,61s; outro excedeu o prazo de resposta. A política de liberação de IA externa continua desativada por padrão, e o modelo local não deve ser ativado para atendimento profissional sem nova prova de qualidade, recursos de inferência adequados e revisão humana.

## O que permanece bloqueado (não automatizar aprovação)

1. **Fontes oficiais e skills**: 717 artigos/precedentes e 2.000 skills requerem revisão humana individual documentada. Não converter identificadores automáticos em `human:` por script.
2. **Ingestão Atlas, STJ e DJEN**: regularizar autorização/consistência do DJEN sem contorno de restrição; assegurar captura e exportação do inteiro teor com citações verificadas (snapshot atual contém metadados).
3. **Benchmark jurídico de mérito**: conjunto de 60 casos avaliados e assinados por advogado, abrangendo vigência, fatos, provas, tese e abstenção.
4. **Qualidade e latência da IA**: inferência local atual na VPS compartilhada foi reprovada; dimensionar hardware ou usar provedor externo apenas com avaliação expressa de sigilo/contratação.
5. **Rastreabilidade visual**: os originais agora podem ser preservados e baixados, mas ainda não existe visualização com destaque automático do trecho em uma página PDF nem OCR robusto de documentos escaneados.
6. **Conformidade do cofre na produção**: configurar diretório dedicado e chave secreta sem commit, política de retenção, anti-malware, backup cifrado periódico **incluindo chave em cofre seguro e restaurável**, controle de acesso e restauração repetida com um clone do banco. A prova desta etapa restaura um arquivo cifrado de caso fictício, **não equivale a recuperação de desastre de toda a aplicação**.
7. **Atlas legado / OIDC / deploy**: validar migração do banco legado, OIDC, release idêntico à branch, smoke autenticado pós-publicação e rollback real sem tocar no DPT ERP.

## Operação reproduzível

**Para desenvolvimento isolado**, nunca publicar os exemplos com chaves reais:

```bash
export DATABASE_URL=file:/caminho/para/copia-de-homologacao.db
export JURIDIA_PRIVATE_UPLOAD_ROOT=/caminho/fora-do-site/privado
export JURIDIA_PRIVATE_UPLOAD_KEY=<chave_de_32_bytes_em_hex_no_cofre_de_segredos>
bun scripts/audit-private-originals.ts
bun scripts/knowledge-release-readiness.ts
bun test tests/*.test.ts
./node_modules/.bin/tsc --noEmit
```

**Gate esperado hoje**: `knowledge-release-readiness.ts` termina com código **2**, não com 0, porque o conteúdo jurídico e a publicação seguem sem aceite. O verificador do cofre também termina com código 2 se não houver configuração válida ou objetos restauráveis para conferir.

### Decisão de publicação

**Manter PR #11 como DRAFT.** É possível continuar homologando o pipeline e o cofre em staging. Não substituir `current`, não apontar Next para banco experimental e não habilitar o gerador de peças autônomo em produção.
