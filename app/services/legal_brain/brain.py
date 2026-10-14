"""Núcleo de planejamento determinístico do Legal Brain.

Este módulo constrói o ``LegalBrainPlan`` — um plano que guia o
``SingleAICoreOrchestrator`` sem substituí-lo.

O plano é:
1. Determinístico (sem chamada a modelo de linguagem).
2. Baseado em contratos de skill e detecção de issues.
3. Auditável (cada issue tem evidência de texto).
"""

from __future__ import annotations

from app.services.legal_brain.contracts import (
    LegalBrainPlan,
    LegalIssue,
    ResearchPlan,
)
from app.services.legal_brain.issue_engine import identify_legal_issues
from app.services.legal_brain.research_loop import build_research_plan
from app.services.legal_brain.skill_contracts import native_legal_skill_contracts


def build_legal_brain_plan(
    *,
    task_type: str,
    domain: str | None = None,
    message: str,
    module_key: str | None = None,
    surface: str | None = None,
) -> LegalBrainPlan:
    """Constrói plano determinístico para um caso ou mensagem jurídica.

    Args:
        task_type:  Tipo da tarefa (ejc, triagem, pesquisa, etc).
        domain:     Domínio sobreposto (trabalhista, tributario, etc).
        message:    Texto narrativo do caso ou pergunta.
        module_key: Chave do módulo EJC, se já identificado.
        surface:    Superfície de entrada (chat, documento, etc).

    Returns:
        LegalBrainPlan com issues, skills nativas e planos de pesquisa.
    """
    area = domain or _infer_area_from_module(module_key) or "nao_identificada"

    # 1. Identificar issues do texto
    issues = identify_legal_issues(message, area=area, limit=8)

    # 2. Coletar skills nativas compatíveis
    skill_names = _resolve_native_skills(area, [i.key for i in issues])

    # 3. Construir planos de pesquisa para cada issue
    research_plans: list[ResearchPlan] = []
    for issue in issues:
        plan = build_research_plan(issue, max_cycles=3)
        research_plans.append(plan)

    # 4. Warnings determinísticos
    warnings: list[str] = []
    if len(issues) == 0:
        warnings.append("NENHUMA_ISSUE_IDENTIFICADA_PELO_MOTOR_DETERMINISTICO")
    if not skill_names:
        warnings.append("NENHUMA_SKILL_NATIVA_COMPATIVEL")

    return LegalBrainPlan(
        area=area,
        issues=issues,
        native_skill_names=tuple(skill_names),
        research_plans=tuple(research_plans),
        warnings=tuple(warnings),
        metadata={
            "task_type": task_type,
            "module_key": module_key,
            "surface": surface,
            "issues_count": len(issues),
        },
    )


def _infer_area_from_module(module_key: str | None) -> str | None:
    """Infere área jurídica a partir da chave do módulo EJC."""
    if not module_key:
        return None
    mapping = {
        "trabalhista": "trabalhista",
        "tributario": "tributario",
        "civel": "civel",
        "penal": "penal",
        "previdenciario": "previdenciario",
        "bancario": "bancario",
        "empresarial": "empresarial",
        "contratos": "empresarial",
        "societario": "empresarial",
        "ambiental": "ambiental",
        "consumidor": "consumidor",
    }
    key_lower = module_key.lower()
    for prefix, area in mapping.items():
        if prefix in key_lower:
            return area
    return None


def _resolve_native_skills(area: str, issue_keys: list[str]) -> list[str]:
    """Resolve nomes das skills nativas compatíveis com área + issues."""
    all_contracts = native_legal_skill_contracts()
    matched: list[str] = []
    for contract in all_contracts:
        if contract.area == area or not contract.area:
            matched.append(contract.key)
    return matched
