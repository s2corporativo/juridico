import pathlib
import unittest
BASE=pathlib.Path(__file__).resolve().parents[1]
class ProxyPrefix(unittest.TestCase):
 def test_api_prefix_wont_strip(self):
  text=(BASE/'Caddyfile.stage.template').read_text()
  self.assertIn('@juridia path /juridia /juridia/*', text)
  self.assertIn('reverse_proxy 127.0.0.1:3005', text)
  self.assertNotIn('handle_path', '\n'.join(x for x in text.splitlines() if not x.lstrip().startswith('#')))
  self.assertIn('reverse_proxy 127.0.0.1:3114',text)
 def test_tls_termination_trusted_only_on_loopback(self):
  text=(BASE/'Caddyfile.stage.template').read_text()
  self.assertIn(':8443 {',text)
  self.assertIn('bind 127.0.0.1',text)
  self.assertNotIn('http://127.0.0.1:8443 {',text)
  self.assertEqual(text.count('header_up X-Forwarded-Proto https'),3)
  for port in (3005,3003,3114):
   self.assertIn(f'reverse_proxy 127.0.0.1:{port}',text)
  service=(BASE/'atlas-caddy-stage.service').read_text()
  self.assertIn('User=sentinelx',service)
  self.assertIn('NoNewPrivileges=true',service)
  self.assertIn('ProtectSystem=strict',service)
  self.assertIn('Restart=on-failure',service)
 def test_public_verification_targets_one_domain(self):
  script=(BASE/'preflight.sh').read_text()
  self.assertIn('https://atlas.depaulateixeira.adv.br',script)
  self.assertIn('/juridia/api/auth/me',script)
  self.assertIn('/api/ejc-sso/start',script)
  self.assertNotIn('juridia.depaulateixeira.adv.br',script)
if __name__=='__main__':unittest.main()
