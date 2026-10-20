// Writes the front page of the site in every language: index.html (English, the address
// PumpSniper's store pages link to) and fi/, fr/, es-MX/. Every app is a card. Run after a change
// to the texts or the store links below:
//
//   node _template/hub.mjs
//
// Fonts and colours come from the shared app page stylesheet; nothing is loaded from other sites.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://haraltti.github.io';
const EMAIL = 'haraltti.apps@gmail.com';

/** Store links of each app; null while the app is not in that store. */
const STORES = {
  pumpsniper: {
    ios: 'https://apps.apple.com/app/id6763744786',
    android: 'https://play.google.com/store/apps/details?id=com.haraltti.pumpsniper',
  },
  molkkygame: { ios: null, android: null },
  molkky: { ios: null, android: 'https://play.google.com/store/apps/details?id=com.haraltti.fifty' },
};

const LANGS = [
  { code: 'en', name: 'English', dir: '' },
  { code: 'fi', name: 'Suomi', dir: 'fi/' },
  { code: 'fr', name: 'Français', dir: 'fr/' },
  { code: 'es-MX', name: 'Español', dir: 'es-MX/' },
];

const T = {
  en: {
    title: 'Haraltti Apps – PumpSniper and Fifty',
    description:
      'Free mobile apps made in Finland: PumpSniper tracks new Solana tokens in real time, Fifty keeps the score in Mölkky and Fifty – Mölkky Game brings a new throwing puzzle every day.',
    tagline: 'Small, free apps made in Finland.',
    language: 'Language',
    pumpsniper: { text: 'Track new Solana tokens in real time.', about: 'About PumpSniper', icon: 'PumpSniper app icon' },
    game: {
      name: 'Fifty – Mölkky Game',
      text: 'A Mölkky throwing game with a new puzzle every day: land on exactly 50 in as few throws as you can.',
      play: 'Play in your browser',
      about: 'About the game',
      icon: 'Fifty – Mölkky Game app icon',
    },
    counter: {
      name: 'Fifty – Mölkky Score Keeper',
      text: 'Playing real Mölkky in the yard? Tap the fallen pins and the app keeps the score and follows the rules.',
      about: 'About the score keeper',
      icon: 'Fifty – Mölkky Score Keeper app icon',
    },
    soonBoth: 'Coming soon to the App Store and Google Play.',
    soonIos: 'Coming soon to the App Store.',
    soonAndroid: 'Coming soon to Google Play.',
    madeBy: 'Haraltti Apps is made by Harri Heikkilä in Finland.',
    contact: 'Contact',
  },
  fi: {
    title: 'Haraltti Apps – PumpSniper ja Fifty',
    description:
      'Ilmaisia mobiilisovelluksia Suomesta: PumpSniper seuraa uusia Solana-tokeneita reaaliajassa, Fifty laskee mölkyn pisteet ja Fifty – Mölkkypeli tuo joka päivä uuden heittopulman.',
    tagline: 'Pieniä, ilmaisia sovelluksia Suomesta.',
    language: 'Kieli',
    pumpsniper: { text: 'Seuraa uusia Solana-tokeneita reaaliajassa.', about: 'Lisää PumpSniperista', icon: 'PumpSniperin kuvake' },
    game: {
      name: 'Fifty – Mölkkypeli',
      text: 'Mölkkyyn perustuva heittopeli, jossa on joka päivä uusi pulma: osu tasan 50 pisteeseen mahdollisimman harvalla heitolla.',
      play: 'Pelaa selaimessa',
      about: 'Lisää pelistä',
      icon: 'Fifty – Mölkkypelin kuvake',
    },
    counter: {
      name: 'Fifty – Mölkky-pistelaskuri',
      text: 'Pelaatko oikeaa mölkkyä pihalla? Napauta kaatuneet keilat, ja appi laskee pisteet ja hoitaa säännöt.',
      about: 'Lisää pistelaskurista',
      icon: 'Fifty – Mölkky-pistelaskurin kuvake',
    },
    soonBoth: 'Tulossa pian App Storeen ja Google Playhin.',
    soonIos: 'Tulossa pian App Storeen.',
    soonAndroid: 'Tulossa pian Google Playhin.',
    madeBy: 'Haraltti Appsin tekee Harri Heikkilä Suomessa.',
    contact: 'Yhteystiedot',
  },
  fr: {
    title: 'Haraltti Apps – PumpSniper et Fifty',
    description:
      'Des applis mobiles gratuites faites en Finlande : PumpSniper suit les nouveaux tokens Solana en temps réel, Fifty compte les points au mölkky et Fifty – Mölkky jeu propose un nouveau défi de lancer chaque jour.',
    tagline: 'De petites applis gratuites, faites en Finlande.',
    language: 'Langue',
    pumpsniper: { text: 'Suis les nouveaux tokens Solana en temps réel (appli en anglais et en finnois).', about: 'En savoir plus sur PumpSniper', icon: 'Icône de PumpSniper' },
    game: {
      name: 'Fifty – Mölkky jeu',
      text: 'Un jeu de lancer basé sur le mölkky, avec un nouveau défi chaque jour : atteins 50 pile en aussi peu de lancers que possible.',
      play: 'Jouer dans le navigateur',
      about: 'En savoir plus sur le jeu',
      icon: 'Icône de Fifty – Mölkky jeu',
    },
    counter: {
      name: 'Fifty – Mölkky compteur',
      text: 'Tu joues au vrai mölkky dehors ? Touche les quilles tombées : l’appli compte les points et applique les règles.',
      about: 'En savoir plus sur le compteur',
      icon: 'Icône de Fifty – Mölkky compteur',
    },
    soonBoth: 'Bientôt sur l’App Store et Google Play.',
    soonIos: 'Bientôt sur l’App Store.',
    soonAndroid: 'Bientôt sur Google Play.',
    madeBy: 'Haraltti Apps est créé par Harri Heikkilä, en Finlande.',
    contact: 'Contact',
  },
  'es-MX': {
    title: 'Haraltti Apps – PumpSniper y Fifty',
    description:
      'Apps móviles gratis hechas en Finlandia: PumpSniper sigue los nuevos tokens de Solana en tiempo real, Fifty lleva los puntos del mölkky y Fifty – Mölkky juego trae un nuevo reto de tiro cada día.',
    tagline: 'Apps pequeñas y gratis, hechas en Finlandia.',
    language: 'Idioma',
    pumpsniper: { text: 'Sigue los nuevos tokens de Solana en tiempo real (app en inglés y finlandés).', about: 'Más sobre PumpSniper', icon: 'Ícono de PumpSniper' },
    game: {
      name: 'Fifty – Mölkky juego',
      text: 'Un juego de tiro basado en el mölkky, con un reto nuevo cada día: llega a 50 exactos en la menor cantidad de tiros.',
      play: 'Jugar en el navegador',
      about: 'Más sobre el juego',
      icon: 'Ícono de Fifty – Mölkky juego',
    },
    counter: {
      name: 'Fifty – Mölkky marcador',
      text: '¿Juegas mölkky de verdad en el jardín? Toca los bolos caídos y la app lleva los puntos y aplica las reglas.',
      about: 'Más sobre el marcador',
      icon: 'Ícono de Fifty – Mölkky marcador',
    },
    soonBoth: 'Pronto en la App Store y en Google Play.',
    soonIos: 'Pronto en la App Store.',
    soonAndroid: 'Pronto en Google Play.',
    madeBy: 'Haraltti Apps lo hace Harri Heikkilä en Finlandia.',
    contact: 'Contacto',
  },
};

