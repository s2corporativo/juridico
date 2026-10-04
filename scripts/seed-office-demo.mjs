/**
 * Seed de demonstração dos módulos do Escritório (Painel JEC BH e Betim):
 * 4 clientes, 5 matérias, 7 atendimentos, 8 comunicações (3 DJEN com teor
 * sanitizado + 5 manuais) e configuração DJEN sem OAB.
 * Idempotente: pulado se já houver clientes demo.
 */
import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: "127.0.0.1",
  port: Number(process.env.DB_PORT || 33061),
  user: "root",
  password: "",
  database: "atlas_ejc",
});

const [[{ demo }]] = await conn.query(
  "SELECT COUNT(*) AS demo FROM office_clients WHERE isDemoData = 1"
);
if (demo > 0) {
  console.log("Seed office: dados demo já presentes — nada a fazer.");
  await conn.end();
  process.exit(0);
}

const clientes = [
  ["Maria Aparecida dos Santos", "087.654.321-00", "maria.santos@exemplo.com", "(31) 98765-4321", "Cliente JEC BH — relação de consumo com instituição financeira."],
  ["José Carlos Ferreira", "123.456.789-09", "jose.ferreira@exemplo.com", "(31) 97654-3210", "Cliente JEC Betim — indenização por falha de serviço."],
  ["Ana Paula Oliveira", "765.432.109-87", "ana.oliveira@exemplo.com", "(31) 96543-2109", "Cliente JEC BH — duplicidade de cobrança."],
  ["Roberto Almeida Júnior", "321.098.765-45", null, "(31) 95432-1098", "Cliente JEC Betim — plano de saúde, negativa de cobertura."],
];

const [cliResult] = await conn.execute(
  `INSERT INTO office_clients (name, document, email, phone, note, isDemoData) VALUES
    (?, ?, ?, ?, ?, 1), (?, ?, ?, ?, ?, 1), (?, ?, ?, ?, ?, 1), (?, ?, ?, ?, ?, 1)`,
  clientes.flat()
);

// IDs 1-4 assumidos em sequência (banco recém-migrado); verificação defensiva:
const [[{ primeiroId }]] = await conn.query(
  "SELECT MIN(id) AS primeiroId FROM office_clients WHERE isDemoData = 1"
);
const c1 = primeiroId, c2 = primeiroId + 1, c3 = primeiroId + 2, c4 = primeiroId + 3;

await conn.execute(
  `INSERT INTO office_matters (clientId, title, cnjNumber, area, status, note) VALUES
    (?, 'Cobrança indevida de tarifas bancárias', '0001234-77.2015.8.13.0026', 'Cível / Consumidor', 'ativo', 'Revisional com pedido de repetição em dobro.'),
    (?, 'Indenização por falha operacional de pagamento', '0012345-88.2024.8.13.0162', 'Cível / Consumidor', 'ativo', 'Falha em transferência via PIX — honra objetiva de PJ.'),
    (?, 'Reserva de domínio e terceiro de boa-fé', '0012346-99.2025.8.13.0162', 'Cível / Consumidor', 'ativo', 'Contrato de veículo com gravame irregular.'),
    (?, 'Negativa de cobertura — plano de saúde', NULL, 'Saúde suplementar', 'ativo', 'Urgência de natureza ortomolecular contestada.'),
    (?, 'Duplicidade de cobrança em cartão', NULL, 'Cível / Consumidor', 'suspenso', 'Aguardando conferência de faturas pelo cliente.')`,
  [c1, c2, c2, c4, c3]
);

await conn.execute(
  `INSERT INTO office_attendances (clientId, matterId, occurredAt, channel, summary) VALUES
    (?, 1, '2026-09-14 10:30:00', 'presencial', 'Cliente trouxe faturas dos últimos 12 meses; conferência inicial apontou tarifas não contratadas.'),
    (?, 1, '2026-09-21 15:00:00', 'telefone', 'Alinhamento sobre proposta de acordo; cliente aguarda resposta da instituição.'),
    (?, 2, '2026-09-22 09:15:00', 'whatsapp', 'Enviado protocolo de contestação; cliente instruído sobre documentos da falha.'),
    (?, 3, '2026-09-28 14:00:00', 'presencial', 'Assinatura de procuração e coleta do contrato; gravame consultado no registro.'),
    (?, 5, '2026-09-29 11:45:00', 'e-mail', 'Cliente confirmou remessa das faturas digitalizadas; conferência pendente.'),
    (?, 4, '2026-09-30 16:20:00', 'presencial', 'Relato de negativa em atendendimento; orientada comunicação formal à operadora.'),
    (?, NULL, '2026-10-01 08:50:00', 'telefone', 'Prospecção: cliente novo com questão de garantia em bem móvel; agendada consulta.')`,
  [c1, c1, c2, c2, c3, c4, c4]
);

