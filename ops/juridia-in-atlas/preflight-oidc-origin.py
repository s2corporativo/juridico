#!/usr/bin/env python3
"""Verifica redirecionamentos OIDC atrás do proxy, sem contas nem segredos."""
import sys
import urllib.error
import urllib.parse
import urllib.request

HOSTS = {
    "https://atlas.13.140.167.153.sslip.io",
    "https://atlas.depaulateixeira.adv.br",
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *_args, **_kwargs):
        return None


def redirect(url: str, expected_status: int) -> str:
    opener = urllib.request.build_opener(NoRedirect())
    try:
        response = opener.open(url, timeout=12)
    except urllib.error.HTTPError as exc:
        response = exc
    if response.status != expected_status:
        raise RuntimeError(f"HTTP {response.status} (esperado {expected_status})")
    location = response.headers.get("Location", "")
    if not location:
        raise RuntimeError("Location ausente")
    return urllib.parse.urljoin(url, location)


def verify(origin: str) -> None:
    if origin not in HOSTS:
        raise RuntimeError("Origem fora da allowlist institucional")
    auth = redirect(origin + "/api/ejc-sso/start", 302)
    a = urllib.parse.urlsplit(auth)
    if a.scheme + "://" + a.netloc != origin or a.path != "/juridia/api/auth/oidc/authorize":
        raise RuntimeError("Início SSO fora da origem única")
    login = redirect(auth, 307)
    l = urllib.parse.urlsplit(login)
    if l.scheme + "://" + l.netloc != origin or l.path != "/juridia/login":
        raise RuntimeError("Login foi desviado para localhost ou outra origem")
    continuation = urllib.parse.parse_qs(l.query).get("next", [""])[0]
    n = urllib.parse.urlsplit(continuation)
    if n.scheme + "://" + n.netloc != origin or n.path != "/juridia/api/auth/oidc/authorize":
        raise RuntimeError("Retorno da autenticação sem basePath público")
    if not urllib.parse.parse_qs(n.query).get("code_challenge"):
        raise RuntimeError("PKCE perdido no redirecionamento")
    print("SSO_OIDC_ORIGIN_PREFLIGHT_PASS")


if __name__ == "__main__":
    try:
        verify(sys.argv[1] if len(sys.argv) > 1 else "https://atlas.13.140.167.153.sslip.io")
    except Exception as exc:
        print(f"SSO_OIDC_ORIGIN_PREFLIGHT_BLOCKED: {str(exc).split('?')[0][:160]}", file=sys.stderr)
        raise SystemExit(1)
