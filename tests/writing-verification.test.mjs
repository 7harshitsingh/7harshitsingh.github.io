import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const content = join(root, 'src/content/writing');
const article = join(content, 'zz-production-article.md');
const output = join(root, 'dist/writing/zz-production-article/index.html');

function run(command, args) {
  const { NODE_TEST_CONTEXT: _nodeTestContext, ...env } = process.env;
  return spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    env,
  });
}

test('fixture publication checks preserve a real article artifact', { timeout: 120_000 }, () => {
  mkdirSync(content, { recursive: true });
  writeFileSync(article, [
    '---',
    'title: Production fixture',
    'description: A checked production artifact.',
    'date: 2026-10-10',
    'draft: false',
    '---',
    'Published fixture body.',
  ].join('\n'));

  try {
    assert.deepEqual(readdirSync(content).filter((name) => name.endsWith('.md')), ['zz-production-article.md']);
    const build = run('npm', ['run', 'build']);
    assert.equal(build.status, 0, build.stdout + build.stderr);
    assert.ok(existsSync(output), 'published article was not built');
    assert.ok(existsSync(article), 'build removed the production article source');

    const fixtures = run('node', ['--test', 'tests/writing-build.test.mjs']);
    assert.equal(fixtures.status, 0, fixtures.stdout + fixtures.stderr);
    assert.ok(existsSync(output), 'fixture checks replaced the production artifact');
  } finally {
    rmSync(article, { force: true });
    const restore = run('npm', ['run', 'build']);
    assert.equal(restore.status, 0, restore.stdout + restore.stderr);
  }
});