const APPLE_SVG =
  '<svg viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 8 184.8 8 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37.3 59 128.8 107.2 127.3 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-84 102.6-121.4-65.2-30.7-65.7-90-65.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';
const PLAY_SVG =
  '<svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M325.3 234.3L104.6 13.6c-5-3.9-11.9-4.7-17.6-1.6-5.7 3.1-9 9.3-8.4 15.7v456.6c-.6 6.4 2.7 12.6 8.4 15.7 5.7 3.1 12.6 2.3 17.6-1.6l220.7-220.7c8.6-8.6 8.6-22.7 0-31.4zm42.7-14.9l-49.8-28.7-56.4 56.3 56.4 56.3 49.9-28.8c16-10.4 16-33.7-.1-55.1z"/></svg>';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function storeButtons(stores) {
  const out = [];
  if (stores.ios) out.push(`<a class="btn primary" href="${stores.ios}">\n            ${APPLE_SVG}\n            App Store\n          </a>`);
  if (stores.android) out.push(`<a class="btn primary" href="${stores.android}">\n            ${PLAY_SVG}\n            Google Play\n          </a>`);
  return out;
}

function soonLine(t, stores) {
  if (!stores.ios && !stores.android) return `\n        <p class="soon">${esc(t.soonBoth)}</p>`;
  if (!stores.ios) return `\n        <p class="soon">${esc(t.soonIos)}</p>`;
  if (!stores.android) return `\n        <p class="soon">${esc(t.soonAndroid)}</p>`;
  return '';
}

function card({ slug, icon, name, href, text, actions, soon }) {
  return `      <li class="app">
        <div class="app-top">
          <img src="/assets/hub/${slug}-128.png" alt="${esc(icon)}" width="64" height="64">
          <h2><a href="${href}">${esc(name)}</a></h2>
        </div>
        <p>${esc(text)}</p>
        <div class="actions">
          ${actions.join('\n          ')}
        </div>${soon}
      </li>`;
}

