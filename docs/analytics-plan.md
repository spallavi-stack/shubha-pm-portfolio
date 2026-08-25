# Visitor analytics plan

Written August 2026, scoped down 25 August to the seven things worth knowing. A plan for measuring who visits the portfolio and how far in they get, given the site as it stands: static HTML on GitHub Pages, no server.

Nothing is instrumented today. GitHub's repo traffic tab is the only visitor signal available, and it counts repo views rather than site visits.

Tool: **Umami Cloud, free tier**, decided 25 August. Cookieless, so no consent banner. Funnels included at no cost.

---

## 1. What you want to know, and what measures it

| What you want to know | Event | Where it fires |
|---|---|---|
| Did somebody click the portfolio link | `page_view` plus referrer and UTM | Every page |
| Did they reach the case studies | `section_view` | `#case-studies` scrolls into view on the hub |
| How many opened a case study | `case_open` | Click on a case study card |
| How many played the intro video | `video_play` | The video starts on a case study page |
| How many went to the playground | `pm_lab_open` | The PM Lab `<details>` is expanded |
| How many clicked contact | `contact_click` | Any link to the contact page or a mailto |
| How many downloaded the CV | `cv_download` | Click on the CV PDF link |

Seven questions, seven events. Everything else is out.

Each event carries `project` (`flexy` or `sunnysideup`) where it makes sense, so "how many opened a case study" can be split by which one. The script derives that from the URL path, so nothing needs tagging by hand.

---

## 2. The funnel

1. Landed on the site
2. Reached the case studies section
3. Opened a case study
4. Played the intro video
5. Clicked contact or downloaded the CV

The playground sits outside this as its own count, since it is a side path off the hub rather than a step toward contact.

Steps 4 and 5 are the ones with a decision attached. If people play the video and never reach contact, the video is holding attention without converting it. If people reach contact without ever opening a case study, the hub is doing the work on its own.

**One caution on reading it.** A portfolio gets tens to low hundreds of sessions a month, so a five-step funnel puts single-digit numbers in the later steps. Read these as counts of real people rather than as conversion rates. A percentage computed on nine visitors is not a percentage.

Where this says "who," it means how many. Cookieless analytics counts visits and cannot tell you which person made them, and nothing on a static site can.

---

## 3. What gets instrumented

Four pages:

- `index.html`
- `contact.html`
- `projects/flexy/index.html`
- `projects/sunnysideup/index.html`

That is the entire job. Fund the Future's pages are unlinked, so they get the script when that case study goes live. The prototypes, the doc pages and the test harnesses are all left alone.

**How.** One file, `assets/js/analytics.js`, loaded with `defer` from those four pages. It derives the project from the URL, exposes a `track()` function, and wires the seven events through delegated click listeners, one IntersectionObserver for the case studies section, the `<details>` toggle for the playground, and the `play` event on the video element.

Binding the video to the element's `play` event rather than to the overlay button matters, because your pages pair a custom `data-video-play` overlay with a native `controls` video. Listening only for the overlay click would miss anyone who uses the native control.

Two things to build in on day one:

- **Self-exclusion.** Visiting any page with `?notrack=1` sets a flag in `localStorage` that suppresses events from that browser permanently. Without it your own visits are a large share of a small dataset.
- **No personal data, ever.** No names, no email addresses, no form contents.

---

## 4. The habit that matters more than the code

Your first question is whether somebody clicked the portfolio link. Referrers answer part of that, and a link sent inside a job application arrives with no referrer at all, which is exactly the highest-intent traffic you have.

Fix it by tagging the links you send yourself:

```
https://spallavi-stack.github.io/shubha-pm-portfolio/?utm_source=application&utm_campaign=acme-pm-role
```

Umami then shows those as separate sources, so you can tell that the Acme application was opened and the Beta one was not. This is a habit rather than a build step, and in the first few months it will probably tell you more than the funnel does.

---

## 5. Build sequence

| Phase | Work | Effort |
|---|---|---|
| 1 | Create the Umami account, add the site | 30 min |
| 2 | Write `assets/js/analytics.js` with the seven events, self-exclusion and the Umami adapter | 2 hrs |
| 3 | Add the script tag to the four pages, confirm each event fires | 1 hr |
| 4 | Define the funnel in Umami, add a short privacy line to `contact.html` | 30 min |
| 5 | Start tagging outbound links with UTM parameters | ongoing |

Half a day of work in total. Then leave it alone for a month before reading anything into it.

---

## 6. Deliberately not doing

Listed so these do not creep back in without a decision:

- Step-by-step tracking inside the prototypes. This reverses the full-depth choice made earlier the same day, on the basis that prototype usage is not on the list of seven.
- Scroll depth percentages, video progress quartiles, time-on-page buckets.
- Tracking of the source document pages.
- A custom dashboard. Umami's own dashboard is the dashboard.
- GA4 alongside Umami.

---

## 7. Open

1. **Custom domain.** Would improve the portfolio URL and reduce ad blocker loss, since blockers stop some share of analytics regardless of tool. Easier to do before the history starts than after. Independent of everything above.
2. **Fund the Future's video files are missing.** Its page references `assets/video-intro.mp4` and `assets/poster-intro.jpg`, and neither exists in that project's `assets/`. This costs nothing while the page is unlinked, and it needs fixing before that case study goes live.
