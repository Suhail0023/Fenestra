#!/usr/bin/env python3
"""Build the protected browser bundle.
Reads index.html (the readable source - keep it private) and writes dist/:
  app.html   page markup with a <!--#SCRIPTS--> placeholder (no script)
  a.js       core code (minified)
  k.js       KPI and certificate module (minified; only sent to roles that may use it)
  b.js       rest of the code (minified)
The server assembles these after login (GET /api/app), so nobody who is not signed in receives any application code.
Usage: python3 tools/build_protected.py   (needs esbuild: set ESBUILD=/path/to/esbuild, or have it on PATH)"""
import os, re, subprocess, sys, shutil, hashlib, json, datetime
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
ESB = os.environ.get("ESBUILD") or shutil.which("esbuild") or "/opt/npm-tools/node_modules/esbuild/bin/esbuild"
src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
m = re.search(r"<script>\n", src); i = m.end(); j = src.rindex("</script>")
before, js, after = src[:i - len("<script>\n")], src[i:j], src[j + len("</script>"):]
a1 = js.index("/*#MOD:kpi*/"); a2 = js.index("/*#END:kpi*/")
parts = {"a": js[:a1], "k": js[a1:a2], "b": js[a2 + len("/*#END:kpi*/"):]}
def mini(code):
    r = subprocess.run([ESB, "--minify", "--legal-comments=none", "--charset=utf8", "--target=es2020"], input=code.encode(), capture_output=True)
    if r.returncode: sys.stderr.write(r.stderr.decode()); sys.exit("esbuild failed")
    return r.stdout.decode()
BANNER = "/*! FenOps - Copyright (c) 2026 Charles Couteau. All rights reserved. Proprietary and confidential; unauthorised copying or reverse engineering is prohibited. */\n"
out = os.path.join(ROOT, "dist"); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
open(os.path.join(out, "app.html"), "w", encoding="utf-8").write(before + "<!--#SCRIPTS-->" + after)
sizes = {}
for k, v in parts.items():
    c = mini(v)
    if k == "a": c = BANNER + c
    open(os.path.join(out, k + ".js"), "w", encoding="utf-8").write(c); sizes[k] = (len(v), len(c))
man = {"built": datetime.datetime.now().astimezone().isoformat(timespec="seconds"), "files": {f: hashlib.sha256(open(os.path.join(out, f), "rb").read()).hexdigest() for f in sorted(os.listdir(out))}}
json.dump(man, open(os.path.join(out, "build.json"), "w"), indent=1)
print("built dist/:", {k: "%d -> %d bytes" % v for k, v in sizes.items()})
