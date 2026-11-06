#!/usr/bin/env python3
"""Refresh data/news.json with the latest branding & design headlines.

Runs daily in GitHub Actions (see .github/workflows/refresh-news.yml).
Stores only headline, link, source and date — never article bodies.
Standard library only, so no dependencies to install.
"""
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

FEEDS = [
    ("Brand New", "https://www.underconsideration.com/brandnew/feed/"),
    ("Creative Bloq", "https://www.creativebloq.com/feeds/all"),
    ("BP&O", "https://bpando.org/feed/"),
    ("Logo Design Love", "https://www.logodesignlove.com/feed"),
    ("Design Week", "https://www.designweek.co.uk/feed/"),
    ("Dezeen", "https://www.dezeen.com/design/feed/"),
    ("Smashing Magazine", "https://www.smashingmagazine.com/feed/"),
    ("The Dieline", "https://thedieline.com/blog?format=rss"),
]
KEYWORDS = re.compile(r"brand|logo|identity|rebrand|typograph|font|packag|design|colou?r|naming", re.I)
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "news.json")
UA = "Mozilla/5.0 (compatible; BrandStudioNewsBot/1.0; +https://brand.studio/news.html)"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


def parse_date(s):
    if not s:
        return None
    s = s.strip()
    try:
        return parsedate_to_datetime(s).astimezone(timezone.utc)
    except Exception:
        pass
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc)
    except Exception:
        return None


def text(el, *names):
    for n in names:
        f = el.find(n)
        if f is not None and (f.text or "").strip():
            return f.text.strip()
    return ""


def items_from(source, raw):
    out = []
    root = ET.fromstring(raw)
    atom = "{http://www.w3.org/2005/Atom}"
    entries = root.findall(".//item") or root.findall(f".//{atom}entry")
    for e in entries[:25]:
        title = text(e, "title", f"{atom}title")
        link = text(e, "link")
        if not link:
            le = e.find(f"{atom}link")
            link = le.get("href") if le is not None else ""
        date = parse_date(text(e, "pubDate", f"{atom}published", f"{atom}updated", "{http://purl.org/dc/elements/1.1/}date"))
        title = re.sub(r"<[^>]+>", "", title)
        title = re.sub(r"\s+", " ", title).strip()
        if not title or not link.startswith("http"):
            continue
        if source in ("Dezeen", "Smashing Magazine", "Design Week") and not KEYWORDS.search(title):
            continue
        out.append({"title": title[:180], "link": link, "source": source, "date": date.isoformat() if date else None})
    return out


def main():
    collected, ok = [], 0
    for source, url in FEEDS:
        try:
            collected += items_from(source, fetch(url))
            ok += 1
            print(f"ok   {source}")
        except Exception as exc:  # keep going if one feed fails
            print(f"skip {source}: {exc}", file=sys.stderr)
    if not ok:
        print("No feeds reachable; keeping existing file.")
        return
    seen, items = set(), []
    for it in collected:
        key = it["link"].split("?")[0]
        if key in seen:
            continue
        seen.add(key)
        items.append(it)
    items.sort(key=lambda x: x["date"] or "", reverse=True)
    data = {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "items": items[:60]}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"wrote {len(data['items'])} items")


if __name__ == "__main__":
    main()
