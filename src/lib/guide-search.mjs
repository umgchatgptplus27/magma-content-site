function normalize(value) {
  return value.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim();
}

export function searchGuides(guides, query) {
  const normalizedQuery = normalize(query);
  const terms = normalizedQuery.split(" ").filter(Boolean);
  if (terms.length === 0) return guides;
  return guides.filter((guide) => {
    const text = normalize([guide.title, guide.description, ...guide.tags].join(" "));
    return terms.every((term) => text.includes(term));
  }).map((guide) => {
    const title = normalize(guide.title);
    return {
      guide,
      phraseMatch: Number(title.includes(normalizedQuery)),
      titleMatches: terms.filter((term) => title.includes(term)).length,
    };
  }).sort((a, b) => b.phraseMatch - a.phraseMatch || b.titleMatches - a.titleMatches)
    .map(({ guide }) => guide);
}
