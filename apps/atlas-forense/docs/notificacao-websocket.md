# Serviço de Notificações em Tempo Real (WebSocket) — Atlas Forense

## Política do proxy fixo (sem porta dinâmica)

O Atlas Forense **proíbe** a arquitetura de proxy dinâmico do tipo `?XTransformPort=XXXX`, em
que o usuário escolhe a porta interna de destino. Nenhum parâmetro de query ou header do
aplicativo seleciona porta, host ou destino de proxy — verificado por auditoria
(`grep -r "XTransformPort"`, `req.query` sem qualquer chave de porta em `server/`).

O acesso externo é sempre por **rota fixa**:

```
Navegador ── HTTPS ──▶ Proxy reverso (Caddy)
                        ├─ /socket.io/*  → 127.0.0.1:3003  (serviço de notificação)
                        └─ todas as outras → 127.0.0.1:3010 (aplicação principal)
```

- O serviço de notificação escuta **somente em loopback** (`127.0.0.1:3003`, env
  `NOTIFICATION_SERVICE_PORT` para alterar o valor fixo). Não há varredura de porta:
  se a porta fixa estiver ocupada, o serviço falha com erro explícito em vez de migrar
  silenciosamente para outra porta.
- A porta interna nunca é pública; nenhuma rota do app a expõe.

## Componentes

| Arquivo | Papel |
|---|---|
| `server/realtime/notification-service.ts` | Serviço Socket.IO autônomo (auth, rooms, CORS, `/emit`, rate limit, logs). |
| `server/realtime/emit-notification.ts` | Helper de emissão do servidor (loopback + segredo, nunca lança). |
| `client/src/lib/realtime.ts` | Cliente singleton (rota fixa `/socket.io/`, reconexão com backoff). |
| `client/src/hooks/useRealtimeNotifications.ts` | Hook React: toasts validados + status de conexão. |

## Controles de segurança implementados

1. **Autenticação obrigatória no handshake** — cookie de sessão `app_session_id` (JWT HS256
   assinado com `JWT_SECRET`) ou token equivalente em `auth.token` (fallback do espelho de
   sessão em `sessionStorage`, mesmo mecanismo Bearer do cliente tRPC). Sessão inválida,
   usuário inexistente ou erro de verificação → `connect_error` (`unauthorized`), registrado
   em log.
2. **Autorização por rooms** — `user:<id>` é atribuída automaticamente no servidor; a room
   `office:global` só é entrada por subscrição explícita (`office:subscribe`) de usuário
   autenticado. O cliente **não possui** evento genérico de join: joins são sempre
   server-side e o alvo de emissão é validado por regex (`user:<id>` ou `office:global`).
   Nenhum usuário recebe informação de processo sem autorização: emissões dirigidas usam
   `user:<id>`; conteúdos gerais do escritório usam `office:global` (somente membros
   autenticados do app do escritório).
3. **CORS restrito e origem conhecida** — allowlist de origens exatas em
   `ATLAS_ALLOWED_ORIGINS` (ex.: `https://atlas.depaulateixeira.adv.br`). Sem wildcard;
   origem fora da lista → `cors:reject` em log. Em desenvolvimento, sem env definida, o
   default são localhost:3000/5173; em produção, **não há default** (fail-closed).
4. **Emissão apenas server-to-server** — `POST /emit` no serviço exige o header
   `x-notification-secret` igual a `NOTIFICATION_INTERNAL_SECRET`, comparado em tempo
   constante (`crypto.timingSafeEqual`). Nenhum cliente externo fabrica notificações; o
   canal WebSocket é somente leitura para o navegador.
5. **Validação de eventos** — zod nos dois sentidos: `/emit` valida `{target, event, data}`
   (evento único `notification:new`; `title` 1–300, `content` ≤ 2000, `level` enum,
   `link` apenas caminho relativo de mesma origem, `category` ≤ 60 — schema `.strict()`).
   Eventos cliente→servidor limitados a `office:subscribe`, `office:unsubscribe` e
   `notification:ack`, todos com payload validado; evento desconhecido é descartado e
   registrado (`event_fora_da_allowlist`). O cliente valida o payload recebido antes de
   exibir (defesa em profundidade).
