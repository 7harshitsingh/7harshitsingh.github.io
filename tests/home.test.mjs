import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('home has identity, verified link, and no empty claims', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /class="home-grid"/);
  assert.match(html, /<h1[^>]*>Harshit Singh<\/h1>/);
  assert.match(html, /https:\/\/github\.com\/7harshitsingh/);
  assert.doesNotMatch(html, /Astro Basics|To get started|example project/i);
});
