import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const articles = JSON.parse(
  readFileSync(new URL("../src/content/articles.json", import.meta.url), "utf8"),
);
test("complete substantive archive retains unique identity, attribution and full-length bodies", () => {
  assert.equal(articles.length, 15);
  assert.equal(new Set(articles.map((a) => a.slug)).size, 15);
  for (const article of articles) {
    assert.equal(article.author, "Christine Osakwe");
    assert.ok(Number.isFinite(Date.parse(article.published)));
    assert.ok(article.html.length > 2000);
    assert.ok(article.originalUrl.endsWith(article.slug));
    assert.doesNotMatch(article.html, /lorem ipsum/i);
  }
});
test("migrated article markup excludes executable content, unapproved media and live form handoffs", () => {
  const allowed = new Set([
    "p",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "b",
    "strong",
    "i",
    "em",
    "br",
    "blockquote",
    "a",
  ]);
  for (const { html } of articles) {
    for (const tag of html.matchAll(/<\/?([a-z][a-z0-9]*)\b/gi)) assert.ok(allowed.has(tag[1]));
    assert.doesNotMatch(
      html,
      /\s(?:style|on\w+|src|srcdoc)\s*=|javascript:|data:|mailto:|calendly\.com|honeybook\.com/i,
    );
    for (const link of html.matchAll(/href="(\/blog\/[^"#?]+)"/g))
      assert.ok(
        articles.some((a) => link[1] === `/blog/${a.slug}`),
        link[1],
      );
  }
});
