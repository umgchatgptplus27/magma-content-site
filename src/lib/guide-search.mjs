function normalize(value) {
  return value.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim();
}

export function searchGuides(guides, query) {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return guides;
  return guides.filter((guide) => {
    const text = normalize([guide.title, guide.description, ...guide.tags].join(" "));
    return terms.every((term) => text.includes(term));
  });
}
