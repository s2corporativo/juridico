# Recuperação do Atlas Forense

O repositório anterior foi excluído em 29/08/2026. Os objetos Git antigos não puderam ser reaproveitados no novo repositório e não havia backup de código localizado no File Library ou Google Drive.

A reconstrução foi realizada a partir do último estado funcional documentado no projeto e dos arquivos que ainda estavam disponíveis na conversa. Por segurança:

1. nenhum segredo foi republicado;
2. nenhum dado jurisprudencial perdido foi inventado;
3. o seed JEC perdido não foi recriado artificialmente;
4. migrations não são aplicadas automaticamente em produção;
5. a estrutura foi consolidada para evitar a mistura histórica com sistemas não jurídicos.

## Itens reconstruídos

- navegação modular do Atlas;
- Compêndio e dossiê público;
- Banco Nacional de Teses, versionamento e quatro gates humanos;
- score decomposto e métricas por versão;
- Jurimetria JEC por snapshot de banco;
- cobertura nacional e RMBH;
- fontes públicas e DataJud;
- Central de Controle e curadoria;
- hardening de runtime, sessão e storage;
- integridade referencial;
- scripts de preflight, migration, backfill e release gate;
- sanitização do dossiê público.

## Dados não recuperados

O antigo arquivo estático de dashboard JEC, com aproximadamente 687 KB, não estava disponível após a exclusão. O código reconstruído espera `jec_dashboard_snapshots` no banco e não substitui essa lacuna por dados simulados.
