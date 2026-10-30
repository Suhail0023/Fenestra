#!/usr/bin/env python3
"""Write the dated release history (CHANGELOG.md, CHANGELOG.csv, release_history.txt) and a SHA-256 manifest of every source file.
Keep the manifest files with your records; they prove what existed on which date. Run on every release:  python3 tools/make_history.py"""
import os, json, csv, hashlib, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); L = os.path.join(ROOT, "legal")
now = datetime.datetime.now().astimezone(); stamp = now.strftime("%H:%M")
h = json.load(open(os.path.join(L, "release_history.json"), encoding="utf-8"))
for e in h:
    if e["time"] == "@BUILD@": e["time"] = stamp; e["date"] = now.strftime("%Y-%m-%d")
json.dump(h, open(os.path.join(L, "release_history.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
with open(os.path.join(L, "CHANGELOG.md"), "w", encoding="utf-8") as f:
    f.write("# FenOps - dated change log\n\nEach entry shows the date and time (Asia/Dubai) when that version was built and delivered.\n\n")
    for e in reversed(h): f.write("## %s - %s %s\n**%s**\n\n%s\n\n" % (e["version"], e["date"], e["time"], e["title"], "\n".join("- " + c for c in e["changes"])))
with open(os.path.join(L, "CHANGELOG.csv"), "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f); w.writerow(["Date", "Time", "Version", "Title", "Change"])
    for e in h:
        for c in e["changes"]: w.writerow([e["date"], e["time"], e["version"], e["title"], c])
SKIP = {"__pycache__", "dist", ".git", "node_modules"}; files = {}
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if d not in SKIP]
    for n in sorted(fn):
        p = os.path.join(dp, n); rel = os.path.relpath(p, ROOT).replace(os.sep, "/")
        if rel.startswith("legal/MANIFEST") or n.endswith((".db", ".db-wal", ".db-shm")): continue
        files[rel] = {"sha256": hashlib.sha256(open(p, "rb").read()).hexdigest(), "bytes": os.path.getsize(p)}
ver = h[-1]["version"].split()[0]
man = {"product": "FenOps", "version": ver, "generated": now.isoformat(timespec="seconds"), "files": files}
json.dump(man, open(os.path.join(L, "MANIFEST_%s.json" % ver), "w", encoding="utf-8"), indent=1)
print("history entries:", len(h), "| manifest:", len(files), "files |", ver, now.isoformat(timespec="seconds"))
