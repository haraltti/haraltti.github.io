/* Language choice for app pages.
   - Every language has its own static page (good for search engines and works without JavaScript).
   - On the default (English) page: the saved choice wins; with no saved choice the browser's
     language decides, if the app has a translation. Pages in other languages never redirect.
   - Clicking a language in the header saves the choice. */
(function () {
  var KEY = 'apppages.lang';
  var root = document.documentElement;
  var current = root.getAttribute('data-lang');
  var isDefault = root.getAttribute('data-default') === 'true';
  var alt = {};
  try { alt = JSON.parse(root.getAttribute('data-alt') || '{}'); } catch (e) { alt = {}; }

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(code) {
    try { localStorage.setItem(KEY, code); } catch (e) { /* private mode: nothing to remember */ }
  }
  function fromBrowser() {
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var tag = String(list[i] || '').toLowerCase();
      var base = tag.split('-')[0];
      if (base === 'es' && alt['es-MX']) return 'es-MX';
      if (alt[base]) return base;
    }
    return null;
  }

  if (isDefault) {
    var wanted = stored() || fromBrowser();
    if (wanted && wanted !== current && alt[wanted]) {
      location.replace(alt[wanted] + location.hash);
      return;
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[data-set-lang]');
    if (link) save(link.getAttribute('data-set-lang'));
  });
})();
