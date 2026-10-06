/**
 * Configura o Conector DJEN com a identidade real do advogado responsável:
 * Clovis José Soares — OAB/MG 253.274. Idempotente; grava pelo serviço oficial
 * updateDjenSettings (mesmo caminho da UI) para garantir validação idêntica.
 */
import { config } from "dotenv";
config();

import { getDjenSettings, updateDjenSettings } from "../server/djen";

async function main() {
  const atual = await getDjenSettings();
  console.log("Estado atual:", { lawyerName: atual.lawyerName, oabNumber: atual.oabNumber, oabUf: atual.oabUf, autoSyncEnabled: atual.autoSyncEnabled, intervalMinutes: atual.intervalMinutes });

  const atualizado = await updateDjenSettings({
    enabled: true,
    lawyerName: "Clovis José Soares",
    oabNumber: "253274",
    oabUf: "MG",
    tribunal: "TJMG",
    autoSyncEnabled: true,
    intervalMinutes: 180,
    windowDays: 10,
    defaultDeadlineDays: 15,
  });

  console.log("Configurado:", {
    lawyerName: atualizado.lawyerName,
    oabNumber: atualizado.oabNumber,
    oabUf: atualizado.oabUf,
    autoSyncEnabled: atualizado.autoSyncEnabled,
    intervalMinutes: atualizado.intervalMinutes,
    windowDays: atualizado.windowDays,
    lastSyncStatus: atualizado.lastSyncStatus,
  });
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Falhou:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
