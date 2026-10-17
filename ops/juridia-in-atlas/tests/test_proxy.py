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
 def test_public_verification_targets_one_domain(self):
  script=(BASE/'preflight.sh').read_text()
  self.assertIn('https://atlas.depaulateixeira.adv.br',script)
  self.assertIn('/juridia/api/auth/me',script)
  self.assertIn('/api/ejc-sso/start',script)
  self.assertNotIn('juridia.depaulateixeira.adv.br',script)
if __name__=='__main__':unittest.main()
