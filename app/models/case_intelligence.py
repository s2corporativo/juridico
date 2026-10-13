# ── app/models/case_intelligence.py ───────────────────────────────────────────
# Modelos para inteligência do caso — snapshots versionados e cache de análise.
from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import (
    Column, String, Text, Boolean, DateTime, Integer, JSON, Index,
    ForeignKey, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class CaseIntelligenceSnapshot(Base):
    """Snapshot versionado da inteligência de um caso jurídico.

    Cada análise do cérebro cria um novo snapshot. Snapshots podem ser
    "congelados" após aprovação humana (HITL).
    """

    __tablename__ = "case_intelligence_snapshots"

    id = Column(String(36), primary_key=True)  # UUID
    case_id = Column(String(36), nullable=False, index=True)
    versao = Column(String(20), nullable=False, default="1.0")
    origem = Column(String(60), nullable=False, default="brain_api")

    # Conteúdo da análise
    resumo = Column(Text, nullable=False)
    payload = Column(JSON, nullable=True)  # plano, issues, evidências
    ai_log_ids = Column(ARRAY(String(36)), default=list)

    # Controle de estado
    congelado = Column(Boolean, default=False, nullable=False)
    aprovado_por = Column(String(36), nullable=True)
    aprovado_em = Column(DateTime(timezone=True), nullable=True)

    # Metadados
    criado_por = Column(String(36), nullable=True)
    criado_em = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        Index("ix_cis_case_id_criado_em", "case_id", "criado_em"),
        Index("ix_cis_congelado", "congelado"),
    )

    def __repr__(self) -> str:
        return f"<CaseIntelligenceSnapshot {self.id} case={self.case_id} v={self.versao}>"


class BrainCache(Base):
    """Cache determinístico de análises do cérebro jurídico.

    A chave é SHA-256(facts_pseudonymized + domain), garantindo que a mesma
    entrada pseudonimizada retorne o mesmo resultado sem re-processamento.
    """

    __tablename__ = "brain_cache"

    id = Column(String(36), primary_key=True)  # UUID
    case_id = Column(String(36), nullable=True, index=True)
    user_id = Column(String(36), nullable=True, index=True)

    # Hash determinístico da entrada
    input_hash = Column(String(64), nullable=False)
    domain = Column(String(60), nullable=True)

    # Resultado cacheado (JSON)
    result_json = Column(JSON, nullable=False)

    # Metadados
    marker_count = Column(Integer, default=0)
    issues_count = Column(Integer, default=0)
    processing_time_ms = Column(Integer, default=0)

    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    last_accessed_at = Column(
        DateTime(timezone=True),
        nullable=True,
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        UniqueConstraint("case_id", "input_hash", name="uq_brain_cache_case_input"),
        Index("ix_brain_cache_input_hash", "input_hash"),
        Index("ix_brain_cache_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<BrainCache {self.id} case={self.case_id} hash={self.input_hash[:12]}>"


class EvidenceRef(Base):
    """Referência a evidência extraída durante análise jurídica.

    Mantém vínculo com o case_id e um hash da citação para deduplicação.
    """

    __tablename__ = "evidence_refs"

    id = Column(String(36), primary_key=True)  # UUID
    case_id = Column(String(36), nullable=False, index=True)
    snapshot_id = Column(
        String(36),
        ForeignKey("case_intelligence_snapshots.id", ondelete="CASCADE"),
        nullable=True,
    )

    # Tipo de evidência
    ref_type = Column(String(30), nullable=False)  # lei, valor, data, jurisprudencia
    ref_id = Column(String(255), nullable=False)  # identificador do item
    ref_text = Column(Text, nullable=False)  # texto original da citação
    quote_hash = Column(String(64), nullable=False)  # hash para deduplicação

    # Marcadores pseudonimizados (contagem, não PII)
    marker_map = Column(JSON, nullable=True)  # só sizes/contagens, nunca PII

    # Metadados da análise
    marker_count = Column(Integer, default=0)

    # Timestamp
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        UniqueConstraint(
            "case_id", "quote_hash",
            name="uq_evidence_ref_case_quote"
        ),
        Index("ix_evidence_ref_case_id", "case_id"),
        Index("ix_evidence_ref_ref_type", "ref_type"),
        Index("ix_evidence_ref_quote_hash", "quote_hash"),
    )

    def __repr__(self) -> str:
        return f"<EvidenceRef {self.id} type={self.ref_type} ref={self.ref_id[:30]}>"
