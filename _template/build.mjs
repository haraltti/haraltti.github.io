// Builds the static pages of every app in _apps/ (home, privacy, support in every language).
// No dependencies: `node _template/build.mjs [slug]`. The output (e.g. molkky/) is committed,
// because GitHub Pages serves the repository as it is.
//
// To add a new app: copy _apps/molkky to _apps/<slug>, edit app.json, mascot.svg and the
// content/<language>.json files, add an icon.png to <slug>/, and run this script.
// The shared look is in assets/apppages/apppages.css; a few colours can be set per app in app.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://haraltti.github.io';
const PAGES = [
  { id: 'home', path: '' },
  { id: 'privacy', path: 'privacy/' },
  { id: 'support', path: 'support/' },
];

const read = (...p) => fs.readFileSync(path.join(root, ...p), 'utf8');
const write = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};

// ---- text helpers ----

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Small markup for the content files: [text](url), [text](page:id), **bold**, {email}, {app}. Everything else is escaped. */
function inline(text, ctx) {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, label, url) =>
    `<a href="${url}" rel="noopener">${label}</a>`,
  );
  // [text](page:privacy) links to another page of the same app, in the same language
  out = out.replace(/\[([^\]]+)\]\(page:(home|privacy|support)\)/g, (_, label, id) =>
    `<a href="${pageUrl(ctx.app, ctx.code, PAGES.find((p) => p.id === id))}">${label}</a>`,
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\{email\}/g, `<a href="mailto:${ctx.app.contactEmail}">${ctx.app.contactEmail}</a>`);
  out = out.replace(/\{app\}/g, escapeHtml(ctx.app.name));
  return out;
}

const paragraphs = (list = [], ctx) => list.map((p) => `<p>${inline(p, ctx)}</p>`).join('\n      ');
const bullets = (list, ctx) =>
  list && list.length ? `<ul>\n        ${list.map((li) => `<li>${inline(li, ctx)}</li>`).join('\n        ')}\n      </ul>` : '';

// ---- URLs ----

/** The page path for a language: English (the default) at the app root, others in a folder. */
function pageUrl(app, code, page) {
  const base = code === app.defaultLanguage ? `/${app.slug}/` : `/${app.slug}/${code}/`;
  return base + page.path;
}

// ---- page pieces ----

