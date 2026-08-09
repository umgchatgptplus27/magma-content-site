#!/usr/bin/env node

/**
 * Deterministic technical SEO inspection for one rendered MAGMA post.
 * This is a Google SEO Starter Guide baseline check, not an indexing or ranking claim.
 */

const DEFAULT_PUBLIC_ORIGIN = "https://www.eurachoachoa.com";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(code) {
  throw new Error(code);
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const field = { "--base-url": "baseUrl", "--slug": "slug", "--public-origin": "publicOrigin" }[key];
    if (!field || index + 1 >= argv.length) fail("invalid_cli_arguments");
    values[field] = argv[index + 1];
    index += 1;
  }
  if (!values.baseUrl || !values.slug) fail("base_url_and_slug_are_required");
  if (!SLUG_RE.test(values.slug)) fail("slug_invalid");
  return {
    baseUrl: values.baseUrl.replace(/\/$/, ""),
    slug: values.slug,
    publicOrigin: (values.publicOrigin || DEFAULT_PUBLIC_ORIGIN).replace(/\/$/, ""),
  };
}

async function get(url) {
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(20_000) });
  const text = await response.text();
  return { status: response.status, text, contentType: response.headers.get("content-type") || "" };
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? match[1] ?? match[2] ?? match[3] ?? null : null;
}

function metaPresent(head, attribute, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=(?:"${escaped}"|'${escaped}'|${escaped}(?:\\s|>)))[^>]*>`, "i").test(head);
}

function jsonLdTypes(head) {
  const scripts = [...head.matchAll(/<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();
  for (const script of scripts) {
    for (const match of script[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)) {
      types.add(match[1]);
    }
  }
  return types;
}

async function main() {
  const { baseUrl, slug, publicOrigin } = parseArgs(process.argv.slice(2));
  const postPath = `/blog/${slug}`;
  const canonical = `${publicOrigin}${postPath}`;
  const result = {
    base_url: baseUrl,
    public_origin: publicOrigin,
    slug,
    checks: {},
    errors: [],
  };

  try {
    const page = await get(`${baseUrl}${postPath}`);
    result.checks.page_http_200 = page.status === 200;
    const headMatch = page.text.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
    const head = headMatch?.[1] || "";
    result.checks.lang_ko = /<html\b[^>]*\blang=(?:"ko"|'ko'|ko(?:\s|>))/i.test(page.text);
    result.checks.title = /<title>\s*\S[\s\S]*?<\/title>/i.test(head);
    result.checks.description = metaPresent(head, "name", "description");
    result.checks.h1 = /<h1\b[^>]*>\s*\S[\s\S]*?<\/h1>/i.test(page.text);
    result.checks.canonical = new RegExp(`<link\\b(?=[^>]*\\brel=(?:"canonical"|'canonical'|canonical(?:\\s|>)))(?=[^>]*\\bhref=(?:"${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"|'${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'))[^>]*>`, "i").test(head);
    result.checks.og_title = metaPresent(head, "property", "og:title");
    result.checks.og_description = metaPresent(head, "property", "og:description");
    result.checks.og_url = metaPresent(head, "property", "og:url");
    result.checks.twitter_card = metaPresent(head, "name", "twitter:card");
    const types = jsonLdTypes(page.text);
    result.checks.article_jsonld = types.has("Article");
    result.checks.breadcrumb_jsonld = types.has("BreadcrumbList");
    const imgTags = [...page.text.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    result.checks.image_alt_attributes = imgTags.every((tag) => attr(tag, "alt") !== null);
    result.image_count = imgTags.length;

    const sitemap = await get(`${baseUrl}/sitemap.xml`);
    result.checks.sitemap_http_200 = sitemap.status === 200;
    result.checks.sitemap_includes_canonical_post = sitemap.text.includes(canonical);
    const robots = await get(`${baseUrl}/robots.txt`);
    result.checks.robots_http_200 = robots.status === 200;
    result.checks.robots_declares_public_sitemap = robots.text.includes(`${publicOrigin}/sitemap.xml`);
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : "unexpected_error");
  }

  result.ok = result.errors.length === 0 && Object.values(result.checks).every(Boolean);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.log(JSON.stringify({ ok: false, errors: [error instanceof Error ? error.message : "unexpected_error"] }, null, 2));
  process.exitCode = 1;
});
