# Dados legados fora do produto Atlas

Decisão de escopo de 06/10/2026: o Atlas Forense não administra escritório.
Versões anteriores criaram tabelas `office_*` para clientes, matérias,
atendimentos, comunicações, configurações DJEN e jurisprudência do escritório.
A documentação anterior indica existência de dados reais, mas o banco ativo não
foi inspecionado nesta alteração.

## Estado desta mudança

- Removidas as páginas `/escritorio/*`, os procedimentos `office.*`, serviços de
  gravação e agendadores de escritório.
- As definições das tabelas antigas foram separadas em
  `drizzle/legacy-office-schema.ts`. `drizzle.config.ts` inclui esse arquivo
  somente para preservar as tabelas nas comparações de migrations e impedir
  que a geração automática proponha `DROP TABLE`. O servidor importa apenas
  `drizzle/schema.ts`, sem as tabelas legadas no bundle de execução.
- Nenhuma migração destrutiva ou operação no banco de produção é incluída.
- O catálogo de fontes públicas deixa de anunciar os conectores do escritório.

## Isolamento operacional antes da publicação

1. Confirmar o SHA implantado, fazer backup consistente e testar restauração em
   ambiente isolado. Registrar contagem e checksum por tabela sem exportar PII
   para logs ou para este repositório.
2. Confirmar o usuário de banco da aplicação sem revelar sua senha. Aplicar
   privilégio mínimo para que o usuário do Atlas acesse apenas as tabelas
   públicas necessárias, sem acesso às tabelas `office_*`. A lista exata de
   grants deve ser derivada do ambiente real e revisada antes da execução.
3. Validar que `/api/trpc/office.*` não existe na versão publicada e que as
   páginas `/escritorio/*` não servem conteúdo do módulo antigo. Limpar caches
   de assets após a troca de release.
4. Preservar os dados legados com acesso restrito até uma migração específica,
   conferida pelo responsável do sistema de destino. Só então decidir retenção
   ou descarte, com backup e rollback documentados.

## Rollback

Retornar ao release anterior apenas em ambiente controlado, lembrando que ele
reabre as antigas rotas do escritório. Para falha da nova versão, preferir
restaurar o serviço público com as rotas legadas bloqueadas no proxy. Nenhuma
reversão desta mudança exige alterar dados das tabelas legadas.