6. **Limite de tamanho de payload** — `express.json({ limit: "16kb" })` no `/emit`,
   `maxHttpBufferSize: 1 MB` no upgrade do Socket.IO (handshake/frames).
7. **Rate limiting** — token bucket interno, sem dependências: eventos do cliente
   (20 burst, 1/s; abuso → desconexão imediata), subscrição de escritório (5, 0,1/s) e
   `/emit` (60, 1/s → HTTP 429). Excedido o limite do socket, a conexão é derrubada e
   o motivo vai para o log.
8. **Logs estruturados sem conteúdo** — prefixo `[Realtime]`: `connect`, `disconnect`,
   `auth:reject`, `cors:reject`, `client:event:reject`, `rate:limit`, `emit:accept`,
   `emit:reject`. Logs carregam identificador, evento, alvo, contagem de entregas e
   tamanho em bytes — **nunca o conteúdo** da notificação (LGPD).
9. **Tratamento de reconexão** — cliente: backoff exponencial com jitter (1 s → 15 s,
   `randomizationFactor` 0,5), re-envio automático do token atualizado em cada tentativa
   (`auth` como função) e re-subscrição da room do escritório a cada `connect`;
   servidor: heartbeat `pingInterval` 25 s / `pingTimeout` 20 s e re-entrada nas rooms
   no novo handshake. Falha de conexão degrada com elegância: o sistema segue funcional
   (status `connected` disponível para a UI).
10. **Falha graciosa da emissão** — `emitNotification` nunca lança: timeout de 2 s,
    log de aviso e retorno `false`. Fluxos de negócio (DJEN, Jurisprudência) jamais
    dependem da notificação.

## Eventos reais integrados

| Origem | Gatilho | Notificação |
|---|---|---|
| Conector DJEN | Sincronização com novas comunicações | `success` → Caixa de Comunicações |
| Conector DJEN | Falha na consulta | `error` → Caixa de Comunicações |
| Conector de Jurisprudência | Coleta com novos julgados | `success` → Biblioteca |
| Conector de Jurisprudência | Todos os provedores falharam | `error` → Biblioteca |

Não há dados fictícios: notificações só existem para eventos reais do sistema.

## Variáveis de ambiente

| Variável | Default | Uso |
|---|---|---|
| `NOTIFICATION_SERVICE_PORT` | `3003` | Porta fixa do serviço (loopback). |
| `NOTIFICATION_INTERNAL_SECRET` | — (obrigatório em produção) | Segredo do `/emit`; gerar com `openssl rand -hex 32`. Em desenvolvimento, se ausente, é gerado segredo efêmero por execução. |
| `ATLAS_ALLOWED_ORIGINS` | dev: localhost; prod: vazio (fail-closed) | Origens exatas aceitas no WebSocket, separadas por vírgula. |

## Operação (VPS)

1. `deploy/atlas.env.example` traz os três valores; `/etc/atlas-ejc/atlas.env` deve definir
   `NOTIFICATION_INTERNAL_SECRET` e `ATLAS_ALLOWED_ORIGINS` (0640, `root:atlas`).
2. `deploy/Caddyfile` já contém a rota fixa `/socket.io/*` → `127.0.0.1:3003` **antes** do
   catch-all da aplicação; o Caddy encaminha o upgrade de WebSocket automaticamente.
3. Sonda de saúde do serviço: `GET http://127.0.0.1:3003/healthz` → `{"ok":true,"service":"notification"}`.

## Auditoria

```sql
-- Não há tabela de notificações: o serviço é estado em memória (fire-and-forget).
-- Evidências operacionais ficam nos logs [Realtime] e nos audit_events dos conectores
-- (ex.: 'sync' do DJEN), que registram os mesmos gatilhos.
SELECT entity_type, action, COUNT(*) FROM audit_events GROUP BY entity_type, action;
```
