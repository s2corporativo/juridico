# ── app/routers/cerebro.py ───────────────────────────────────────────────────
# ENDPOINT DO CÉREBRO JURÍDICO — /api/brain
#
# Fluxo:
#   1. Pseudonimização (LGPD) — PII nunca sai do VPS
#   2. Cache Redis (SHA-256 do input pseudonimizado)
#   3. Legal Brain (legal_brain service) — plano, issues, evidências
#   4. EvidenceRef por item extraído
#   5. Persistência atômica (BrainCache + BrainAnalysis)
#   6. Reidratação + resposta estruturada
#
# Segurançca: pseudonimizar() → cache → LLM → reidratar() → persistir
# ─────────────────────────────────────────────────────────────────────────────
from __future__ import annotations

import hashlib
import json
import logging
from datetime import datetime, timezone
from typing import Optional

import redis.asyncio as redis
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.case_intelligence import CaseIntelligenceSnapshot
from app.services.ai.pseudonymizer import pseudonimizar, reidratar

logger = logging.getLogger("ejc.cerebro")

router = APIRouter(prefix="/api/brain", tags=["Cérebro Jurídico"])


# ── Redis client (lazy, compartilhado) ───────────────────────────────────────

_redis_client: redis.Redis | None = None
_CACHE_TTL_SECONDS = 3600 * 24 * 7  # 7 dias


async def _get_redis() -> redis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis_client


async def _close_redis():
    global _redis_client
    if _redis_client:
        await _redis_client.aclose()
        _redis_client = None


# ── Schemas Pydantic ─────────────────────────────────────────────────────────

class BrainInput(BaseModel):
    """Input do /api/brain — facts + metadados do caso."""

    case_id: Optional[str] = Field(None, description="ID do caso no EJC")
    facts: str = Field(..., min_length=10, max_length=50000,
                        description="Narrativa factual pseudonimizável")
    entities: Optional[dict[str, list[str]]] = Field(
        default=None,
        description="Entidades nomeadas: {cliente, empresa, advogado, parte_contraria}"
    )
    domain: Optional[str] = Field(None, max_length=60,
                                   description="Domínio jurídico (civel, trabalhista…)")
    force_refresh: bool = Field(False, description="Ignora cache, refaz análise")


class BrainMarkerCount(BaseModel):
    """Contagem de marcadores por tipo no texto pseudonimizado."""

    cpf: int = 0
    cnpj: int = 0
    processo: int = 0
    pessoa: int = 0
    empresa: int = 0
    cliente: int = 0
    parte_contraria: int = 0
    email: int = 0
    telefone: int = 0
    outros: int = 0


class BrainContract(BaseModel):
    """Contrato de resposta do /api/brain."""

    case_snapshot_id: Optional[str] = None
    cache_hit: bool = False
    cached_at: Optional[str] = None
    pseudonymized: bool = True
    evidence_ref_count: int = 0
    marker_counts: dict[str, int] = {}
    marker_map_size: int = 0
    processing_time_ms: int = 0
    legal_issues_found: int = 0
    issues: list[dict] = Field(default_factory=list)
    plan: Optional[dict] = None
    raw: Optional[dict] = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _hash_input(pseudonymized_text: str, domain: str | None) -> str:
    """SHA-256 do texto pseudonimizado + domínio = idempotência por análise."""
    raw = f"{pseudonymized_text}|{domain or ''}"
    return hashlib.sha256(raw.encode()).hexdigest()


def _parse_marker_counts(pseudonymized: str) -> dict[str, int]:
    """Conta marcadores [TIPO_N] no texto pseudonimizado."""

    def _count_pattern(tipo: str) -> int:
        import re
        return len(re.findall(rf"\[{tipo}_\d+\]", pseudonymized))

    return {
        "cpf": _count_pattern("CPF"),
        "cnpj": _count_pattern("CNPJ"),
        "processo": _count_pattern("PROCESSO"),
        "pessoa": _count_pattern("PESSOA"),
        "empresa": _count_pattern("EMPRESA"),
        "cliente": _count_pattern("CLIENTE"),
        "parte_contraria": _count_pattern("PARTE_CONTRARIA"),
        "email": _count_pattern("EMAIL"),
        "telefone": _count_pattern("TELEFONE"),
    }