function page(lang) {
  const t = T[lang.code];
  const appDir = lang.dir; // the app pages use the same language folders
  const playLink = lang.code === 'en' ? '/molkkygame/play/?lang=en' : `/molkkygame/play/${lang.code}/`;
  const url = `${SITE}/${lang.dir}`;
  const alternates = LANGS.map((l) => `  <link rel="alternate" hreflang="${l.code}" href="${SITE}/${l.dir}">`)
    .concat(`  <link rel="alternate" hreflang="x-default" href="${SITE}/">`)
    .join('\n');
  const langNav = LANGS.map(
    (l) =>
      `<a href="/${l.dir}" hreflang="${l.code}" lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${l.name}</a>`,
  ).join('\n        ');

  const cards = [
    card({
      slug: 'pumpsniper',
      icon: t.pumpsniper.icon,
      name: 'PumpSniper',
      href: '/pumpsniper/',
      text: t.pumpsniper.text,
      actions: [...storeButtons(STORES.pumpsniper), `<a class="btn" href="/pumpsniper/">${esc(t.pumpsniper.about)}</a>`],
      soon: soonLine(t, STORES.pumpsniper),
    }),
    card({
      slug: 'molkkygame',
      icon: t.game.icon,
      name: t.game.name,
      href: `/molkkygame/${appDir}`,
      text: t.game.text,
      actions: [
        `<a class="btn primary" href="${playLink}">${esc(t.game.play)}</a>`,
        ...storeButtons(STORES.molkkygame),
        `<a class="btn" href="/molkkygame/${appDir}">${esc(t.game.about)}</a>`,
      ],
      soon: soonLine(t, STORES.molkkygame),
    }),
    card({
      slug: 'molkky',
      icon: t.counter.icon,
      name: t.counter.name,
      href: `/molkky/${appDir}`,
      text: t.counter.text,
      actions: [...storeButtons(STORES.molkky), `<a class="btn" href="/molkky/${appDir}">${esc(t.counter.about)}</a>`],
      soon: soonLine(t, STORES.molkky),
    }),
  ];

  // Search Console verifies the site with this tag on the root page; it must stay there.
  const verification =
    lang.code === 'en' ? '\n  <meta name="google-site-verification" content="BDCVcfU_uOb8fAYA-yDwdvN5z1jc4ykCGvjeMhq8YuM">' : '';

  return `<!doctype html>
<html lang="${lang.code}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(t.title)}</title>
  <meta name="description" content="${esc(t.description)}">${verification}
  <link rel="canonical" href="${url}">
${alternates}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Haraltti Apps">
  <meta property="og:title" content="Haraltti Apps">
  <meta property="og:description" content="${esc(t.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/molkkygame/play/og-image${lang.code === 'en' ? '' : '-' + lang.code}.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="/molkkygame/icon.png">
  <!-- The fonts are fetched with the stylesheet, so the text does not reflow when they arrive. -->
  <link rel="preload" href="/assets/apppages/fonts/Barlow_500Medium.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/assets/apppages/fonts/Barlow_700Bold.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/assets/apppages/fonts/BarlowCondensed_800ExtraBold.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/assets/apppages/apppages.css">
  <!-- Made by _template/hub.mjs: edit the texts there, not here. PumpSniper comes first, because
       its store pages link to this address. -->
  <style>
    .hub { width: 100%; max-width: 980px; margin: 0 auto; padding: 28px 16px 32px; flex: 1; }
    .hub-head .lang { margin-bottom: 22px; }
    .hub-head h1 { font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 800;
      font-size: clamp(44px, 9vw, 64px); line-height: 1; margin: 0; color: var(--primary); }
    .hub-head p { margin: 10px 0 0; color: var(--muted); font-size: 19px; max-width: 34em; }
    .apps { list-style: none; margin: 32px 0 0; padding: 0; display: grid; gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .app { background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
      padding: 20px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .app-top { display: flex; gap: 14px; align-items: center; }
    .app-top img { width: 64px; height: 64px; border-radius: 15px; flex: none; }
    .app h2 { margin: 0; font-size: 22px; line-height: 1.2; text-wrap: balance; }
    .app h2 a { color: var(--ink); text-decoration: none; }
    .app h2 a:hover { text-decoration: underline; }
    .app p { margin: 0; color: var(--muted); }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
    .btn { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 8px 16px;
      border-radius: 12px; font-weight: 700; font-size: 16px; text-decoration: none;
      border: 2px solid var(--border); color: var(--ink); background: var(--surface); }
    .btn.primary { background: var(--primary); border-color: var(--primary); color: var(--on-primary); }
    .btn svg { width: 18px; height: 18px; flex: none; }
    .btn:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
    .soon { font-size: 15px; color: var(--muted); }
    .hub-foot { border-top: 1px solid var(--border); padding: 20px 16px 28px; text-align: center;
      color: var(--muted); font-size: 15px; }
    .hub-foot p { margin: 4px 0; }
  </style>
</head>
<body>
  <main class="hub">
    <header class="hub-head">
      <nav class="lang" aria-label="${esc(t.language)}">
        ${langNav}
      </nav>
      <h1>Haraltti Apps</h1>
      <p>${esc(t.tagline)}</p>
    </header>

    <ul class="apps">
${cards.join('\n\n')}
    </ul>
  </main>

  <footer class="hub-foot">
    <p>${esc(t.madeBy)}</p>
    <p>${esc(t.contact)}: <a href="mailto:${EMAIL}">${EMAIL}</a></p>
  </footer>
</body>
</html>
`;
}

for (const lang of LANGS) {
  const dir = path.join(root, lang.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(lang));
}
console.log(`Front page: ${LANGS.length} languages`);
