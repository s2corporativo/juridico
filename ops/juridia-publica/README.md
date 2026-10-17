# Juridiá pública — prontidão de infraestrutura e SSO

**Estado de referência (17/10/2026):** o subdomínio `juridia.depaulateixeira.adv.br` não resolve; a integração Cloudflare não está conectada ao agente de execução. A aplicação Juridiá está na porta **127.0.0.1:3005** da VPS, com login local, mas a configuração OIDC não foi ativada. O Atlas Jurídico existe em produção e possui rota `/juridia` de entrada unificada.

## Passos de implantação com gates

1. No Cloudflare autorizado para `depaulateixeira.adv.br`, criar o registro DNS do subdomínio com apontamento para o proxy da VPS, sem sobrescrever registros existentes.
2. Confirmar propagação pelo DNS público. Abrir somente portas HTTPS 443 e HTTP 80 para emissão do certificado. **Nunca publicar 3005.**
3. Emitir certificado de confiança pública para o subdomínio (desafio ACME do Nginx). Só após certificar que os caminhos estão corretos, revisar e ativar `nginx-https.template.conf` como site real. `nginx -t` deve passar antes do reload.
4. Configurar segredos em armazenamento restrito da Juridiá, nunca no Git:
   - `JURIDIA_SESSION_SECRET` com entropia suficiente;
   - `JURIDIA_OIDC_ISSUER=https://juridia.depaulateixeira.adv.br/api/auth/oidc`;
   - `EJC_OIDC_CLIENT_ID`, `EJC_OIDC_CLIENT_SECRET` e `EJC_OIDC_REDIRECT_URIS`, com callback **exata do Atlas** devidamente comprovada.
5. Configurar no Atlas: `EJC_SSO_ENABLED=true` **apenas após** homologar o provedor, `EJC_OIDC_ISSUER` idêntico ao da Juridiá, mesmo `CLIENT_ID` e `CLIENT_SECRET`, e `EJC_SSO_REDIRECT_URI` igual à URI registrada.
6. Verificar PKCE/S256, audience, nonce, RS256, expiração do código em dois minutos, emissão única, roles limitadas, logout e revogação com contas sintéticas. Executar `bash ops/juridia-publica/preflight-https-sso.sh` antes de ativar qualquer atalho em produção.
7. No DPT, só configurar `NEXT_PUBLIC_DPT_JURIDIA_URL=https://juridia.depaulateixeira.adv.br` depois do preflight e rebuild/homologação. Não reutilizar cookie do DPT no Atlas/Juridiá.
8. Guardar backup e oferecer rollback dos serviços Nginx/Atlas/Juridiá/DPT. Não interromper serviços ativos sem ter verificado a versão e o estado persistente.

## Invariantes

- Juridiá e Atlas têm bases e autenticações próprias; não fundir cadastros por e-mail nem importar clientes automaticamente.
- O Portal do Cliente DPT permanece interno e separado do SSO de pesquisa/redação.
- Não registrar tokens, certificados A1 ou dados de clientes em logs de diagnóstico.
- Até a efetiva ativação, `/api/auth/me` e rotas privadas da Juridiá retornam 401 sem sessão; o provedor OIDC retorna indisponível se faltar configuração.
- Nginx funciona apenas como proxy reverso, sem habilitar permissões artificiais.

## Bloqueios verificáveis

O teste de prontidão deve encerrar com **código 21** enquanto faltar DNS e com **código 24** se o OIDC não estiver ativo. Nenhuma ação automática deve contornar tais gates.
