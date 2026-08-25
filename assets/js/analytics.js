/*
 * Portfolio visitor analytics.
 *
 * Sends seven events to Umami. See docs/analytics-plan.md for why these seven
 * and nothing else.
 *
 *   pageview            automatic, includes referrer and any UTM parameters
 *   case-studies-reached  the case studies section scrolled into view
 *   case-study-open     a case study card was clicked
 *   video-play          a case study intro video started
 *   playground-open     the PM Lab section was expanded
 *   contact-click       a contact link was clicked (page, email or linkedin)
 *   cv-download         the CV was opened
 *
 * No personal data is ever sent. Event properties carry a project slug and a
 * channel name, nothing else.
 *
 * To disable tracking in your own browser, visit any page with ?notrack=1
 * once. Use ?notrack=0 to turn it back on.
 */
(function () {
  'use strict';

  // Website ID from the Umami dashboard. Emptying this makes the script
  // dormant, which is the quickest way to switch tracking off entirely.
  var WEBSITE_ID = '9f3c4bb5-e3da-4e35-a81f-d9fa7c41eab1';
  var UMAMI_SRC = 'https://cloud.umami.is/script.js';

  var STORAGE_KEY = 'portfolio-notrack';

  /* ---------- self-exclusion ---------- */

  function readFlag(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null; // private mode, or storage disabled
    }
  }

  function writeFlag(key, value) {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch (e) {
      /* nothing we can do, and nothing that should break the page */
    }
  }

  function isExcluded() {
    var param = new URLSearchParams(window.location.search).get('notrack');
    if (param === '1') writeFlag(STORAGE_KEY, '1');
    if (param === '0') writeFlag(STORAGE_KEY, null);
    return readFlag(STORAGE_KEY) === '1';
  }

  if (!WEBSITE_ID || isExcluded()) return;

  /* ---------- page context, derived from the URL ---------- */

  var path = window.location.pathname;

  function currentProject() {
    var match = path.match(/\/projects\/([^/]+)\//);
    return match ? match[1] : null;
  }

  var project = currentProject();

  /* ---------- sending ---------- */

  var queue = [];

  function flush() {
    if (!window.umami) return;
    while (queue.length) {
      var item = queue.shift();
      window.umami.track(item.name, item.data);
    }
  }

  function track(name, data) {
    var payload = {};
    if (project) payload.project = project;
    if (data) {
      Object.keys(data).forEach(function (key) {
        payload[key] = data[key];
      });
    }
    queue.push({ name: name, data: payload });
    flush();
  }

  // Load Umami, then drain anything that fired before it was ready.
  var loader = document.createElement('script');
  loader.defer = true;
  loader.src = UMAMI_SRC;
  loader.setAttribute('data-website-id', WEBSITE_ID);
  loader.addEventListener('load', flush);
  document.head.appendChild(loader);

  /* ---------- 1. reached the case studies ---------- */

  var caseStudies = document.getElementById('case-studies');
  if (caseStudies && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // once per page load
        track('case-studies-reached');
      });
    }, { threshold: 0.3 });
    observer.observe(caseStudies);
  }

  /* ---------- 2. opened a case study, 3. contact, 4. CV ---------- */

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';

    if (link.matches('a.case-card-v2')) {
      var opened = href.match(/projects\/([^/]+)\//);
      track('case-study-open', { project: opened ? opened[1] : 'unknown' });
      return;
    }

    if (href.indexOf('shubha-cv-v2.pdf') !== -1) {
      track('cv-download');
      return;
    }

    if (href.indexOf('mailto:') === 0) {
      track('contact-click', { channel: 'email' });
      return;
    }

    if (href.indexOf('linkedin.com') !== -1) {
      track('contact-click', { channel: 'linkedin' });
      return;
    }

    if (/(^|\/)contact\.html(\?|#|$)/.test(href)) {
      track('contact-click', { channel: 'page' });
    }
  });

  /* ---------- 5. opened the playground ---------- */

  var pmLab = document.getElementById('pm-lab-details');
  if (pmLab) {
    var labCounted = false;
    // Fires for the nav link too, which sets .open directly.
    pmLab.addEventListener('toggle', function () {
      if (!pmLab.open || labCounted) return;
      labCounted = true;
      track('playground-open');
    });
  }

  /* ---------- 6. played the intro video ---------- */

  // Bound to the media element rather than the overlay button, so a visitor
  // using the video's own controls is counted too. Once per page load, so a
  // pause and resume is not counted twice.
  Array.prototype.forEach.call(
    document.querySelectorAll('video.proto-video'),
    function (video) {
      var counted = false;
      video.addEventListener('play', function () {
        if (counted) return;
        counted = true;
        track('video-play');
      });
    }
  );
})();
