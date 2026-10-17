import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import katex from 'katex';

const source = readFileSync('src/content/writing/scaling-jev-decisions-at-low-latency.md', 'utf8');
const html = readFileSync('dist/index.html', 'utf8');

test('the first published article stays decision-focused and keeps its figures', () => {
  assert.match(html, /data-writing-open="scaling-jev-decisions-at-low-latency"/);
  assert.match(html, /160\/202 \(79\.2%\)/);
  assert.match(html, /156\/202 \(77\.2%\)/);
  assert.doesNotMatch(source, /classification|document|product roster|catalog|pipeline prediction/i);
  assert.equal((html.match(/class="writing-detail"/g) ?? []).length, 1);
});

test('all article formulas parse and the Mermaid source reaches the page', () => {
  const formulas = [...html.matchAll(/<code class="language-math (math-(?:inline|display))">([\s\S]*?)<\/code>/g)];
  assert.ok(formulas.length > 0, 'math syntax must be preserved for rendering');
  for (const [, kind, encoded] of formulas) {
    const rendered = katex.renderToString(encoded.replaceAll('&amp;', '&'), {
      displayMode: kind === 'math-display',
      throwOnError: true,
    });
    assert.match(rendered, /katex-mathml/);
  }
  assert.match(source, /```mermaid\nflowchart TB/);
  assert.match(html, /data-language="mermaid"/);
  assert.match(html, /Order-averaged scores/);
});
