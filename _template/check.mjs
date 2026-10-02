// Checks the generated app pages: `node _template/check.mjs`. Exits with an error if anything is off.
//  - every page exists in every language and links to its translations
//  - the trademark note, contact e-mail and required privacy topics are present
//  - all internal links and assets exist, and nothing is loaded from other websites
//  - one <h1> per page, images have alt text

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const fail = (msg) => problems.push(msg);

const apps = fs
  .readdirSync(path.join(root, '_apps'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

const PAGES = ['', 'privacy/', 'support/'];
// Words that must appear on every language's privacy page
const PRIVACY_MUST = ['AdMob', 'UMP', 'policies.google.com/privacy', '13', 'expo.dev/privacy'];

for (const slug of apps) {
  const app = JSON.parse(fs.readFileSync(path.join(root, '_apps', slug, 'app.json'), 'utf8'));
  for (const code of app.languages) {
    for (const p of PAGES) {
      const rel = (code === app.defaultLanguage ? `${slug}/` : `${slug}/${code}/`) + p;
      const file = path.join(root, rel, 'index.html');
      const label = `${rel}index.html`;
      if (!fs.existsSync(file)) {
        fail(`${label}: missing`);
        continue;
      }
      const html = fs.readFileSync(file, 'utf8');

      if (!html.includes(app.trademarkNote)) fail(`${label}: trademark note missing`);
      if (!html.includes(`mailto:${app.contactEmail}`)) fail(`${label}: contact e-mail missing`);
      // (case sensitive: "todo" is an ordinary Spanish word)
      if (/\[OSOITE\]|\bTODO\b|\bFIXME\b|[Ll]orem ipsum/.test(html)) fail(`${label}: placeholder text left`);
      if ((html.match(/<h1[ >]/g) ?? []).length !== 1) fail(`${label}: needs exactly one <h1>`);
      if (!/<html lang="[^"]+"/.test(html)) fail(`${label}: no lang attribute`);
      if (!html.includes('rel="canonical"')) fail(`${label}: no canonical link`);
      for (const c of app.languages) {
        const tag = JSON.parse(fs.readFileSync(path.join(root, '_apps', slug, 'content', `${c}.json`), 'utf8')).htmlLang;
        if (!html.includes(`hreflang="${tag}"`)) fail(`${label}: no hreflang for ${c}`);
      }
      if (!html.includes('hreflang="x-default"')) fail(`${label}: no x-default alternate`);
      for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
        if (!/\salt="/.test(img)) fail(`${label}: image without alt: ${img.slice(0, 60)}`);
      }

      // Internal links and assets must exist; nothing may be loaded from other sites
      for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
        const url = m[1];
        if (url.startsWith('mailto:') || url.startsWith('#')) continue;
        if (/^https?:\/\//.test(url)) {
          const tag = html.slice(Math.max(0, m.index - 60), m.index);
          if (/<(script|link rel="stylesheet"|img|iframe|link rel="preload")[^>]*$/.test(tag)) {
            fail(`${label}: loads from another site: ${url}`);
          }
          continue;
        }
        if (url.startsWith('/')) {
          const target = path.join(root, url.split('#')[0]);
          const ok = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
          if (!ok) fail(`${label}: broken link ${url}`);
        }
      }

      if (p === 'privacy/') {
        for (const word of PRIVACY_MUST) if (!html.includes(word)) fail(`${label}: privacy page lacks "${word}"`);
      }
    }
  }
  // Source and output agree on the languages
  for (const c of app.languages) {
    if (!fs.existsSync(path.join(root, '_apps', slug, 'content', `${c}.json`))) fail(`${slug}: content/${c}.json missing`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`OK: ${apps.join(', ')} – all pages, languages, links and required texts check out.`);
