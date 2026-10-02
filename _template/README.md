# App pages

Static pages (home, privacy policy, support) for each app, in several languages. No build
tools needed except Node. The generated pages are committed, because GitHub Pages serves
the repository as it is.

```
_apps/<slug>/app.json            name, developer, contact e-mail, languages, store links, colours
_apps/<slug>/mascot.svg          optional picture for the home page (use {{mascotAlt}} as the <title>)
_apps/<slug>/content/<lang>.json all the texts of the three pages in that language
_template/build.mjs              generator
_template/check.mjs              checks the generated pages
assets/apppages/                 shared stylesheet, language script and self-hosted fonts
<slug>/                          generated pages (English at the root, other languages in folders)
```

## Build and check

```
node _template/build.mjs          # all apps (or: node _template/build.mjs <slug>)
node _template/check.mjs
```

## Adding a new app

1. Copy `_apps/molkky` to `_apps/<slug>`.
2. Edit `app.json` (name, `slug`, colours, languages, store links), the `content/*.json` files and `mascot.svg`.
3. Put `icon.png` (512 px) and `apple-touch-icon.png` (180 px) into `<slug>/`.
4. Run the build and the check, commit, push.

The pages will be at `https://haraltti.github.io/<slug>/`, `…/privacy/` and `…/support/`
(`/<lang>/` for the other languages), which are the URLs to give to the App Store and Google Play.

## Content files

Texts may use `[text](https://…)` for links, `[text](page:privacy)` for another page of the
same app, `**bold**`, `{email}` and `{app}`. Everything else is escaped. French texts get no-break
spaces before `! ? : ; %` automatically.

## Languages

Every language has its own page. On the English (default) page the saved choice wins, otherwise
the browser's language decides (`assets/apppages/lang.js`); the language links in the header
save the choice. Pages in other languages never redirect.

## Privacy

Fonts are served from this site, and no page loads anything from another website, so visitors'
IP addresses are not sent to third parties. Keep it that way: `check.mjs` fails otherwise.