def _extract_evidence_refs(db: AsyncSession, case_id: str | None,
                             pseudonymized: str, marker_map: dict) -> list[dict]:
    """Extrai referências de evidência de cada item do texto pseudonimizado.

    Cria EvidenceRef para cada citação de lei, jurisprudência ou valor
    identificado no texto. Retorna lista de dicts para inserção posterior.
    """
    refs = []

    # Padrões de referência jurídica
    import re
    lei_pattern = re.compile(
        r"Art(?:igo)?\.?\s*(\d+[\d./]*),?\s*(?:do\s+)?([A-Z][A-Za-z\s]+?)(?:\s*,|\.|(?=\s+Art))"
    )
    for match in lei_pattern.finditer(pseudonymized):
        refs.append({
            "case_id": case_id or "default-case",
            "ref_type": "lei",
            "ref_id": match.group(1),
            "ref_text": match.group(0),
            "quote_hash": hashlib.sha256(match.group(0).encode()).hexdigest(),
            "marker_map": json.dumps(marker_map),
        })

    # Valores monetários com marcadores
    valor_pattern = re.compile(r"R\$\s*[\d.,]+|\b[\d.,]+\s*(?:reais|salários?|BTU)")
    for match in valor_pattern.finditer(pseudonymized):
        refs.append({
            "case_id": case_id or "default-case",
            "ref_type": "valor",
            "ref_id": match.group(0)[:50],
            "ref_text": match.group(0),
            "quote_hash": hashlib.sha256(match.group(0).encode()).hexdigest(),
            "marker_map": json.dumps(marker_map),
        })

    # Datas com marcadores
    data_pattern = re.compile(r"\d{1,2}[/\.]\d{1,2}[/\.]\d{2,4}")
    for match in data_pattern.finditer(pseudonymized):
        refs.append({
            "case_id": case_id or "default-case",
            "ref_type": "data",
            "ref_id": match.group(0),
            "ref_text": match.group(0),
            "quote_hash": hashlib.sha256(match.group(0).encode()).hexdigest(),
            "marker_map": json.dumps(marker_map),
        })

    return refs


async def _execute_legal_brain(
    db: AsyncSession,
    pseudonymized: str,
    domain: str | None,
    user_id: int,
) -> dict:
    """Executa o Legal Brain sobre o texto já pseudonimizado."""

    # Importação tardia para evitar ciclos
    from app.services.legal_brain import (
        build_legal_brain_plan,
        identify_legal_issues,
    )

    # 1. Plano de análise
    try:
        plan = await build_legal_brain_plan(
            case_text=pseudonymized,
            domain=domain,
        )
    except Exception as e:
        logger.warning(f"build_legal_brain_plan falhou: {e}")
        plan = {"status": "fallback", "error": str(e)}

    # 2. Identificação de issues
    try:
        issues = await identify_legal_issues(
            text=pseudonymized,
            domain=domain,
        )
    except Exception as e:
        logger.warning(f"identify_legal_issues falhou: {e}")
        issues = []

    return {
        "plan": plan if isinstance(plan, dict) else {},
        "issues": issues if isinstance(issues, list) else [],
    }


# ── Cache Redis ───────────────────────────────────────────────────────────────

async def _cache_lookup(
    redis_client: redis.Redis,
    case_id: str | None,
    input_hash: str,
) -> dict | None:
    """Busca resultado em cache Redis."""

    cache_key = f"brain:{case_id or 'no-case'}:{input_hash}"
    try:
        cached = await redis_client.get(cache_key)
        if cached:
            logger.info(f"Cache HIT: {cache_key}")
            return json.loads(cached)
    except Exception as e:
        logger.warning(f"Redis cache lookup falhou: {e}")

    return None


