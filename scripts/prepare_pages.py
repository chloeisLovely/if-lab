"""Prepare an isolated public GitHub Pages artifact without changing dist/."""
import argparse
from pathlib import Path
import re
import shutil
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='https://chloeislovely.github.io/if-lab')
args = parser.parse_args()
base = args.base_url.rstrip('/')
url = urlparse(base)
if url.scheme != 'https' or not url.netloc or url.query or url.fragment:
    raise SystemExit('base-url must be an HTTPS origin and optional path')
output = ROOT / '_site'
if output.exists():
    shutil.rmtree(output)
shutil.copytree(ROOT / 'dist', output)
old = 'https://if-lab-human-potential.glassyharp3.chatgpt.site'
for page in output.glob('*.html'):
    body = page.read_text(encoding='utf-8').replace(old, base)
    if page.name != '404.html':
        body = re.sub(r'<meta name="robots" content="noindex, nofollow">', '', body)
    else:
        # A 404 can be served at any depth; resolve links against the site root.
        body = body.replace('<head>', '<head><base href="' + base + '/">', 1)
    page.write_text(body, encoding='utf-8')
sitemap = output / 'sitemap.xml'
sitemap.write_text(sitemap.read_text().replace(old, base), encoding='utf-8')
(output / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: ' + base + '/sitemap.xml\n', encoding='utf-8')
(output / '.nojekyll').touch()
# _headers belongs to a different host, not to GitHub Pages.
(output / '_headers').unlink(missing_ok=True)
print('Prepared GitHub Pages artifact:', output)
print('Base URL:', base)