// 3 comunicações DJEN com teor sanitizado (datas próximas para o motor de prazos)
await conn.execute(
  `INSERT INTO office_communications
    (cnjNumber, kind, title, status, channel, sourceKey, sourceExternalId, receivedAt, deadlineDays, isDemoData, content) VALUES
    ('0012345-88.2024.8.13.0162', 'sentenca', 'Sentença — Falha operacional de pagamento', 'nova', 'djen', 'cnj-djen-comunica', 'djen-demo-0001', '2026-09-28 12:00:00', NULL, 1,
     'Disponibilizada sentença na ação 0012345-88.2024.8.13.0162. Fica a parte autora intimada do inteiro teor da decisão proferida, sem prazo declarado nesta comunicação.'),
    ('0001234-77.2015.8.13.0026', 'despacho', 'Despacho — Cobrança indevida de tarifas', 'nova', 'djen', 'cnj-djen-comunica', 'djen-demo-0002', '2026-09-29 12:00:00', NULL, 1,
     'Vista à parte autora para, no prazo de dez dias, manifestar-se sobre a documentação juntada pela ré, sob pena de julgamento antecipado.'),
    (NULL, 'edital', 'Edital de intimação — pessoa incerta', 'lida', 'djen', 'cnj-djen-comunica', 'djen-demo-0003', '2026-10-05 12:00:00', NULL, 1,
     'Edital de intimação para ciência de ato processual. Número de processo indisponível nesta comunicação; prazo padrão do escritório aplicável.'),
    (NULL, 'oficio', 'Ofício — diligência administrativa', 'nova', 'manual', 'manual', NULL, '2026-09-26 12:00:00', 15, 1,
     'Ofício recebido por protocolo físico solicitando esclarecimentos sobre contrato; prazo de 15 dias contados da ciência.'),
    ('0012346-99.2025.8.13.0162', 'intimacao', 'Intimação para audiência de conciliação', 'nova', 'manual', 'manual', NULL, '2026-09-29 12:00:00', NULL, 1,
     'Fica intimada a parte ré para comparecer à audiência de conciliação designada. Ciência registrada por consulta ao portal.'),
    (NULL, 'citacao', 'Citação — petição inicial protocolada', 'lida', 'manual', 'manual', NULL, '2026-09-26 12:00:00', 15, 1,
     'Citação efetivada por correspondência; ciência registrada pela secretaria em 26/09/2026. Prazo de contestação a partir da ciência.'),
    (NULL, 'outro', 'Aviso de protocolo — petição recebida', 'lida', 'manual', 'manual', NULL, '2026-10-01 12:00:00', 15, 1,
     'Aviso de protocolo de petição intermediária; sem prazo processual declarado. Registrado para controle do escritório.'),
    (NULL, 'outro', 'Comunicado de manutenção do portal', 'arquivada', 'manual', 'manual', NULL, '2026-09-25 12:00:00', 15, 1,
     'Comunicado administrativo do portal de processos sobre manutenção programada. Arquivado por irrelevância processual.')`
);

// Configuração DJEN (linha única, sem OAB — estado not_configured gracioso)
await conn.execute(
  `INSERT INTO office_djen_settings
    (id, enabled, lawyerName, oabNumber, oabUf, tribunal, autoSyncEnabled, intervalMinutes, windowDays, defaultDeadlineDays)
   VALUES (1, 1, NULL, NULL, NULL, 'TJMG', 1, 180, 10, 15)
   ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), tribunal = VALUES(tribunal)`
);
await conn.execute(
  `INSERT INTO office_jurisprudencia_settings (id, enabled, query, lexmlEndpoint, maxItems, autoSyncEnabled, intervalMinutes)
   VALUES (1, 1, 'consumidor boa fe', 'http://lexml.gov.br/busca/sru', 5, 1, 240)
   ON DUPLICATE KEY UPDATE query = VALUES(query), lexmlEndpoint = VALUES(lexmlEndpoint)`
);

console.log("Seed office concluído: 4 clientes, 5 matérias, 7 atendimentos, 8 comunicações, settings DJEN/Jurisprudência.");
await conn.end();
