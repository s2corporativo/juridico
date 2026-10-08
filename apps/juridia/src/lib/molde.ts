export interface MoldeFallbackChange {
  operation: "add";
  anchor: string;
  replacement: string;
  reason: string;
}

function meaningfulLines(baseDocument: string): string[] {
  return baseDocument
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 5 && line.length <= 200);
}

export function buildDeterministicMoldeFallback(
  baseDocument: string,
  instruction: string,
): MoldeFallbackChange {
  const lines = meaningfulLines(baseDocument);
  if (!lines.length) {
    throw new Error("Documento-base sem trecho utilizável como âncora");
  }

  const normalizedInstruction = instruction.toLowerCase();
  const preferredPatterns = normalizedInstruction.includes("tutela")
    ? [/pedidos?/i, /direito/i, /fundament/i]
    : normalizedInstruction.includes("pedido")
      ? [/pedidos?/i, /requer/i]
      : normalizedInstruction.includes("fato")
        ? [/fatos?/i, /relat[oó]rio/i]
        : [/direito/i, /fundament/i, /pedidos?/i];

  const anchor =
    preferredPatterns
      .map((pattern) => lines.find((line) => pattern.test(line)))
      .find(Boolean) ||
    lines[lines.length - 1];

  const safeInstruction = instruction.replace(/\s+/g, " ").trim().slice(0, 500);
  const replacement = [
    "",
    "### Ajuste solicitado pelo advogado",
    `[Pendente de revisão humana: ${safeInstruction}]`,
    "[Inserir somente conteúdo sustentado pelos fatos, evidências e fontes jurídicas verificadas do caso.]",
  ].join("\n");

  return {
    operation: "add",
    anchor,
    replacement,
    reason: "Fallback determinístico: o modelo não retornou âncora válida; preservada a estrutura do documento e exigida revisão humana.",
  };
}
