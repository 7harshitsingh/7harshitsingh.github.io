import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('home is a static root site with canonical metadata', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /<title>Harshit\(7harshitsingh\) - Applied AI Engineer<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/7harshitsingh\.github\.io\//);
  assert.match(html, /<main id="main"/);
  assert.doesNotMatch(html, /Astro Basics|To get started/);
  assert.equal(existsSync('dist/404.html'), false);
});
