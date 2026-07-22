"""Render each project's markdown docs into styled HTML pages.

Usage:
    python3 scripts/build_docs.py                 # build all known projects
    python3 scripts/build_docs.py flexy sunnysideup # build specific projects

Expects each project's markdown source at projects/<slug>/docs/*.md and
writes the rendered HTML alongside it as projects/<slug>/docs/*.html.
"""
import markdown, os, re, sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PROJECTS = {
    "flexy": {
        "title": "Flexy",
        "colors": {
            "teal": "#C2790E", "teal_dark": "#96600A", "navy": "#1C1712",
            "ink": "#201A12", "ink_soft": "#5C5445", "paper": "#FFFFFF",
            "paper_soft": "#F7F4EC", "border": "#E5DFD2",
            "footer_ink": "#C9BBA0", "footer_link": "#F6D9A0",
        },
        "footer_note": "Flexy is a fictional case study built for portfolio purposes. Market research is real and cited; personas, interviews, and user data are synthetic.",
        "docs": [
            ("product-brief.md", "product-brief.html", "Product Brief"),
            ("personas.md", "personas.html", "Personas"),
            ("synthetic-interviews.md", "synthetic-interviews.html", "Synthetic Interviews"),
            ("jobs-to-be-done.md", "jobs-to-be-done.html", "Jobs to Be Done"),
            ("roadmap.md", "roadmap.html", "Roadmap"),
            ("user-stories.md", "user-stories.html", "User Stories & Use Cases"),
            ("technical-feasibility.md", "technical-feasibility.html", "Technical Feasibility & Architecture"),
            ("real-data-integration-guide.md", "real-data-integration-guide.html", "Real Data Integration Guide"),
            ("account-connection-guide.md", "account-connection-guide.html", "Account Connection Guide"),
            ("ai-collaboration-review.md", "ai-collaboration-review.html", "AI Collaboration Review"),
        ],
    },
}

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — {project_title} | Shubha's PM Portfolio</title>
<style>
  :root{{
    --teal:{teal}; --teal-dark:{teal_dark}; --navy:{navy};
    --ink:{ink}; --ink-soft:{ink_soft}; --paper:{paper}; --paper-soft:{paper_soft}; --border:{border};
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
  footer{{background:var(--navy);color:{footer_ink};padding:32px 0;text-align:center;font-size:13px;}}
  footer a{{color:{footer_link};}}
</style>
</head>
<body>
<nav>
  <div class="navwrap">
    <span class="brand">{project_title}<span>.</span> Documentation</span>
    <div style="display:flex;gap:18px;">
      <a href="../index.html">← Case study</a>
      <a href="../../../index.html">Portfolio</a>
    </div>
  </div>
</nav>
<article class="wrap">
{body}
<div class="doc-footer">Part of the {project_title} case study documentation set. For the short version, see the <a href="../index.html">case study page</a>.</div>
</article>
<footer>
  <div class="wrap">{footer_note}</div>
</footer>
</body>
</html>
"""


def build(slug):
    cfg = PROJECTS[slug]
    docs_dir = os.path.join(REPO_ROOT, "projects", slug, "docs")
    md = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists"])
    for src, out, title in cfg["docs"]:
        path = os.path.join(docs_dir, src)
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        html_body = md.convert(text)
        md.reset()
        html_body = re.sub(r"<p>(<svg[\s\S]*?</svg>)</p>", r"\1", html_body)
        full = TEMPLATE.format(
            title=title,
            project_title=cfg["title"],
            body=html_body,
            footer_note=cfg["footer_note"],
            **cfg["colors"],
        )
        outpath = os.path.join(docs_dir, out)
        with open(outpath, "w", encoding="utf-8") as f:
            f.write(full)
        print("wrote", outpath)


if __name__ == "__main__":
    targets = sys.argv[1:] or list(PROJECTS.keys())
    for slug in targets:
        build(slug)
