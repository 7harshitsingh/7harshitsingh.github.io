import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const content = join(root, 'src/content/writing');
const dist = join(root, 'dist');
const draft = join(content, 'zz-plan-draft.md');
const published = join(content, 'zz-plan-published.md');
const invalid = join(content, 'zz-plan-invalid.md');

function build() {
  return spawnSync('npm', ['run', 'build'], { cwd: root, encoding: 'utf8' });
}
function expectBuild() {
  const result = build();
  assert.equal(result.status, 0, result.stdout + result.stderr);
}
function html(path) {
  return readFileSync(join(dist, path), 'utf8');
}

test('empty, implicit draft, published, and invalid writing', { timeout: 120_000 }, () => {
  mkdirSync(content, { recursive: true });
  assert.deepEqual(readdirSync(content).filter((name) => name.endsWith('.md')), []);
  try {
    expectBuild();
    assert.ok(existsSync(join(dist, 'writing/index.html')));
    assert.match(html('writing/index.html'), /No articles published yet/);
    assert.doesNotMatch(html('index.html'), /href="\/writing\/"/);

    writeFileSync(draft, [
      '---',
      'title: Draft fixture',
      'description: Hidden test article.',
      'date: 2026-10-10',
      '---',
      'Private fixture body.',
    ].join('\n'));
    expectBuild();
    assert.ok(!existsSync(join(dist, 'writing/zz-plan-draft/index.html')));
    assert.doesNotMatch(html('writing/index.html'), /Draft fixture/);
    assert.doesNotMatch(html('index.html'), /href="\/writing\/"/);

    writeFileSync(published, [
      '---',
      'title: Published fixture',
      'description: Public test article.',
      'date: 2026-10-10',
      'draft: false',
      'tags: [astro]',
      '---',
      '# A section',
      '',
      '```ts',
      'const answer = 42;',
      '```',
    ].join('\n'));
    expectBuild();
    assert.ok(existsSync(join(dist, 'writing/zz-plan-published/index.html')));
    assert.match(html('writing/index.html'), /Published fixture/);
    assert.match(html('writing/index.html'), /href="\/writing\/zz-plan-published\/"/);
    assert.doesNotMatch(html('writing/index.html'), /Draft fixture/);
    assert.match(html('index.html'), /href="\/writing\/"/);
    assert.match(html('writing/zz-plan-published/index.html'), /<h1>Published fixture<\/h1>/);
    assert.match(html('writing/zz-plan-published/index.html'), /<pre/);
    assert.match(html('writing/zz-plan-published/index.html'), /https:\/\/7harshitsingh\.github\.io\/writing\/zz-plan-published\//);

    writeFileSync(invalid, [
      '---',
      'description: Missing title.',
      'date: 2026-10-10',
      'draft: false',
      '---',
      'Invalid fixture body.',
    ].join('\n'));
    const result = build();
    assert.notEqual(result.status, 0, 'missing required title must fail the build');
  } finally {
    for (const file of [draft, published, invalid]) rmSync(file, { force: true });
    expectBuild();
  }
});
