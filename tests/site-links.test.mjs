import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const origin = 'https://7harshitsingh.github.io';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

test('Pages workflow exists and generated local URLs resolve', () => {
  assert.ok(existsSync('.github/workflows/deploy.yml'), 'Pages workflow missing');
  for (const file of htmlFiles(dist)) {
    const html = readFileSync(file, 'utf8');
    for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (value.startsWith('#')) continue;
      const url = new URL(value, origin);
      if (url.origin !== origin) continue;
      const path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const target = join(dist, path);
      const generated = url.pathname.endsWith('/') || !extname(target)
        ? join(target, 'index.html')
        : target;
      assert.ok(existsSync(generated), `${file}: ${value} has no generated target`);
    }
  }
});