function head(ctx, page, meta) {
  const { app, lang, code } = ctx;
  const canonical = SITE + pageUrl(app, code, page);
  const alternates = app.languages
    .map((c) => `<link rel="alternate" hreflang="${ctx.langs[c].htmlLang}" href="${SITE + pageUrl(app, c, page)}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${SITE + pageUrl(app, app.defaultLanguage, page)}">`)
    .join('\n  ');
  const t = app.theme ?? {};
  const vars = [
    ['--primary', t.primary], ['--soft', t.soft], ['--nalle-shirt', t.primary],
  ].filter(([, v]) => v);
  const varsDark = [
    ['--primary', t.primaryDark], ['--soft', t.softDark], ['--nalle-shirt', t.primaryDark],
  ].filter(([, v]) => v);
  const style = vars.length
    ? `<style>:root{${vars.map(([k, v]) => `${k}:${v}`).join(';')}}` +
      (varsDark.length ? `@media (prefers-color-scheme:dark){:root{${varsDark.map(([k, v]) => `${k}:${v}`).join(';')}}}` : '') +
      '</style>'
    : '';
  const image = `${SITE}/${app.slug}/${app.icon}`;
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <link rel="canonical" href="${canonical}">
  ${alternates}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(app.name)}">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary">
  <meta name="theme-color" content="${app.theme?.primary ?? '#1F4E79'}">
  <link rel="icon" type="image/png" href="/${app.slug}/${app.icon}">
  <link rel="apple-touch-icon" href="/${app.slug}/${app.appleIcon}">
  <link rel="preload" href="/assets/apppages/fonts/Barlow_500Medium.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/assets/apppages/apppages.css">
  ${style}
  <script src="/assets/apppages/lang.js"></script>`;
}

function header(ctx, page) {
  const { app, lang, code, langs } = ctx;
  const ui = lang.ui;
  const switcher = app.languages
    .map((c) => {
      const current = c === code ? ' aria-current="true"' : '';
      return `<a href="${pageUrl(app, c, page)}" hreflang="${langs[c].htmlLang}" lang="${langs[c].htmlLang}" data-set-lang="${c}"${current}>${escapeHtml(langs[c].label)}</a>`;
    })
    .join('\n        ');
  const nav = PAGES.map((p) => {
    const label = { home: ui.navHome, privacy: ui.navPrivacy, support: ui.navSupport }[p.id];
    const current = p.id === page.id ? ' aria-current="page"' : '';
    return `<a href="${pageUrl(app, code, p)}"${current}>${escapeHtml(label)}</a>`;
  }).join('\n        ');
  return `<header class="site-header">
    <div class="wrap">
      <a class="brand" href="${pageUrl(app, code, PAGES[0])}"><img src="/${app.slug}/${app.icon}" alt="" width="44" height="44"><span>${escapeHtml(app.name)}</span></a>
      <nav class="lang" aria-label="${escapeHtml(ui.languageLabel)}">
        ${switcher}
      </nav>
    </div>
    <div class="wrap">
      <nav class="nav" aria-label="${escapeHtml(app.name)}">
        ${nav}
      </nav>
    </div>
  </header>`;
}

function footer(ctx) {
  const { app, lang, code } = ctx;
  const ui = lang.ui;
  const links = PAGES.map((p) => {
    const label = { home: ui.navHome, privacy: ui.navPrivacy, support: ui.navSupport }[p.id];
    return `<a href="${pageUrl(app, code, p)}">${escapeHtml(label)}</a>`;
  }).join('\n      ');
  return `<footer class="site-footer">
    <div class="wrap">
      <nav aria-label="${escapeHtml(ui.footerNav)}">
      ${links}
      </nav>
      <p>${escapeHtml(ui.contact)}${lang.htmlLang.startsWith('fr') ? ' ' : ''}: <a href="mailto:${app.contactEmail}">${app.contactEmail}</a></p>
      <p>© ${app.copyrightYear} ${escapeHtml(app.developer)}</p>
      <p class="trademark">${escapeHtml(app.trademarkNote)}</p>
    </div>
  </footer>`;
}

function badge(kind, ui, svg) {
  const name = kind === 'apple' ? ui.appStore : ui.googlePlay;
  const small = kind === 'apple' ? ui.downloadOn : ui.getItOn;
  return `<span class="badge" role="img" aria-label="${escapeHtml(name)} – ${escapeHtml(ui.comingSoon)}">
          ${svg.trim()}
          <span><span class="small">${escapeHtml(small)}</span><span class="big">${escapeHtml(name)}</span></span>
          <span class="soon">${escapeHtml(ui.comingSoon)}</span>
        </span>`;
}

function homeMain(ctx) {
  const { app, lang, mascot } = ctx;
  const h = lang.home;
  const apple = fs.readFileSync(path.join(root, '_template', 'badge-apple.svg'), 'utf8');
  const google = fs.readFileSync(path.join(root, '_template', 'badge-google.svg'), 'utf8');
  const stores = [];
  stores.push(app.stores?.ios ? `<a class="badge" href="${app.stores.ios}">${apple}</a>` : badge('apple', lang.ui, apple));
  stores.push(app.stores?.android ? `<a class="badge" href="${app.stores.android}">${google}</a>` : badge('google', lang.ui, google));
  return `<div class="wrap">
      <section class="hero">
        <div>
          <h1>${escapeHtml(h.heading)}</h1>
          <p class="tagline">${inline(h.tagline, ctx)}</p>
          ${paragraphs(h.intro, ctx)}
          <div class="badges">
        ${stores.join('\n        ')}
          </div>
          <p class="stores-note">${inline(h.storesNote, ctx)}</p>
        </div>
        <div class="mascot">${mascot}</div>
      </section>
      <section aria-labelledby="features">
        <h2 id="features">${escapeHtml(h.featuresTitle)}</h2>
        <ul class="features">
          ${h.features.map((f) => `<li><h3>${escapeHtml(f.title)}</h3><p>${inline(f.text, ctx)}</p></li>`).join('\n          ')}
        </ul>
      </section>
    </div>`;
}

function docMain(ctx, page) {
  const { lang } = ctx;
  const d = lang[page.id];
  const ui = lang.ui;
  const colon = lang.htmlLang.startsWith('fr') ? ' :' : ':';
  const meta = page.id === 'privacy' ? `<p class="meta">${escapeHtml(ui.updated)}${colon} ${escapeHtml(ui.updatedDate)}</p>` : '';
  let body = '';
  if (page.id === 'privacy') {
    body = d.sections
      .map((s) => `<section>
      <h2>${escapeHtml(s.h)}</h2>
      ${paragraphs(s.p, ctx)}
      ${bullets(s.ul, ctx)}
      ${s.after ? paragraphs(s.after, ctx) : ''}
    </section>`)
      .join('\n    ');
  } else {
    body = `<section class="faq">
      ${d.faq
        .map((f) => `<details>
        <summary>${escapeHtml(f.q)}</summary>
        <div class="answer">
          ${paragraphs(f.a, ctx)}
          ${bullets(f.ul, ctx)}
        </div>
      </details>`)
        .join('\n      ')}
    </section>
    <section>
      <h2>${escapeHtml(d.contactTitle)}</h2>
      ${paragraphs(d.contactText, ctx)}
    </section>`;
  }
  return `<div class="wrap doc">
      <h1>${escapeHtml(d.heading)}</h1>
      ${meta}
      ${paragraphs(d.intro, ctx)}
      ${body}
    </div>`;
}

function renderPage(ctx, page) {
  const { app, lang, code, langs } = ctx;
  const meta = page.id === 'home'
    ? { title: lang.home.title, description: lang.home.description }
    : { title: `${lang[page.id].heading} – ${app.name}`, description: lang[page.id].description };
  const alt = Object.fromEntries(app.languages.map((c) => [c, pageUrl(app, c, page)]));
  const isDefault = code === app.defaultLanguage;
  return `<!doctype html>
