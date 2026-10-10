import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';

const dist = join(process.cwd(), 'dist');
const origin = 'https://7harshitsingh.github.io';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

function pageUrl(file) {
  const path = relative(dist, file).split(sep).join('/');
  const pathname = path === 'index.html'
    ? '/'
    : path.endsWith('/index.html')
      ? `/${path.slice(0, -'index.html'.length)}`
      : `/${path}`;
  return new URL(pathname, origin);
}

function generatedTarget(file, value) {
  const url = new URL(value, pageUrl(file));
  const path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const target = join(dist, path);
  return url.pathname.endsWith('/') || !extname(target)
    ? join(target, 'index.html')
    : target;
}

test('writing fragment links point to articles in the homepage', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  for (const [, id] of html.matchAll(/href="#(writing-[^"]+)"/g)) {
    assert.ok(html.includes(`id="${id}"`), `missing writing article: ${id}`);
  }
});

test('Pages workflow exists and generated local URLs resolve', () => {
  assert.ok(existsSync('.github/workflows/deploy.yml'), 'Pages workflow missing');
  for (const file of htmlFiles(dist)) {
    const html = readFileSync(file, 'utf8');
    for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (value.startsWith('#')) continue;
      const url = new URL(value, pageUrl(file));
      if (url.origin !== origin) continue;
      const generated = generatedTarget(file, value);
      assert.ok(existsSync(generated), `${file}: ${value} has no generated target`);
    }
  }
});
