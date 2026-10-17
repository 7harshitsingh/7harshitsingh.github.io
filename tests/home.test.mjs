import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : [];
  });
}

test('the static site generates only the homepage', () => {
  assert.deepEqual(
    htmlFiles('dist').map((path) => relative('dist', path).split(sep).join('/')),
    ['index.html'],
  );
});

test('the homepage contains a dedicated writing card', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /class="[^"]*writing-card/);
  assert.match(html, /id="writing-list"/);
  assert.match(html, /Scaling Jev Decisions at Low Latency/);
});

test('home has identity, verified link, and no empty claims', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /<title>Harshit Singh \(7harshitsingh\) - Applied AI Engineer<\/title>/);
  assert.match(html, /href="\/avatar\.jpg"/);
  assert.match(html, /src="\/avatar\.jpg"/);
  assert.match(html, /class="home-grid"/);
  for (const card of ['profile-card', 'skills-card', 'links-card', 'about-card', 'time-card', 'projects-card', 'featured-card', 'education-card', 'experience-panel', 'writing-card']) {
    assert.match(html, new RegExp(`class="[^"]*${card}`));
  }
  assert.match(html, /id="local-time"/);
  assert.match(html, /New Delhi, India/);
  assert.doesNotMatch(html, /UTC \+05:30|What I.m exploring/);
  assert.match(html, /<h1[^>]*>Harshit Singh<\/h1>/);
  assert.match(html, /https:\/\/github\.com\/7harshitsingh/);
  assert.match(html, /aria-label="GitHub"[^>]*><svg viewBox="0 0 24 24"/);
  assert.match(html, /Applied AI engineer/);
  assert.match(html, /IIT Delhi/);
  assert.match(html, /L&amp;T Finance/);
  assert.match(html, /doc-qa/);
  assert.match(html, /BM25/);
  assert.match(html, /Vectorless retrieval/);
  assert.match(html, /DevClub Summer of Code 2024/);
  assert.match(html, /class="[^"]*project-card-highlight/);
  assert.match(html, /37 stars/);
  assert.match(html, /209 forks/);
  assert.ok(html.indexOf('DevClub Summer of Code 2024') < html.indexOf('Handwritten equations to LaTeX'));
  assert.ok(html.indexOf('Handwritten equations to LaTeX') < html.indexOf('DriveSmart'));
  assert.doesNotMatch(html, /FilmFriend|FastAPI|Chainlit/);
  assert.match(html, /href="\/Harshit_Singh_IITD_LTFS_AI_Engineer\.pdf"[^>]*download/);
  assert.match(html, /Download CV/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/7harshitsingh\//);
  assert.match(html, /https:\/\/huggingface\.co\/7harshitsingh/);
  assert.doesNotMatch(html, /Astro Basics|To get started|example project/i);
});