<html lang="${lang.htmlLang}" data-lang="${code}" data-default="${isDefault}" data-alt='${JSON.stringify(alt)}'>
<head>
  ${head(ctx, page, meta)}
</head>
<body>
  <a class="skip" href="#main">${escapeHtml(lang.ui.skip)}</a>
  ${header(ctx, page)}
  <main id="main" tabindex="-1">
    ${page.id === 'home' ? homeMain(ctx) : docMain(ctx, page)}
  </main>
  ${footer(ctx)}
</body>
</html>
`;
}

// ---- build ----

/** French typography: a no-break space before ! ? : ; % and » and after «, so they never start a line. */
function frenchTypography(value) {
  if (typeof value === 'string') {
    return value.replace(/ ([!?:;%»])/g, ' $1').replace(/« /g, '« ');
  }
  if (Array.isArray(value)) return value.map(frenchTypography);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, frenchTypography(v)]));
  }
  return value;
}

function loadLanguage(slug, code) {
  const content = JSON.parse(read('_apps', slug, 'content', `${code}.json`));
  return content.htmlLang.startsWith('fr') ? frenchTypography(content) : content;
}

function buildApp(slug) {
  const app = JSON.parse(read('_apps', slug, 'app.json'));
  const langs = Object.fromEntries(app.languages.map((c) => [c, loadLanguage(slug, c)]));
  const mascotSource = app.mascot ? read('_apps', slug, app.mascot) : '';
  let count = 0;
  for (const code of app.languages) {
    const lang = langs[code];
    const mascot = mascotSource.replace(/\{\{mascotAlt\}\}/g, escapeHtml(lang.ui.mascotAlt ?? ''));
    const ctx = { app, lang, code, langs, mascot };
    for (const page of PAGES) {
      const file = path.join(root, pageUrl(app, code, page).slice(1), 'index.html');
      write(file, renderPage(ctx, page));
      count += 1;
    }
  }
  console.log(`${slug}: ${count} pages`);
}

const wanted = process.argv[2];
const slugs = wanted
  ? [wanted]
  : fs.readdirSync(path.join(root, '_apps'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
for (const slug of slugs) buildApp(slug);
