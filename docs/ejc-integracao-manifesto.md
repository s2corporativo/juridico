# Manifesto Técnico de Integração com o EJC

## Situação

O Atlas Forense está **preparado, mas não vinculado** ao Ecossistema Jurídico Clovis. A arquitetura atual conserva módulos independentes e uma matriz de acesso compatível com integração futura, sem estabelecer conexão, SSO, transferência de dados ou dependência externa.

| Módulo | Rota Atlas | Perfil previsto | Finalidade |
|---|---|---|---|
| Atlas Forense | `/` | Política pública ou autenticada a definir | Jurimetria, séries e relatórios. |
| Compêndio Jurídico | `/compendio` | Metadados públicos | Teses, julgados, fontes e trilha de auditoria. |
| Fontes Públicas | `/fontes` | Metadados públicos | Cobertura, limites e situação dos conectores. |
| Central de Controle | `/controle` | `admin` | Pré-validação de lotes e consulta DataJud pontual. |

## Pré-requisitos de ativação

> A integração deverá iniciar por navegação e identidade, nunca por transferência ampla de dados.

A vinculação dependerá da identificação do ponto de entrada no EJC, do mapeamento formal de papéis, da política de sigilo de casos e da aprovação humana. Credenciais, dados pessoais, documentos privados e dados de partes são expressamente excluídos do contrato base. Qualquer integração de casos exige análise individual de finalidade, autorização e revisão humana.

## Contrato de extensão

O arquivo `shared/ejc-integration.ts` centraliza as rotas, módulos, papéis e restrições. Ele foi deliberadamente definido como `pending_approval`; não contém URL externa, token ou conector ativo. A aplicação consome esse contrato no roteamento e a página **Estrutura Interna** consulta o status técnico por procedimento público, sem habilitar SSO, sincronização ou transferência de dados.