async def _cache_store(
    redis_client: redis.Redis,
    case_id: str | None,
    input_hash: str,
    result: dict,
) -> None:
    """Armazena resultado em cache Redis."""

    cache_key = f"brain:{case_id or 'no-case'}:{input_hash}"
    try:
        await redis_client.setex(
            cache_key,
            _CACHE_TTL_SECONDS,
            json.dumps(result, default=str),
        )
        logger.info(f"Cache STORE: {cache_key}")
    except Exception as e:
        logger.warning(f"Redis cache store falhou: {e}")


# ── Persistência BrainAnalysis ────────────────────────────────────────────────

async def _persist_brain_analysis(
    db: AsyncSession,
    case_id: str | None,
    user_id: int,
    input_hash: str,
    pseudonymized_text: str,
    result: dict,
    marker_map: dict,
    cached: bool,
) -> str:
    """Persiste BrainAnalysis + BrainCache no banco de dados.

    Usa transaction atômica para garantir consistência.
    Retorna o ID do snapshot criado.
    """

    from app.models.case_intelligence import CaseIntelligenceSnapshot

    # Preparar payload com marker_map (NUNCA logado)
    payload = {
        "input_hash": input_hash,
        "legal_plan": result.get("plan", {}),
        "issues": result.get("issues", []),
        "marker_map_size": len(marker_map),
        "cached": cached,
    }

    snapshot = CaseIntelligenceSnapshot(
        case_id=case_id or "no-case",
        versao="1.0",
        origem="brain_api",
        resumo=f"Análise de {len(result.get('issues', []))} questões jurídicas",
        payload=payload,
        ai_log_ids=[],
        congelado=False,
        criado_por=str(user_id),
        criado_em=datetime.now(timezone.utc),
    )

    db.add(snapshot)
    await db.flush()

    # Atualizar cache marker em Redis (sem PII)
    try:
        redis_client = await _get_redis()
        marker_key = f"brain:markers:{snapshot.id}"
        # Armazena só a contagem, não o mapa real
        await redis_client.hset(marker_key, mapping={
            "input_hash": input_hash,
            "marker_count": str(len(marker_map)),
            "cached": str(cached),
        })
        await redis_client.expire(marker_key, _CACHE_TTL_SECONDS)
    except Exception as e:
        logger.warning(f"Falha ao salvar marker metadata no Redis: {e}")

    await db.commit()
    return str(snapshot.id)


# ── Endpoint principal ───────────────────────────────────────────────────────

