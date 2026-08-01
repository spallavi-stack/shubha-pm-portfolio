#!/usr/bin/env python3
"""Refresh Flexy's real ComEd price data baked into projects/flexy/prototype.html.

Fetches real hourly prices from ComEd's public Hourly Pricing API
(https://hourlypricing.comed.com/api?type=day&date=YYYYMMDD) for a handful of
real days and rewrites the FALLBACK_COMED_PRICES, RANGE_PRICES, and
RANGE_SOURCE_LABEL constants in prototype.html in place, so the click-dummy's
static snapshots stay recent instead of frozen at whatever date they were
last hand-written. Today's live fetch (loadRealComedData in prototype.html)
is unaffected by this script; this only refreshes the static fallback and
the Week/Month/Year averages.

Usage: python3 scripts/refresh_comed_prices.py
"""
import datetime
import re
import sys
import urllib.request

REPO_ROOT = __import__("os").path.dirname(__import__("os").path.dirname(__import__("os").path.abspath(__file__)))
PROTOTYPE_PATH = f"{REPO_ROOT}/projects/flexy/prototype.html"

DATE_RE = re.compile(r"Date\.UTC\(\d+,\d+,\d+,(\d+),\d+,\d+\)\s*,\s*([\d.]+)\s*\]")


def fetch_day(date):
    date_str = date.strftime("%Y%m%d")
    url = f"https://hourlypricing.comed.com/api?type=day&date={date_str}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        text = resp.read().decode("utf-8")
    hours = [None] * 24
    for m in DATE_RE.finditer(text):
        hours[int(m.group(1))] = float(m.group(2))
    last_filled = max((i for i, v in enumerate(hours) if v is not None), default=-1)
    if last_filled < 20:
        return None
    for i in range(24):
        if hours[i] is None:
            hours[i] = hours[i - 1] if i > 0 else 0.0
    return hours


def fetch_most_recent_full_day(start):
    for back in range(0, 5):
        d = start - datetime.timedelta(days=back)
        hours = fetch_day(d)
        if hours:
            return d, hours
    return None, None


def average_hours(days_hours):
    return [round(sum(h[i] for h in days_hours) / len(days_hours), 2) for i in range(24)]


def fmt_date(d):
    return d.strftime("%b %-d, %Y")


def fmt_range(dates):
    dates = sorted(dates)
    if dates[0].month == dates[-1].month and dates[0].year == dates[-1].year:
        return f"{dates[0].strftime('%b %-d')}–{dates[-1].strftime('%-d, %Y')}"
    return f"{dates[0].strftime('%b %Y')}–{dates[-1].strftime('%b %Y')}"


def main():
    today = datetime.date.today()
    anchor, anchor_hours = fetch_most_recent_full_day(today - datetime.timedelta(days=1))
    if anchor is None:
        print("Could not fetch any recent real ComEd day; aborting without changes.", file=sys.stderr)
        sys.exit(1)

    # Fallback (last-resort static snapshot): the single most recent real day.
    fallback_prices = anchor_hours
    fallback_label = fmt_date(anchor)
    fallback_date_str = anchor.strftime("%Y%m%d")

    # Week: last 7 real days ending at the anchor day.
    week_days, week_dates = [], []
    d = anchor
    while len(week_days) < 7 and (today - d).days < 30:
        hours = fetch_day(d)
        if hours:
            week_days.append(hours)
            week_dates.append(d)
        d -= datetime.timedelta(days=1)
    week_prices = average_hours(week_days)
    week_label = f"Real avg of {len(week_days)} days, {fmt_range(week_dates)}"

    # Month: 2 real days sampled ~10 and ~25 days back from the anchor.
    month_dates_target = [anchor - datetime.timedelta(days=10), anchor - datetime.timedelta(days=25)]
    month_days, month_dates = [], []
    for target in month_dates_target:
        d, hours = fetch_most_recent_full_day(target)
        if hours:
            month_days.append(hours)
            month_dates.append(d)
    month_prices = average_hours(month_days) if month_days else week_prices
    month_label = f"Real avg of {len(month_days)} sampled days, {fmt_range(month_dates)}" if month_days else week_label

    # Year: 5 real days spread across the last ~365 days.
    year_dates_target = [anchor - datetime.timedelta(days=n) for n in (30, 100, 180, 260, 340)]
    year_days, year_dates = [], []
    for target in year_dates_target:
        d, hours = fetch_most_recent_full_day(target)
        if hours:
            year_days.append(hours)
            year_dates.append(d)
    year_prices = average_hours(year_days) if year_days else month_prices
    year_label = f"Real avg of {len(year_days)} sampled days, {fmt_range(year_dates)}" if year_days else month_label

    spot_check_date = {
        "week": max(week_dates).strftime("%Y%m%d") if week_dates else fallback_date_str,
        "month": max(month_dates).strftime("%Y%m%d") if month_dates else fallback_date_str,
        "year": max(year_dates).strftime("%Y%m%d") if year_dates else fallback_date_str,
    }

    with open(PROTOTYPE_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    html = re.sub(
        r"const FALLBACK_COMED_PRICES = \[[^\]]*\];",
        f"const FALLBACK_COMED_PRICES = [{','.join(str(p) for p in fallback_prices)}];",
        html, count=1,
    )
    html = re.sub(
        r"const FALLBACK_LABEL = '[^']*';",
        f"const FALLBACK_LABEL = '{fallback_label}';",
        html, count=1,
    )
    html = re.sub(
        r"const FALLBACK_DATE_STR = '\d{8}';",
        f"const FALLBACK_DATE_STR = '{fallback_date_str}';",
        html, count=1,
    )

    range_prices_block = (
        "const RANGE_PRICES = {\n"
        f"  week:  [{','.join(str(p) for p in week_prices)}],\n"
        f"  month: [{','.join(str(p) for p in month_prices)}],\n"
        f"  year:  [{','.join(str(p) for p in year_prices)}]\n"
        "};"
    )
    html = re.sub(r"const RANGE_PRICES = \{.*?\n\};", range_prices_block, html, count=1, flags=re.DOTALL)

    range_labels_block = (
        "const RANGE_SOURCE_LABEL = {\n"
        f"  week: '{week_label}',\n"
        f"  month: '{month_label}',\n"
        f"  year: '{year_label}'\n"
        "};"
    )
    html = re.sub(r"const RANGE_SOURCE_LABEL = \{.*?\n\};", range_labels_block, html, count=1, flags=re.DOTALL)

    spot_check_block = (
        "const RANGE_SPOT_CHECK_DATE = "
        f"{{ week: '{spot_check_date['week']}', month: '{spot_check_date['month']}', year: '{spot_check_date['year']}' }};"
    )
    html = re.sub(r"const RANGE_SPOT_CHECK_DATE = \{.*?\};", spot_check_block, html, count=1)

    with open(PROTOTYPE_PATH, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Refreshed: fallback={fallback_label}, week={week_label}, month={month_label}, year={year_label}")


if __name__ == "__main__":
    main()
