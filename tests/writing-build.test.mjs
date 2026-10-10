import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
mkdirSync(join(root, '.astro'), { recursive: true });
const fixtureRoot = mkdtempSync(join(root, '.astro', 'writing-fixture-'));
const content = join(fixtureRoot, 'content');
const dist = join(fixtureRoot, 'dist');
const draft = join(content, 'zz-plan-draft.md');
const published = join(content, 'zz-plan-published.md');
const invalid = join(content, 'zz-plan-invalid.md');

function build() {
  return spawnSync('npm', ['run', 'build'], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      WRITING_CONTENT_DIR: content,
      ASTRO_OUT_DIR: dist,
    },
  });
}
function expectBuild() {
  const result = build();
  assert.equal(result.status, 0, result.stdout + result.stderr);
}
function html(path) {
  return readFileSync(join(dist, path), 'utf8');
}

function generatedHtml() {
  return readdirSync(dist, { recursive: true })
    .filter((name) => name.endsWith('.html'))
    .sort();
}

test('empty, implicit draft, published, and invalid writing', { timeout: 120_000 }, () => {
  mkdirSync(content, { recursive: true });
  assert.deepEqual(readdirSync(content).filter((name) => name.endsWith('.md')), []);
  try {
    expectBuild();
    assert.deepEqual(generatedHtml(), ['index.html']);
    assert.match(html('index.html'), /No articles published yet/);

    writeFileSync(draft, [
      '---',
      'title: Draft fixture',
      'description: Hidden test article.',
      'date: 2026-10-10',
      '---',
      'Private fixture body.',
    ].join('\n'));
    expectBuild();
    assert.deepEqual(generatedHtml(), ['index.html']);
    assert.doesNotMatch(html('index.html'), /Draft fixture|Private fixture body/);

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
    assert.deepEqual(generatedHtml(), ['index.html']);
    assert.match(html('index.html'), /Published fixture/);
    assert.match(html('index.html'), /href="#writing-zz-plan-published"/);
    assert.match(html('index.html'), /Published fixture body|A section/);
    assert.match(html('index.html'), /<pre/);
    assert.doesNotMatch(html('index.html'), /Draft fixture|Private fixture body/);

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
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