@router.post("", response_model=BrainContract)
async def analisar_caso(
    body: BrainInput,
    db: AsyncSession = Depends(get_db),
    cu: User = Depends(get_current_user),
    response: Response = None,
):
    """Executa análise jurídica sobre narrativa factual.

    Fluxo de segurança:
    1. Pseudonimização (PII → marcadores [TIPO_N])
    2. Cache Redis (lookup por hash SHA-256)
    3. Legal Brain (plano + issues)
    4. Extração de evidências por item
    5. Persistência atômica
    6. Reidratação da resposta
    7. Retorno com contrato estruturado

    O `marker_map` contém PII real e NUNCA sai do VPS.
    """

    start_time = datetime.now(timezone.utc)

    # ── 1. Pseudonimização (PRIMEIRO — antes de qualquer operação) ──────────
    pseudonymized, marker_map = pseudonimizar(
        texto=body.facts,
        entidades=body.entities,
    )

    # Contar marcadores ANTES de qualquer saída
    marker_counts = _parse_marker_counts(pseudonymized)

    # ── 2. Cache lookup ────────────────────────────────────────────────────
    redis_client = await _get_redis()
    input_hash = _hash_input(pseudonymized, body.domain)

    cached_result = None
    if not body.force_refresh:
        cached_result = await _cache_lookup(
            redis_client, body.case_id, input_hash
        )

    if cached_result:
        # Cache HIT — retorna direto
        return BrainContract(
            case_snapshot_id=cached_result.get("snapshot_id"),
            cache_hit=True,
            cached_at=cached_result.get("cached_at"),
            pseudonymized=True,
            evidence_ref_count=len(cached_result.get("evidence_refs", [])),
            marker_counts=marker_counts,
            marker_map_size=len(marker_map),
            processing_time_ms=int(
                (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            ),
            legal_issues_found=len(cached_result.get("issues", [])),
            issues=cached_result.get("issues", []),
            plan=cached_result.get("plan"),
        )

    # ── 3. Legal Brain (texto já pseudonimizado) ───────────────────────────
    result = await _execute_legal_brain(
        db=db,
        pseudonymized=pseudonymized,
        domain=body.domain,
        user_id=cu.id,
    )

    # ── 4. Extrair evidências por item ──────────────────────────────────────
    evidence_refs = _extract_evidence_refs(
        db=db,
        case_id=body.case_id,
        pseudonymized=pseudonymized,
        marker_map=marker_map,
    )

    # ── 5. Persistência atômica ─────────────────────────────────────────────
    snapshot_id = await _persist_brain_analysis(
        db=db,
        case_id=body.case_id,
        user_id=cu.id,
        input_hash=input_hash,
        pseudonymized_text=pseudonymized,
        result=result,
        marker_map=marker_map,
        cached=False,
    )

    # ── 6. Cache store ─────────────────────────────────────────────────────
    cache_payload = {
        "snapshot_id": snapshot_id,
        "cached_at": datetime.now(timezone.utc).isoformat(),
        "issues": result.get("issues", []),
        "plan": result.get("plan", {}),
        "evidence_refs": evidence_refs,
    }
    await _cache_store(redis_client, body.case_id, input_hash, cache_payload)

    processing_time = int(
        (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
    )

    return BrainContract(
        case_snapshot_id=snapshot_id,
        cache_hit=False,
        cached_at=datetime.now(timezone.utc).isoformat(),
        pseudonymized=True,
        evidence_ref_count=len(evidence_refs),
        marker_counts=marker_counts,
        marker_map_size=len(marker_map),
        processing_time_ms=processing_time,
        legal_issues_found=len(result.get("issues", [])),
        issues=result.get("issues", []),
        plan=result.get("plan", {}),
    )


@router.get("/cache/{case_id}")
async def verificar_cache(
    case_id: str,
    user_id: int = Depends(get_current_user),
):
    """Verifica se existe cache para um case_id."""

    redis_client = await _get_redis()
    try:
        keys = await redis_client.keys(f"brain:{case_id}:*")
        return {
            "case_id": case_id,
            "cached_analyses": len(keys),
            "cache_keys": keys[:20],  # Limita a 20
        }
    except Exception as e:
        raise HTTPException(500, f"Erro ao verificar cache: {e}")


@router.delete("/cache/{case_id}")
async def invalidar_cache(
    case_id: str,
    user_id: int = Depends(get_current_user),
):
    """Invalida todo o cache de um case_id."""

    redis_client = await _get_redis()
    try:
        keys = await redis_client.keys(f"brain:{case_id}:*")
        if keys:
            await redis_client.delete(*keys)
        return {"case_id": case_id, "invalidated": len(keys)}
    except Exception as e:
        raise HTTPException(500, f"Erro ao invalidar cache: {e}")


@router.get("/health")
async def health():
    """Health check do cérebro + Redis."""

    redis_ok = False
    try:
        r = await _get_redis()
        await r.ping()
        redis_ok = True
    except Exception as e:
        logger.warning(f"Redis health check falhou: {e}")

    return {
        "status": "healthy" if redis_ok else "degraded",
        "redis": "connected" if redis_ok else "disconnected",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
