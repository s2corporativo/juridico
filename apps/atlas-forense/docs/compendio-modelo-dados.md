# Compêndio Jurídico Nacional — modelo inicial

O núcleo possui quatro camadas separadas: taxonomia (`legal_topics`), teses (`legal_theses`), jurisprudência (`jurisprudence_records`) e evidência de ingestão (`evidence_sources`, `ingestion_batches`, `audit_events`). Uma decisão pode receber múltiplos temas; uma tese pode ser relacionada a múltiplas decisões com indicação de apoio, oposição ou contexto.

Cada registro público preserva `sourceStatus`, URL de origem, lote, versão e nota de validação. Dados de partes, CPF, endereços, telefones e documentos pessoais permanecem fora deste modelo.
