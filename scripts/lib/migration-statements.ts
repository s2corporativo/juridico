/**
 * Divide um arquivo .sql de migration em instruções executáveis, removendo
 * comentários de linha (`-- ...`) primeiro.
 *
 * Bug corrigido: a versão anterior dividia por `;` e só então descartava
 * blocos que começassem com `--`. Um arquivo que abre com um cabeçalho de
 * comentário (todo `NNNN_*.sql` deste projeto) faz o comentário grudar na
 * primeira instrução real (não há `;` entre eles) — o bloco resultante começa
 * com `--` e o filtro descartava o bloco inteiro, instrução válida junto.
 * Confirmado em produção: o primeiro `ALTER TABLE` de `0003_integrity_and_indexes.sql`
 * (o índice de `decisionDate`) nunca chegou a rodar.
 */
export function statementsOf(raw: string): string[] {
  const withoutComments = raw
    .split(/\r?\n/)
    .filter((line) => !/^\s*--/.test(line))
    .join("\n");
  return withoutComments
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}
