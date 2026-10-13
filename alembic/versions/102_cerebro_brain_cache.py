"""Cérebro Jurídico — snapshots, cache e referências de evidência.

Revision ID: 102
Revises: 100
Create Date: 2026-10-13

Tabelas:
- case_intelligence_snapshots: versão da inteligência do caso
- brain_cache: cache determinístico de análises (hash SHA-256)
- evidence_refs: referências de evidências extraídas por análise

Reversível: todas as tabelas são adicionadas com defaults compatíveis.
"""
from __future__ import annotations

import uuid

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY, UUID


revision = "102"
down_revision = "100"  # última migration existente
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── case_intelligence_snapshots ──────────────────────────────────────────
    op.create_table(
        "case_intelligence_snapshots",
        sa.Column("id", sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column("case_id", sa.String(36), nullable=False),
        sa.Column("versao", sa.String(20), nullable=False, server_default="1.0"),
        sa.Column("origem", sa.String(60), nullable=False, server_default="brain_api"),
        sa.Column("resumo", sa.Text, nullable=False),
        sa.Column("payload", sa.JSON, nullable=True),
        sa.Column("ai_log_ids", ARRAY(sa.String(36)), server_default="{}"),
        sa.Column("congelado", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("aprovado_por", sa.String(36), nullable=True),
        sa.Column("aprovado_em", sa.DateTime(timezone=True), nullable=True),
        sa.Column("criado_por", sa.String(36), nullable=True),
        sa.Column(
            "criado_em",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_cis_case_id_criado_em", "case_intelligence_snapshots", ["case_id", "criado_em"])
    op.create_index("ix_cis_congelado", "case_intelligence_snapshots", ["congelado"])

    # ── brain_cache ──────────────────────────────────────────────────────────
    op.create_table(
        "brain_cache",
        sa.Column("id", sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column("case_id", sa.String(36), nullable=True),
        sa.Column("user_id", sa.String(36), nullable=True),
        sa.Column("input_hash", sa.String(64), nullable=False),
        sa.Column("domain", sa.String(60), nullable=True),
        sa.Column("result_json", sa.JSON, nullable=False),
        sa.Column("marker_count", sa.Integer, server_default="0"),
        sa.Column("issues_count", sa.Integer, server_default="0"),
        sa.Column("processing_time_ms", sa.Integer, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("last_accessed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_brain_cache_input_hash", "brain_cache", ["input_hash"])
    op.create_index("ix_brain_cache_created_at", "brain_cache", ["created_at"])
    op.create_index("ix_brain_cache_case_id", "brain_cache", ["case_id"])
    op.create_constraint(
        "uq_brain_cache_case_input",
        "brain_cache",
        ["case_id", "input_hash"],
        schema=None,
        _fill_default=True,
        _if_not_exists=False,
    )

    # ── evidence_refs ────────────────────────────────────────────────────────
    op.create_table(
        "evidence_refs",
        sa.Column("id", sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
        sa.Column("case_id", sa.String(36), nullable=False),
        sa.Column(
            "snapshot_id",
            sa.String(36),
            sa.ForeignKey("case_intelligence_snapshots.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column("ref_type", sa.String(30), nullable=False),
        sa.Column("ref_id", sa.String(255), nullable=False),
        sa.Column("ref_text", sa.Text, nullable=False),
        sa.Column("quote_hash", sa.String(64), nullable=False),
        sa.Column("marker_map", sa.JSON, nullable=True),
        sa.Column("marker_count", sa.Integer, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_evidence_ref_case_id", "evidence_refs", ["case_id"])
    op.create_index("ix_evidence_ref_ref_type", "evidence_refs", ["ref_type"])
    op.create_index("ix_evidence_ref_quote_hash", "evidence_refs", ["quote_hash"])
    op.create_constraint(
        "uq_evidence_ref_case_quote",
        "evidence_refs",
        ["case_id", "quote_hash"],
        schema=None,
        _fill_default=True,
        _if_not_exists=False,
    )


def downgrade() -> None:
    op.drop_table("evidence_refs")
    op.drop_table("brain_cache")
    op.drop_table("case_intelligence_snapshots")
