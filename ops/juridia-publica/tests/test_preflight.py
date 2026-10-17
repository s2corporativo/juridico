import pathlib
import re
import unittest

BASE = pathlib.Path(__file__).resolve().parents[1]


class InfraPublicacao(unittest.TestCase):
    def test_proxy_nao_expoe_app_ao_mundo(self):
        conf = (BASE / "nginx-https.template.conf").read_text()
        self.assertIn("server_name juridia.depaulateixeira.adv.br;", conf)
        self.assertIn("proxy_pass http://127.0.0.1:3005;", conf)
        self.assertNotIn("proxy_pass http://0.0.0.0", conf)
        self.assertRegex(conf, r"ssl_certificate /etc/letsencrypt/live/")
        self.assertIn('add_header X-Frame-Options "DENY" always;', conf)

    def test_preflight_tls_e_401(self):
        shell = (BASE / "preflight-https-sso.sh").read_text()
        self.assertIn("getent ahostsv4", shell)
        self.assertIn("tlsv1.2", shell)
        self.assertIn("--proto '=https'", shell)
        for api in ("/api/auth/me", "/api/skills", "/api/documents", "/api/clients", "/api/cases"):
            self.assertIn(api, shell)
        self.assertIn("if [ \"$status\" != 401 ]", shell)
        self.assertIn("issuer", shell)
        self.assertNotIn("--insecure", shell)
        self.assertNotIn("curl -k", shell)

    def test_infra_manual_e_segredos_nao_versionados(self):
        docs = (BASE / "README.md").read_text()
        self.assertIn("Nunca publicar 3005", docs)
        self.assertIn("EJC_SSO_ENABLED=true", docs)
        self.assertIn("NEXT_PUBLIC_DPT_JURIDIA_URL=", docs)


if __name__ == "__main__":
    unittest.main()
