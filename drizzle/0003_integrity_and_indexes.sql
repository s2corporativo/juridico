-- Integridade referencial e índices de consulta do acervo legado.
--
-- O baseline 0001 criou as tabelas do núcleo sem nenhuma FOREIGN KEY: a
-- integridade dependia exclusivamente de `pnpm db:preflight`, executado à mão.
-- Esta migration passa a garanti-la no banco, e cria os índices que faltavam
-- para as duas ordenações/filtros mais usados do Compêndio.
--
-- PRÉ-REQUISITO: `pnpm db:preflight` precisa passar antes. As FKs abaixo falham
-- se houver linha órfã, e é isso que se quer — a migration não apaga dados.

ALTER TABLE jurisprudence_records ADD INDEX jurisprudence_decision_date_idx (decisionDate);
ALTER TABLE jurisprudence_records ADD INDEX jurisprudence_legal_area_idx (legalArea);

ALTER TABLE jurisprudence_records ADD CONSTRAINT fk_jurisprudence_batch FOREIGN KEY (batchId) REFERENCES ingestion_batches (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE jurisprudence_records ADD CONSTRAINT fk_jurisprudence_source FOREIGN KEY (sourceId) REFERENCES evidence_sources (id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE jurisprudence_topics ADD CONSTRAINT fk_jurisprudence_topics_record FOREIGN KEY (jurisprudenceId) REFERENCES jurisprudence_records (id) ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE jurisprudence_topics ADD CONSTRAINT fk_jurisprudence_topics_topic FOREIGN KEY (topicId) REFERENCES legal_topics (id) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE thesis_authorities ADD CONSTRAINT fk_thesis_authorities_thesis FOREIGN KEY (thesisId) REFERENCES legal_theses (id) ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE thesis_authorities ADD CONSTRAINT fk_thesis_authorities_record FOREIGN KEY (jurisprudenceId) REFERENCES jurisprudence_records (id) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE evidence_review_items ADD CONSTRAINT fk_evidence_review_record FOREIGN KEY (jurisprudenceId) REFERENCES jurisprudence_records (id) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE legal_theses ADD CONSTRAINT fk_legal_theses_topic FOREIGN KEY (topicId) REFERENCES legal_topics (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
