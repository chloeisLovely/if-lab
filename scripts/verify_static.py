"""No-dependency internal site validation, suitable for GitHub Actions."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re, sys
ROOT=Path(__file__).resolve().parents[1]/"dist"
class Parser(HTMLParser):
    def __init__(self):
        super().__init__();self.links=[];self.ids=set();self.images=[];self.title=False;self.doc_title=''
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.add(attrs['id'])
        for prop in (('href',) if tag in ('a','link') else ('src',) if tag in ('script','img') else ()):
            if attrs.get(prop):self.links.append((tag,attrs[prop]))
        if tag=='img':self.images.append(attrs)
        if tag=='title':self.title=True
    def handle_data(self,data):
        if self.title:self.doc_title+=data
    def handle_endtag(self,tag):
        if tag=='title':self.title=False

pages={p.name:p for p in ROOT.glob('*.html')}
parsers={}
problems=[]
for name,path in pages.items():
    parser=Parser();parser.feed(path.read_text(encoding='utf-8'));parsers[name]=parser
    if not parser.doc_title.strip():problems.append(f'{name} is missing <title>')
    for im in parser.images:
        if 'alt' not in im:problems.append(f'{name} image missing alt: {im.get("src")}')
for name,parser in parsers.items():
    for tag,href in parser.links:
        if href.startswith(('http:', 'https:', 'mailto:', 'tel:', 'data:', 'javascript:')):continue
        if href.startswith('#'): target=name; frag=href[1:]
        else:
            parsed=urlsplit(href); target=unquote(parsed.path) or name; frag=parsed.fragment
        dest=ROOT/target
        if not dest.exists():problems.append(f'{name}: missing {tag} target {href}')
        elif frag and target in parsers and frag not in parsers[target].ids:
            problems.append(f'{name}: missing fragment {href}')
for expected in ['index.html','services.html','asnm.html','impact.html','resources.html','privacy.html','404.html']:
    if expected not in pages:problems.append('Missing required page: '+expected)
for expected in ['if-lab-introduction.pdf','ai-workflow-kit.pdf','data-decision-starter.pdf','idea-validation-canvas.pdf']:
    if not (ROOT/'resources'/expected).exists():problems.append('Missing downloadable '+expected)
print(f'Validated {len(pages)} HTML pages, {sum(len(p.links) for p in parsers.values())} link and asset references')
if problems:
    for problem in problems: print('ERROR:',problem)
    sys.exit(1)
print('PASS: no missing internal link or download files')
