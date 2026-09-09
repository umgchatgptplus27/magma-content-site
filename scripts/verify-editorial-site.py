"""Read-only HTTP verification against the exact audited public inventory."""
import concurrent.futures
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

base = sys.argv[1].rstrip('/')
output = Path(sys.argv[2])
expected = json.loads(Path('docs/content-cleanup-audit.json').read_text())['entries']
expected = [e for e in expected if e['published']]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.h1, self.text = [], [], []
        self.canonical = None
        self.heading = False
        self.ignore = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'): self.ignore += 1
        if tag == 'h1': self.heading = True
        if tag == 'a': self.links.append(attrs.get('href', ''))
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical = attrs.get('href')
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.ignore = max(0, self.ignore - 1)
        if tag == 'h1': self.heading = False
    def handle_data(self, data):
        if not self.ignore:
            self.text.append(data)
            if self.heading: self.h1.append(data)

def get(path):
    result = subprocess.run(['curl', '-sS', '--max-time', '45', base + path, '-w', '\n%{http_code}'], capture_output=True, text=True)
    body, _, status = result.stdout.rpartition('\n')
    return body, status

def verify(entry):
    path = '/blog/' + entry['slug']
    body, status = get(path)
    parser = Page()
    parser.feed(body)
    defects = []
    if status != '200': defects.append('http_' + status)
    if ''.join(parser.h1).strip() != entry['title']: defects.append('title_mismatch')
    if parser.canonical != 'https://www.eurachoachoa.com' + path: defects.append('canonical_mismatch')
    if re.search(r'Mia 참고 이미지 장면|생성 API.{0,30}복구|고정 slug|추천 태그|무문자', ' '.join(parser.text)): defects.append('production_artifact')
    return {'slug': entry['slug'], 'status': status, 'defects': defects}

rows = []
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for row in pool.map(verify, expected):
        rows.append(row)
        if len(rows) % 20 == 0:
            output.write_text(json.dumps({'partial': True, 'articles': rows}, ensure_ascii=False, indent=2))

listing = []
page_number = 1
while True:
    path = '/blog' if page_number == 1 else '/blog/page/' + str(page_number)
    body, status = get(path)
    parser = Page(); parser.feed(body)
    if status != '200': raise RuntimeError(f'Listing {path}: {status}')
    if parser.canonical != 'https://www.eurachoachoa.com' + path: raise RuntimeError('Listing canonical mismatch')
    listing.extend(sorted(set(href for href in parser.links if re.fullmatch('/blog/[a-z0-9-]+', href))))
    if '/blog/page/' + str(page_number + 1) not in parser.links: break
    page_number += 1
    if page_number > 100: raise RuntimeError('Unbounded pagination')

expected_paths = {'/blog/' + e['slug'] for e in expected}
sitemap, sitemap_status = get('/sitemap.xml')
summary = {
    'base': base, 'expected': len(expected), 'verified': len(rows),
    'failed_articles': [r for r in rows if r['defects']],
    'listing_pages': page_number, 'listing_links': len(listing), 'unique_listing_links': len(set(listing)),
    'missing_from_listing': sorted(expected_paths - set(listing)),
    'unexpected_listing': sorted(set(listing) - expected_paths),
    'sitemap_status': sitemap_status,
    'missing_from_sitemap': sorted(p for p in expected_paths if 'https://www.eurachoachoa.com' + p + '</loc>' not in sitemap),
}
summary['passed'] = (not summary['failed_articles'] and not summary['missing_from_listing'] and not summary['unexpected_listing'] and len(listing) == len(expected_paths) and sitemap_status == '200' and not summary['missing_from_sitemap'])
output.write_text(json.dumps({'summary': summary, 'articles': rows}, ensure_ascii=False, indent=2))
print(json.dumps(summary, ensure_ascii=False, indent=2))
sys.exit(0 if summary['passed'] else 1)
