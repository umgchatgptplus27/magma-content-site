// Local triage only: similarity is not a Google score or a merge decision.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
const root = 'content/posts';
const docs = fs.readdirSync(root).filter(f => f.endsWith('.md')).sort().map(file => {
  const {data, content} = matter(fs.readFileSync(path.join(root, file), 'utf8'));
  const body = content.split(/^## (?:출처|참고|Sources|References)/im)[0].replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/https?:\/\/\S+/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const terms = new Map();
  for (const word of body.toLowerCase().match(/[가-힣a-z]{3,}/g) ?? []) {
    for (let i = 0; i <= word.length - 3; i++) {
      const term = word.slice(i, i + 3);
      terms.set(term, (terms.get(term) ?? 0) + 1);
    }
  }
  return {slug: file.slice(0,-3), title:data.title, draft:data.draft === true, terms};
}).filter(d => !d.draft);
const df = new Map();
for (const d of docs) for (const t of d.terms.keys()) df.set(t, (df.get(t) ?? 0) + 1);
for (const d of docs) {
  let norm = 0;
  d.vector = new Map();
  for (const [t, count] of d.terms) {
    if (df.get(t) > docs.length * 0.5) continue;
    const weight = (1 + Math.log(count)) * Math.log(1 + docs.length / df.get(t));
    d.vector.set(t, weight); norm += weight * weight;
  }
  for (const [t, weight] of d.vector) d.vector.set(t, weight / (Math.sqrt(norm) || 1));
}
const pairs = [];
for(let i=0;i<docs.length;i++) for(let j=i+1;j<docs.length;j++) {
  const a=docs[i], b=docs[j];
  let score=0;
  for (const [t,w] of a.vector) score += w * (b.vector.get(t) ?? 0);
  pairs.push({a:a.slug,b:b.slug,titleA:a.title,titleB:b.title,similarity:Number(score.toFixed(4))});
}
pairs.sort((a,b)=> b.similarity-a.similarity || a.a.localeCompare(b.a));
const nearest = docs.map(d => ({slug:d.slug,title:d.title, nearest:pairs.find(p => p.a === d.slug || p.b === d.slug)}));
const result={method:'Korean/Latin word-internal 3-gram TF-IDF cosine; common grams >50% excluded; images and source list excluded. Triage only, not an originality or Google score.',publicCount:docs.length,pairCount:pairs.length,topPairs:pairs.slice(0,50),nearest};
fs.writeFileSync('docs/content-overlap-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({publicCount:docs.length,pairCount:pairs.length,topPairs:pairs.slice(0,8)},null,2));
