# -*- coding: utf-8 -*-
"""Viena naujiena -> svetaine (data/news.json + build + git push) IR Discord (#naujienos).

Šablono failas (UTF-8; eilutės, prasidedančios #, ignoruojamos):
    PAVADINIMAS: Trumpas pavadinimas
    SANTRAUKA: Vienas du sakiniai kortelei (iki ~200 simbolių)
    PAVEIKSLAS: /news/failas.jpg      (nebūtina; failas turi būti public/news/ aplanke)
    TEKSTAS:
    • Pirma eilutė
    • Antra eilutė

Naudojimas:
    python publish_news.py --failas naujiena.txt            # skelbia viską
    python publish_news.py --failas naujiena.txt --sausas   # tik parodo, ką darytų
    parametrai: --be-discord  --be-svetaines  --praleisti-build  --data 2026-10-03
Saugumas: prieš siunčiant tikrinamas JSON ir `next build`; nepavykus – failas grąžinamas; Discord žinutėje @paminėjimai išjungti.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
from datetime import date
from pathlib import Path

SITE_DIR = Path(os.environ.get("NOVACORE_SITE_DIR", r"C:\NovaCoreSite"))
NEWS = SITE_DIR / "data" / "news.json"
SITE_URL = "https://www.novacore.lt"
NOTIFY = Path(r"C:\NovaCore\discord_notify.py")


def parse_template(path):
    title = excerpt = image = None
    body, mode = [], None
    for raw in Path(path).read_text(encoding="utf-8-sig").splitlines():
        line = raw.rstrip()
        if line.lstrip().startswith("#") and mode != "body":
            continue
        m = re.match(r"^\s*(PAVADINIMAS|SANTRAUKA|PAVEIKSLAS|TEKSTAS)\s*:\s*(.*)$", line, re.I)
        if m and mode != "body":
            key, val = m.group(1).upper(), m.group(2).strip()
            if key == "PAVADINIMAS": title = val
            elif key == "SANTRAUKA": excerpt = val
            elif key == "PAVEIKSLAS": image = val
            else:
                mode = "body"
                if val: body.append(val)
            continue
        if mode == "body":
            body.append(line)
    content = "\n".join(body).strip()
    return title, excerpt, content, image


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", cwd=str(SITE_DIR), **kw)
    return r.returncode, (r.stdout + r.stderr)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--failas", required=True)
    ap.add_argument("--sausas", action="store_true")
    ap.add_argument("--be-discord", action="store_true")
    ap.add_argument("--be-svetaines", action="store_true")
    ap.add_argument("--praleisti-build", action="store_true")
    ap.add_argument("--data", default=None)
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    title, excerpt, content, image = parse_template(a.failas)
    problems = []
    if not title or len(title) > 90: problems.append("PAVADINIMAS privalomas (iki 90 simbolių)")
    if not excerpt or len(excerpt) > 260: problems.append("SANTRAUKA privaloma (iki 260 simbolių)")
    if not content: problems.append("TEKSTAS privalomas")
    if problems:
        print("KLAIDA:", "; ".join(problems))
        return 2

    news = json.loads(NEWS.read_text(encoding="utf-8"))
    nid = max(x["id"] for x in news) + 1
    item = {"id": nid, "title": title, "date": a.data or date.today().isoformat(), "excerpt": excerpt, "content": content}
    if image:
        if not (SITE_DIR / "public" / image.lstrip("/")).exists():
            print("KLAIDA: paveikslėlio nėra: public" + image)
            return 2
        item["image"] = image
    link = "%s/news/%d" % (SITE_URL, nid)
    print("Naujiena #%d: %s\n  %s\n  nuoroda: %s" % (nid, title, excerpt, link))
    if a.sausas:
        print("(sausas bėgimas, nieko nepadaryta)")
        return 0

    if not a.be_svetaines:
        backup = NEWS.read_bytes()
        news.append(item)
        NEWS.write_text(json.dumps(news, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
        json.loads(NEWS.read_text(encoding="utf-8"))          # patikrinimas
        if not a.praleisti_build:
            print("Tikrinama svetainė (build)…")
            code, out = run(["cmd", "/c", "npx", "next", "build"], timeout=900)
            if code != 0:
                NEWS.write_bytes(backup)
                print("KLAIDA: svetainė nesikompiliuoja, naujiena NEįdėta.\n" + out[-1200:])
                return 3
        code, out = run(["git", "add", "data/news.json", "public/news"])
        code2, out2 = run(["git", "commit", "-q", "-m", "Naujiena: %s\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" % title])
        code3, out3 = run(["git", "push", "-q", "origin", "main"])
        if code or code2 or code3:
            print("KLAIDA siunčiant į GitHub:\n" + (out + out2 + out3)[-800:])
            return 4
        print("Išsiųsta į GitHub; laukiama, kol svetainė atsinaujins…")
        for _ in range(0 if os.environ.get("NOVACORE_SKIP_WAIT") else 36):
            try:
                with urllib.request.urlopen(link, timeout=15) as r:
                    if r.status == 200:
                        print("Svetainėje naujiena jau matoma.")
                        break
            except Exception:
                pass
            time.sleep(5)
        else:
            if not os.environ.get("NOVACORE_SKIP_WAIT"):
                print("(įspėjimas) per 3 min. naujiena svetainėje dar nepasirodė; Discord žinutė vis tiek siunčiama.")

    if not a.be_discord:
        tmp = Path(tempfile.gettempdir()) / "novacore_news_discord.json"
        tmp.write_text(json.dumps({"title": title, "excerpt": excerpt, "content": content, "url": link, "image": (SITE_URL + image) if image else None}, ensure_ascii=False), encoding="utf-8")
        r = subprocess.run([sys.executable, str(NOTIFY), "naujiena", str(tmp)], capture_output=True, text=True, encoding="utf-8", errors="replace")
        print("Discord:", (r.stdout or r.stderr).strip())
        if r.returncode != 0:
            return 5
    print("Baigta.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
