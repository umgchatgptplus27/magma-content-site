import test from "node:test";
import assert from "node:assert/strict";
import { BLOG_PAGE_SIZE, blogPageCount, blogPageHref, parseBlogPage, topicPageHref } from "../src/lib/blog-pagination.mjs";

test("pagination boundaries and canonical first page", () => {
  assert.equal(BLOG_PAGE_SIZE, 24);
  assert.equal(blogPageCount(0), 1);
  assert.equal(blogPageCount(24), 1);
  assert.equal(blogPageCount(25), 2);
  assert.equal(blogPageCount(217), 10);
  assert.equal(blogPageHref(1), "/blog");
  assert.equal(blogPageHref(2), "/blog/page/2");
  assert.equal(topicPageHref("fit-and-basics", 1), "/blog/topic/fit-and-basics");
  assert.equal(topicPageHref("fit-and-basics", 2), "/blog/topic/fit-and-basics/page/2");
  assert.equal(parseBlogPage("10", 217), 10);
  for (const value of ["0", "-1", "01", "1.5", "1e1", "abc", "11", "999999999999999999"]) {
    assert.equal(parseBlogPage(value, 217), null, value);
  }
});

test("paging preserves every item once", () => {
  const items = Array.from({ length: 217 }, (_, index) => index);
  const pages = Array.from({ length: blogPageCount(items.length) }, (_, index) => items.slice(index * BLOG_PAGE_SIZE, (index + 1) * BLOG_PAGE_SIZE));
  assert.deepEqual(pages.flat(), items);
  assert.equal(new Set(pages.flat()).size, items.length);
});
