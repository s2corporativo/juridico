#!/usr/bin/env python3
"""Bootstrap executado *manualmente pelo administrador* no console da VPS.

Concede ao agente SentinelX escrita APENAS em caminhos de release,
rollback, dados do piloto e drop-in systemd do Atlas staging.
Não libera escrita no arquivo de segredos nem em outras aplicações.
"""
from __future__ import annotations

import datetime as dt
import os
from pathlib import Path
import shutil
import stat
import sys
import tempfile

try:
    import yaml
except ImportError:
    print("BLOQUEADO: Python PyYAML indisponível. Instale-o pelo gerenciador do sistema.", file=sys.stderr)
    sys.exit(2)

CONFIG = Path("/etc/sentinelx/config.yaml")
PATHS = (
    "/opt/atlas-juridico/staging/unified/releases",
    "/opt/atlas-juridico/staging/unified/rollback-causal",
    "/var/lib/atlas-juridico/causal-pilot",
    "/etc/systemd/system/atlas-forense-stage.service.d",
)
ANCHOR = "file_ops:\n  paths:\n"


def main() -> int:
    if os.geteuid() != 0:
        print("BLOQUEADO: execute pelo console da VPS com sudo.", file=sys.stderr)
        return 2
    if not CONFIG.is_file():
        print("BLOQUEADO: /etc/sentinelx/config.yaml não encontrado.", file=sys.stderr)
        return 2
    before = CONFIG.read_text(encoding="utf-8")
    if before.count(ANCHOR) != 1:
        print("BLOQUEADO: seção file_ops.paths diferente da esperada.", file=sys.stderr)
        return 2

    obj = yaml.safe_load(before)
    if not isinstance(obj, dict) or not isinstance(obj.get("file_ops", {}).get("paths"), list):
        print("BLOQUEADO: configuração não possui lista file_ops.paths válida.", file=sys.stderr)
        return 2
    current = {e["path"]: e.get("access") for e in obj["file_ops"]["paths"] if isinstance(e, dict) and "path" in e}
    for path in PATHS:
        if path in current and current[path] != "rw":
            print(f"BLOQUEADO: {path} existe com acesso {current[path]}; não sobrescrever restrição existente.", file=sys.stderr)
            return 2
    missing = [path for path in PATHS if path not in current]
    if not missing:
        print("POLÍTICA JÁ CONFIGURADA: nenhuma alteração necessária.")
        return 0

    insertion = ("    # Atlas Causal — escopo aprovado para homologação; não inclui segredos.\n"
                 + "".join(f"    - path: {path}\n      access: rw\n" for path in missing))
    after = before.replace(ANCHOR, ANCHOR + insertion, 1)
    updated = yaml.safe_load(after)
    assert len(updated["file_ops"]["paths"]) == len(obj["file_ops"]["paths"]) + len(missing)
    old_clone = yaml.safe_load(before)
    new_clone = yaml.safe_load(after)
    old_clone["file_ops"]["paths"] = []
    new_clone["file_ops"]["paths"] = []
    if old_clone != new_clone:
        print("BLOQUEADO: edição afetaria configurações fora da lista de caminhos.", file=sys.stderr)
        return 2

    # Backups e instalação atômica ANTES de reiniciar o agente.
    timestamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup = CONFIG.with_name(f"config.yaml.bak-atlas-{timestamp}")
    shutil.copy2(CONFIG, backup)
    old_mode = stat.S_IMODE(CONFIG.stat().st_mode)
    fd, tmp_name = tempfile.mkstemp(prefix=".config-atlas-", dir=str(CONFIG.parent), text=True)
    try:
        os.fchmod(fd, old_mode)
        with os.fdopen(fd, "w", encoding="utf-8") as out:
            out.write(after)
            out.flush()
            os.fsync(out.fileno())
        os.replace(tmp_name, CONFIG)
    finally:
        if os.path.exists(tmp_name):
            os.unlink(tmp_name)
    print("POLÍTICA_ATLAS_ATUALIZADA")
    print(f"BACKUP={backup}")
    for path in missing:
        print(f"ALLOWED_RW={path}")
    print("Não foi liberada escrita no arquivo de segredos da VPS.")
    print("Reinicie o agente: sudo systemctl restart sentinelx-cloud-core")
    print("Depois da reconexão, confirme a lista em SentinelX capabilities.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
