// Writes sitemap.xml and robots.txt for the whole site: the front page, every app's pages in every
// language (from _apps/*/app.json), the web game and its language pages, and the pages of other
// repositories that live under this address. Run after the build:
//
//   node _template/sitemap.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://haraltti.github.io';
const PAGES = ['', 'privacy/', 'support/'];

const urls = [`${SITE}/`, `${SITE}/pumpsniper/`, `${SITE}/pumpsniper-privacy/`, `${SITE}/pumpsniper-support/`];

for (const slug of fs.readdirSync(path.join(root, '_apps'))) {
  const app = JSON.parse(fs.readFileSync(path.join(root, '_apps', slug, 'app.json'), 'utf8'));
  for (const code of app.languages) {
    const base = code === app.defaultLanguage ? `${SITE}/${slug}/` : `${SITE}/${slug}/${code}/`;
    for (const p of PAGES) urls.push(base + p);
  }
}

// The web game: its own page and the language pages that shared results link to.
const play = path.join(root, 'molkkygame', 'play');
if (fs.existsSync(path.join(play, 'index.html'))) {
  urls.push(`${SITE}/molkkygame/play/`);
  for (const e of fs.readdirSync(play, { withFileTypes: true })) {
    if (e.isDirectory() && fs.existsSync(path.join(play, e.name, 'index.html')) && !e.name.startsWith('_') && e.name !== 'assets') {
      urls.push(`${SITE}/molkkygame/play/${e.name}/`);
    }
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`sitemap.xml: ${urls.length} pages`);
