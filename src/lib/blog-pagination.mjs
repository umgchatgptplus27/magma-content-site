export const BLOG_PAGE_SIZE = 24;

export function blogPageHref(page) {
  return page === 1 ? "/blog" : `/blog/page/${page}`;
}

export function blogPageCount(total) {
  return Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
}

export function parseBlogPage(value, total) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= blogPageCount(total) ? page : null;
}
