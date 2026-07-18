import markdown, os, re

SRC_DIR = "/sessions/peaceful-kind-fermat/mnt/outputs"

DOCS = [
    ("flexy-product-brief.md", "flexy-product-brief.html", "Product Brief"),
    ("flexy-personas.md", "flexy-personas.html", "Personas"),
    ("flexy-synthetic-interviews.md", "flexy-synthetic-interviews.html", "Synthetic Interviews"),
    ("flexy-jobs-to-be-done.md", "flexy-jobs-to-be-done.html", "Jobs to Be Done"),
    ("flexy-roadmap.md", "flexy-roadmap.html", "Roadmap"),
    ("flexy-user-stories.md", "flexy-user-stories.html", "User Stories & Use Cases"),
    ("flexy-technical-feasibility.md", "flexy-technical-feasibility.html", "Technical Feasibility & Architecture"),
    ("flexy-real-data-integration-guide.md", "flexy-real-data-integration-guide.html", "Real Data Integration Guide"),
    ("flexy-ai-collaboration-review.md", "flexy-ai-collaboration-review.html", "AI Collaboration Review"),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Flexy | Shubha's PM Portfolio</title>
<style>
  :root{{
    --teal:#C2790E; --teal-dark:#96600A; --navy:#1C1712;
    --ink:#201A12; --ink-soft:#5C5445; --paper:#FFFFFF; --paper-soft:#F7F4EC; --border:#E5DFD2;
  }}
  *{{box-sizing:border-box;}}
  body{{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:var(--ink);background:var(--paper);line-height:1.7;}}
  .wrap{{max-width:760px;margin:0 auto;padding:0 24px;}}
  nav{{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);}}
  nav .navwrap{{max-width:920px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:14px 24px;}}
  nav a{{color:var(--teal-dark);text-decoration:none;font-size:13.5px;font-weight:600;}}
  nav .brand{{color:var(--navy);font-weight:700;font-size:15px;}}
  nav .brand span{{color:var(--teal);}}
  article{{padding:48px 0 64px;}}
  article h1{{font-size:30px;letter-spacing:-0.01em;color:var(--navy);margin:0 0 8px;}}
  article h1 + p{{color:var(--ink-soft);font-size:14px;margin-top:0;}}
  article h2{{font-size:20px;margin:36px 0 12px;padding-bottom:8px;border-bottom:2px solid var(--teal);color:var(--navy);}}
  article h3{{font-size:16px;margin:24px 0 8px;color:var(--navy);}}
  article p{{font-size:15px;color:var(--ink);margin:0 0 14px;}}
  article ul, article ol{{padding-left:22px;margin:0 0 14px;}}
  article li{{font-size:15px;margin-bottom:6px;}}
  article strong{{color:var(--navy);}}
  article blockquote{{margin:16px 0;padding:10px 18px;border-left:3px solid var(--teal);background:var(--paper-soft);color:var(--navy);font-style:italic;}}
  article hr{{border:none;border-top:1px solid var(--border);margin:32px 0;}}
  article table{{width:100%;border-collapse:collapse;margin:16px 0;font-size:13.5px;}}
  article th, article td{{text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);}}
  article th{{font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:var(--ink-soft);}}
  article code{{background:var(--paper-soft);padding:1px 5px;border-radius:4px;font-size:13px;}}
  article svg{{max-width:100%;height:auto;display:block;margin:20px 0;border:1px solid var(--border);border-radius:12px;padding:10px;background:#fff;}}
  .doc-footer{{margin-top:40px;padding-top:20px;border-top:1px solid var(--border);font-size:13px;color:var(--ink-soft);}}
  footer{{background:var(--navy);color:#C9BBA0;padding:32px 0;text-align:center;font-size:13px;}}
  footer a{{color:#F6D9A0;}}
</style>
</head>
<body>
<nav>
  <div class="navwrap">
    <span class="brand">Flexy<span>.</span> Documentation</span>
    <div style="display:flex;gap:18px;">
      <a href="flexy-case-study.html">← Case study</a>
      <a href="index.html">Portfolio</a>
    </div>
  </div>
</nav>
<article class="wrap">
{body}
<div class="doc-footer">Part of the Flexy case study documentation set. For the short version, see the <a href="flexy-case-study.html">case study page</a>.</div>
</article>
<footer>
  <div class="wrap">Flexy is a fictional case study built for portfolio purposes. Market research is real and cited; personas, interviews, and user data are synthetic.</div>
</footer>
</body>
</html>
"""

md = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists"])

for src, out, title in DOCS:
    path = os.path.join(SRC_DIR, src)
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    html_body = md.convert(text)
    md.reset()
    html_body = re.sub(r"<p>(<svg[\s\S]*?</svg>)</p>", r"\1", html_body)
    full = TEMPLATE.format(title=title, body=html_body)
    outpath = os.path.join(SRC_DIR, out)
    with open(outpath, "w", encoding="utf-8") as f:
        f.write(full)
    print("wrote", outpath)
