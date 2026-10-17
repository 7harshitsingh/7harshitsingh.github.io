import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

test('home is a static root site with canonical metadata', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.match(html, /<title>Harshit Singh \(7harshitsingh\) - Applied AI Engineer<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/7harshitsingh\.github\.io\//);
  assert.match(html, /<main id="main"/);
  assert.doesNotMatch(html, /Astro Basics|To get started/);
  assert.equal(existsSync('dist/404.html'), false);
});

test('homepage metadata identifies Harshit and his work', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.equal(existsSync('dist/pfp.jpg'), false, 'the unused full portrait should not be published');
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
  for (const term of ['Harshit Singh', '7harshitsingh', 'IIT Delhi', 'IITD', 'applied AI engineer', 'L&amp;T Finance', 'machine learning', 'software engineer']) {
    assert.match(description, new RegExp(term, 'i'));
  }
  assert.match(html, /<meta property="og:type" content="profile"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/7harshitsingh\.github\.io\/avatar\.jpg"/);
  assert.match(html, /<meta name="twitter:card" content="summary"/);
  const jsonLd = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
  assert.ok(jsonLd, 'profile structured data is present');
  const profile = JSON.parse(jsonLd);
  assert.equal(profile['@type'], 'ProfilePage');
  assert.equal(profile.mainEntity.name, 'Harshit Singh');
  assert.equal(profile.mainEntity.alternateName, '7harshitsingh');
  assert.equal(profile.mainEntity.image, 'https://7harshitsingh.github.io/avatar.jpg');
  assert.ok(profile.mainEntity.sameAs.includes('https://github.com/7harshitsingh'));
});

test('critical styles and icons are inline while the avatar is responsive', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  assert.doesNotMatch(html, /<link rel="stylesheet"/);
  assert.match(html, /<style>/);
  assert.doesNotMatch(html, /\/icons\/mark-github\.svg/);
  assert.match(html, /<link rel="icon" type="image\/jpeg" href="\/avatar\.jpg"/);
  assert.match(html, /<link rel="icon" type="image\/webp" href="\/avatar\.webp"/);
  assert.match(html, /<source type="image\/webp" srcset="\/avatar\.webp 1x, \/avatar@2x\.webp 2x"/);
  assert.match(html, /<img src="\/avatar\.jpg"/);
  assert.equal(existsSync('dist/icons/mark-github.svg'), false);
  assert.ok(statSync('dist/avatar.webp').size < 3_000);
  assert.ok(statSync('dist/avatar@2x.webp').size < 6_000);
  assert.ok(statSync('dist/avatar.jpg').size < 30_000);
});
