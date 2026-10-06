# Publicação da VPS — Atlas Forense

## Arquitetura aprovada

O Atlas será instalado de modo isolado em `/opt/atlas-ejc/current`, executado pelo usuário de sistema `atlas`, com banco MariaDB `atlas_ejc` acessível somente em `127.0.0.1`. O Caddy receberá tráfego HTTPS em `atlas.depaulateixeira.adv.br` e encaminhará apenas ao processo local na porta 3010. As únicas portas públicas adicionais serão 80 e 443; o banco e a porta interna do aplicativo não serão expostos.

| Camada | Recurso | Controle |
|---|---|---|
| Processo | `atlas-ejc.service` | Inicialização automática, reinício em falha e privilégios reduzidos. |
| Banco | MariaDB local exclusivo | Usuário com acesso somente ao banco Atlas; bind local. |
| HTTPS | Caddy + certificado automático | Host único; proxy reverso para `127.0.0.1:3010`. |
| Saúde | `GET /healthz` | Retorna somente serviço e estado, sem versão, banco ou segredo. |
| Reversão | Diretório de release anterior | Troca de symlink e reinício controlado do serviço. |

## Variáveis e limites

O arquivo `/etc/atlas-ejc/atlas.env` terá permissão `0640`, proprietário `root:atlas`, e não será versionado. Ele conterá somente porta, URL do banco local e segredo de sessão. A integração OAuth/Manus não será habilitada na VPS nesta primeira publicação: a rota de login exige URI de retorno e política de SSO próprios do EJC. O painel público, fontes e relatórios continuam disponíveis; os fluxos administrativos permanecem bloqueados até a configuração posterior.

## Reversão

Cada release será copiada para `/opt/atlas-ejc/releases/<identificador>` e `current` apontará para a release ativa. Caso a validação de saúde falhe, o `current` retornará para a release anterior e o serviço será reiniciado. Não haverá sobrescrita destrutiva do release validado.

## Repositório GitHub

O repositório privado `s2corporativo/ATLAS-EJC` já possuía uma linha principal com arquivos de outro escopo. Para preservar esse conteúdo, o Atlas foi publicado na branch **`atlas-forense`**, baseada no estado validado do projeto local. A branch `main` remota não foi reescrita, mesclada à força ou alterada. A integração definitiva ao ramo principal deverá ocorrer por revisão de diferenças ou pull request.
