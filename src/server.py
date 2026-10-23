#!/usr/bin/env python3
"""Fenestra Site local server. The Excel workbook per project is the database.
   python server.py            -> http://localhost:8000   (this laptop only)
   python server.py --lan      -> also reachable from phones on the same Wi-Fi
Logins: users.json (passwords stored as salted PBKDF2 hashes). Managed in the app (Users tab, Management role).
Email (optional): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
WhatsApp (optional): WA_TOKEN + WA_PHONE_ID (Meta Cloud API) or TWILIO_SID + TWILIO_TOKEN + TWILIO_WA_FROM.
Deployment: DATA_DIR, PORT, TRUST_PROXY=1, SEED_DEMO_USERS=0, INIT_ADMIN_PASSWORD."""
import datetime as dt, glob, hashlib, json, os, re, secrets, shutil, smtplib, sys, threading, time, base64, uuid
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font

APP = os.path.dirname(os.path.abspath(__file__)); BASE = os.environ.get("DATA_DIR") or APP; os.makedirs(BASE, exist_ok=True); LOCK = threading.Lock()
USERS_FILE = os.path.join(BASE, "users.json"); COMPANY_FILE = os.path.join(BASE, "company.json"); PROJ_FILE = os.path.join(BASE, "projects.json"); TREE_FILE = os.path.join(BASE, "ptree.json")
KINDS = ["Project", "Sub-project", "Building", "Scope / package", "Phase", "Zone"]
ASSETS = {"/manifest.webmanifest": ("manifest.webmanifest", "application/manifest+json"), "/sw.js": ("sw.js", "text/javascript"),
          "/icon-192.png": ("icon-192.png", "image/png"), "/icon-512.png": ("icon-512.png", "image/png")}

TABLES = {
 "Items": ("items", ["id","p","name","qty","uom","wtg","lm","ac","sc","seq","dur","start","done","st","team","eng","w","rt","t0","face","ea","miss","mailed","code","cr","bc","vg","vo","vr"]),
 "Productivity": ("rates", ["k","q","z"]),
 "Pending_Approvals": ("pend", ["k","i","f","o","n"]),
 "Inspections": ("insp", ["no","tid","n","qty","s","c","d","dt","dd","by","note","ph","sc","cr"]),
 "Daily_Logs": ("logs", ["d","team","t","w","h","q","s","f"]),
 "Obstructions": ("obs", ["d","t","ty","h","n","ph"]),
 "Outbox": ("mail", ["to","n","miss","from","ps","pf","delay","body"]),
 "Employees": ("emps", ["id","name","role","team","site"]),
 "Attendance": ("att", ["d","t","id","name","in","out"]),
 "Activity_Log": ("ev", ["d","tm","id","n","ev","by","note","u"]),
 "Chat_Log": ("chat", ["id","d","tm","proj","by","text"]),
 "Snags": ("snags", ["id","no","tid","loc","desc","owner","due","s","d","dc","dr","dw","px","py","ph","by","note"]),
 "Permits": ("ptw", ["id","no","tid","type","vf","vt","s","by","ap","d","note"]),
 "Toolbox_Talks": ("tbt", ["id","d","tid","topic","by","n","note"]),
 "Incidents": ("inc", ["id","d","ty","tid","desc","act","s","ph","by"]),
 "Requests": ("reqs", ["id","to","tid","n","items","d","due","s","reply","dc","ch","b","esc","eb"]),
 "Delays": ("delays", ["id","d","tid","cause","party","days","note","rid"]),
 "Variations": ("vars", ["id","no","d","desc","bid","dq","val","s","note","wir"]),
 "Costs": ("costs", ["id","d","bid","type","amt","note"]),
 "Drawings": ("draws", ["id","name","url"])}
CONFIG_KEYS = ["proj", "base", "baseH", "xl", "wirTpl", "contacts", "fin", "diary", "pp", "pts", "awd", "lean", "fid", "sp", "dp", "mh", "vo", "ipa", "ipas", "mt", "tl", "sir", "wp", "cfg", "sigs", "roll", "fca", "la"]
INTS = ("id","p","seq","dur","i","t","tid","dw","rid","bid")
LISTF = {"insp": ("c", "cr", "ph"), "obs": ("ph",), "snags": ("ph",), "inc": ("ph",), "reqs": ("items",)}
README = [["Fenestra Site project database (Excel backend)"], [""],
 ["Items: one row per BOQ item. p = parent id (0 = top level). Rows with dur (days) and start (yyyy-mm-dd) are schedulable activities."],
 ["  qty = total quantity, cr = contract rate per unit, bc = estimate cost per unit, done = % complete, st = plan/res/deleg/acc/comp."],
 ["Other sheets are written by the app: WIR (Inspections), Snags, Permits, Toolbox_Talks, Incidents, Requests, Delays, Variations, Costs, Daily_Logs, Obstructions, Chat_Log, Activity_Log."],
 ["Config: one row per setting (stored as JSON text). Edit in the app rather than here."],
 ["Logins are in users.json (not in this workbook). Manage them in the app: Users tab, Management role."],
 ["Close this file in Excel before using the app (Excel locks it). Edit, save, close, then refresh the browser."]]

def clean(k, v):
    if isinstance(v, dt.datetime): return v.strftime("%Y-%m-%d")
    if isinstance(v, dt.date): return v.strftime("%Y-%m-%d")
    if isinstance(v, dt.time): return v.strftime("%H:%M")
    if isinstance(v, float) and v == int(v) and k in INTS: return int(v)
    return v.strip() if isinstance(v, str) else v
def cell(c, v):
    if c == "ea": return ";".join("1" if i else "0" for i in v)
    if c == "miss": return " | ".join(v)
    return "; ".join(str(i) for i in v)
def rows(ws): return [r for r in ws.iter_rows(min_row=2, values_only=True) if any(x not in (None, "") for x in r)]

def code_of(p):
    c = re.sub(r"[^A-Za-z0-9_-]", "", p or "") or "LR001"
    return c[:24]
def dbp(p): return os.path.join(BASE, "AZAL_%s_Project_DB.xlsx" % code_of(p))
def load_json(fp, default):
    try: return json.load(open(fp, encoding="utf-8"))
    except Exception: return default
def save_json(fp, obj):
    tmp = fp + ".tmp"; json.dump(obj, open(tmp, "w", encoding="utf-8"), indent=1); os.replace(tmp, fp)

def read_state(p="LR001"):
    wb = load_workbook(dbp(p), data_only=True); S = {}
    for sh, (key, cols) in TABLES.items():
        S[key] = [{c: clean(c, v) for c, v in zip(cols, r) if v not in (None, "")} for r in rows(wb[sh])] if sh in wb.sheetnames else []
    for x in S["items"]:
        if "ea" in x: x["ea"] = [t.strip() == "1" for t in str(x["ea"]).split(";")]
        if "miss" in x: x["miss"] = [t.strip() for t in str(x["miss"]).split("|") if t.strip()]
    for x in S["mail"]:
        if "miss" in x: x["miss"] = [t.strip() for t in str(x["miss"]).split("|") if t.strip()]
    for key, fs in LISTF.items():
        for x in S[key]:
            for f in fs: x[f] = [t.strip() for t in str(x.get(f, "")).split(";") if t.strip()]
    st = {r[0]: r[1] for r in rows(wb["Settings"])} if "Settings" in wb.sheetnames else {}
    ids = [i["id"] for i in S["items"] if "id" in i]
    S["n"] = max(int(st.get("n") or 1), (max(ids) + 1) if ids else 1)
    for key in ("snags", "ptw", "tbt", "inc", "reqs", "delays", "vars", "costs", "draws"):
        for x in S[key]:
            if isinstance(x.get("id"), int): S["n"] = max(S["n"], x["id"] + 1)
    S["ratio"] = {k: int(st.get(k) or d) for k, d in (("sup", 8), ("log", 12), ("store", 20))}
    if st.get("chkitems"): S["chkItems"] = [t.strip() for t in str(st["chkitems"]).split("|") if t.strip()]
    S["teams"] = [t.strip() for t in str(st.get("teams", "")).split(",") if t.strip()]
    S["chk"] = {str(r[0]): [x == "1" for x in str(r[1] or "").split(";") if x != ""] for r in rows(wb["Checklist"])} if "Checklist" in wb.sheetnames else {}
    S["ack"] = {str(r[0]): bool(r[1]) for r in rows(wb["Flags_Ack"])} if "Flags_Ack" in wb.sheetnames else {}
    S["todo"] = [r[0] for r in rows(wb["Todo"])] if "Todo" in wb.sheetnames else []
    if "Config" in wb.sheetnames:
        parts = {}
        for k, v in ((r[0], r[1]) for r in rows(wb["Config"])):
            base_, _, n_ = str(k).partition("#"); parts.setdefault(base_, {})[int(n_ or 0)] = v or ""
        for k, pp in parts.items():
            if k in CONFIG_KEYS:
                try: S[k] = json.loads("".join(pp[i] for i in sorted(pp)))
                except Exception: pass
    return S

def write_state(S, p="LR001"):
    DB = dbp(p)
    if os.path.exists(DB): shutil.copy2(DB, DB + ".bak"); wb = load_workbook(DB)
    else:
        wb = Workbook(); wb.remove(wb.active); w = wb.create_sheet("README")
        for r in README: w.append(r)
        w.column_dimensions["A"].width = 120
    def sheet(name, header, data):
        ws = wb[name] if name in wb.sheetnames else wb.create_sheet(name)
        ws.delete_rows(1, ws.max_row + 1); ws.append(header)
        for c in ws[1]: c.font = Font(bold=True)
        for d in data: ws.append(d)
        ws.freeze_panes = "A2"
        for i in range(len(header)): ws.column_dimensions[chr(65 + i) if i < 26 else "A" + chr(65 + i - 26)].width = 34 if header[i] in ("name", "n", "c", "desc", "text") else 14
    for sh, (key, cols) in TABLES.items():
        sheet(sh, cols, [[(cell(c, x[c]) if isinstance(x.get(c), list) else x.get(c)) for c in cols] for x in S.get(key, [])])
    sheet("Settings", ["key", "value"], [["n", S.get("n", 1)]] + [[k, v] for k, v in S.get("ratio", {}).items()] + [["teams", ",".join(S.get("teams", []))]] + ([["chkitems", " | ".join(S["chkItems"])]] if S.get("chkItems") else []))
    sheet("Checklist", ["task id", "items done (1/0, in order)"], [[k, ";".join("1" if x else "0" for x in v)] for k, v in S.get("chk", {}).items()])
    sheet("Flags_Ack", ["flag key", "done"], [[k, bool(v)] for k, v in S.get("ack", {}).items() if v])
    sheet("Todo", ["text"], [[t] for t in S.get("todo", [])])
    cfg = []
    for k in CONFIG_KEYS:
        if S.get(k) is None: continue
        js = json.dumps(S[k], ensure_ascii=False)
        for i in range(0, max(1, len(js)), 30000): cfg.append([k if i == 0 else "%s#%d" % (k, i // 30000), js[i:i + 30000]])
    sheet("Config", ["key", "value"], cfg)
    tmp = DB + ".tmp"; wb.save(tmp); os.replace(tmp, DB)
    nm = (S.get("proj") or {}).get("name")
    idx = load_json(PROJ_FILE, {}); c = code_of(p)
    if nm and idx.get(c) != nm: idx[c] = nm; save_json(PROJ_FILE, idx)

def list_projects():
    idx = load_json(PROJ_FILE, {}); out = []
    for f in sorted(glob.glob(os.path.join(BASE, "AZAL_*_Project_DB.xlsx"))):
        c = re.match(r"AZAL_(.+)_Project_DB\.xlsx", os.path.basename(f)).group(1)
        out.append({"code": c, "name": idx.get(c, c)})
    tr = load_json(TREE_FILE, {}); codes = {o["code"] for o in out}
    for o in out:
        t = tr.get(o["code"], {}); o["parent"] = t.get("parent") if t.get("parent") in codes and t.get("parent") != o["code"] else ""; o["kind"] = t.get("kind") if t.get("kind") in KINDS else "Project"
    if not out: out = [{"code": "LR001", "name": "LR001"}]
    return out

# ---------------- users and tokens ----------------
ROLE_DEFAULTS = [("management", "Management", "Management"), ("pm", "Project manager", "Project manager"), ("planner", "Planning engineer", "Planning engineer"),
                 ("siteeng", "Site engineer", "Site engineer"), ("qe", "Quality engineer", "Quality engineer"), ("hse", "HSE officer", "HSE officer"),
                 ("contractor", "Main contractor", "Main contractor"), ("production", "Production department", "Production department")]
TOKENS = {}
def hash_pw(pw, salt=None):
    salt = salt or secrets.token_hex(8)
    return salt, hashlib.pbkdf2_hmac("sha256", pw.encode(), salt.encode(), 120000).hex()
def users():
    u = load_json(USERS_FILE, None)
    if u is None:
        u = []
        demo = os.environ.get("SEED_DEMO_USERS", "1") != "0"
        for un, name, role in (ROLE_DEFAULTS if demo else ROLE_DEFAULTS[:1]):
            pw = "azal2026" if demo else (os.environ.get("INIT_ADMIN_PASSWORD") or secrets.token_urlsafe(9))
            if not demo: print("Management account created: user name 'management', password:", pw, "(change it at first login)")
            s, h = hash_pw(pw); u.append({"u": un, "name": name, "role": role, "email": "", "phone": "", "salt": s, "hash": h, "must": True})
        save_json(USERS_FILE, u)
    return u
def pub(u): return {k: u.get(k, "") for k in ("u", "name", "role", "email", "phone")} | {"must": bool(u.get("must")), "status": u.get("status", "active")}
KNOWN_ROLES = [r for _, _, r in ROLE_DEFAULTS]
LOGO_EXT = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp"}
CO_FIELDS = ("name", "address", "phone", "email", "web", "trn", "footer", "chan")
def company(): return load_json(COMPANY_FILE, {})
SIGNUPS = []
FAILS = {}
ASKS = {}
def audit(ev, who="", ip=""):
    try:
        with open(os.path.join(BASE, "audit.log"), "a", encoding="utf-8") as f: f.write("%s\t%s\t%s\t%s\n" % (time.strftime("%Y-%m-%d %H:%M:%S"), ev, who, ip))
    except Exception: pass
def locked(key, lim=5):
    now = time.time(); FAILS[key] = [t for t in FAILS.get(key, []) if now - t < 600]
    return len(FAILS[key]) >= lim and int(600 - (now - FAILS[key][0])) + 1
def user_by_name_or_role(n):
    for u in users():
        if (u.get("email") or u.get("phone")) and (u["name"] == n or u["role"] == n): return u
    return None

def smtp_send(to, subject, body):
    host = os.environ.get("SMTP_HOST")
    if not host: raise RuntimeError("Email is not configured on this server (set SMTP_HOST, SMTP_USER, SMTP_PASS).")
    e = EmailMessage(); e["From"] = os.environ.get("SMTP_FROM", os.environ.get("SMTP_USER", "")); e["To"] = to; e["Subject"] = subject; e.set_content(body)
    port = int(os.environ.get("SMTP_PORT", 587))
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=25) as s:
            if os.environ.get("SMTP_USER"): s.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASS", ""))
            s.send_message(e)
    else:
        with smtplib.SMTP(host, port, timeout=25) as s:
            s.starttls()
            if os.environ.get("SMTP_USER"): s.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASS", ""))
            s.send_message(e)

def wa_provider():
    if os.environ.get("WA_TOKEN") and os.environ.get("WA_PHONE_ID"): return "meta"
    if os.environ.get("TWILIO_SID") and os.environ.get("TWILIO_TOKEN") and os.environ.get("TWILIO_WA_FROM"): return "twilio"
    return ""
def wa_send(phone, text):
    import urllib.request as ur, urllib.parse as up, urllib.error as ue
    pv = wa_provider(); ph = re.sub(r"\D", "", str(phone or ""))
    if not pv: raise RuntimeError("WhatsApp is not configured on this server (set WA_TOKEN and WA_PHONE_ID, or the TWILIO_ variables).")
    if not 8 <= len(ph) <= 15: raise RuntimeError("The WhatsApp number is not valid. Use the international format, for example 9715xxxxxxxx.")
    text = str(text)[:3500]
    try:
        if pv == "meta":
            tpl = os.environ.get("WA_TEMPLATE")
            if tpl:
                msg = {"messaging_product": "whatsapp", "to": ph, "type": "template", "template": {"name": tpl, "language": {"code": os.environ.get("WA_TEMPLATE_LANG", "en")}, "components": [{"type": "body", "parameters": [{"type": "text", "text": re.sub(r"\s*\n+\s*", " | ", text)[:1000]}]}]}}
            else: msg = {"messaging_product": "whatsapp", "to": ph, "type": "text", "text": {"body": text}}
            r = ur.Request("https://graph.facebook.com/v20.0/%s/messages" % os.environ["WA_PHONE_ID"], data=json.dumps(msg).encode(), headers={"Authorization": "Bearer " + os.environ["WA_TOKEN"], "Content-Type": "application/json"})
        else:
            fr = os.environ["TWILIO_WA_FROM"]; fr = fr if fr.startswith("whatsapp:") else "whatsapp:" + fr
            data = up.urlencode({"From": fr, "To": "whatsapp:+" + ph, "Body": text}).encode()
            tok = base64.b64encode((os.environ["TWILIO_SID"] + ":" + os.environ["TWILIO_TOKEN"]).encode()).decode()
            r = ur.Request("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json" % os.environ["TWILIO_SID"], data=data, headers={"Authorization": "Basic " + tok})
        ur.urlopen(r, timeout=25).read()
    except ue.HTTPError as x:
        raise RuntimeError("WhatsApp provider refused the message (%s): %s" % (x.code, x.read()[:200].decode("utf-8", "replace")))

def deliver(email, phone, subject, body, channel=None):
    """Send by email, WhatsApp or both. Returns {channel: 'sent' | 'skipped: reason' | 'failed: reason'}."""
    ch = channel or company().get("chan") or "email"; res = {}
    if ch in ("email", "both"):
        if not email: res["email"] = "skipped: no email address"
        elif not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email): res["email"] = "failed: invalid email address"
        else:
            try: smtp_send(email, subject, body); res["email"] = "sent"
            except Exception as x: res["email"] = "failed: %s" % x
    if ch in ("whatsapp", "both"):
        if not phone: res["whatsapp"] = "skipped: no WhatsApp number"
        else:
            try: wa_send(phone, (subject + "\n\n" if subject else "") + body); res["whatsapp"] = "sent"
            except Exception as x: res["whatsapp"] = "failed: %s" % x
    return res
SENDS = {}

def notify(mails):
    if not (os.environ.get("SMTP_HOST") or wa_provider()) or not mails: return
    threading.Thread(target=_notify, args=(list(mails),), daemon=True).start()
def _notify(mails):
    for m in mails:
        if m.get("miss") or m.get("body"): continue
        u = user_by_name_or_role(m.get("to"))
        if not u: continue
        r = deliver(u.get("email"), u.get("phone"), "Please accept site task: " + m["n"], "A task has been delegated to you: " + m["n"] + "\nOpen Fenestra Site and press Accept.")
        if any(v.startswith("failed") for v in r.values()): print("notification failed:", r)

class H(BaseHTTPRequestHandler):
    def out(s, code, body, ct="application/json"):
        b = body if isinstance(body, bytes) else body.encode(); s.send_response(code); s.send_header("Content-Type", ct)
        s.send_header("Content-Length", str(len(b))); s.send_header("X-Content-Type-Options", "nosniff"); s.send_header("X-Frame-Options", "SAMEORIGIN"); s.send_header("Referrer-Policy", "same-origin")
        if s.headers.get("X-Forwarded-Proto") == "https": s.send_header("Strict-Transport-Security", "max-age=31536000")
        s.end_headers(); s.wfile.write(b)
    def me(s):
        t = s.headers.get("X-Token", ""); k = TOKENS.get(t)
        if not k or k["exp"] < time.time(): return None
        for u in users():
            if u["u"] == k["u"]: return u
        return None
    def ip(s):
        if os.environ.get("TRUST_PROXY") == "1": return (s.headers.get("Fly-Client-IP") or (s.headers.get("X-Forwarded-For") or "").split(",")[0].strip() or s.client_address[0])
        return s.client_address[0]
    def q(s): return parse_qs(urlparse(s.path).query)
    def proj(s): return code_of((s.q().get("p") or ["LR001"])[0])
    def do_GET(s):
        path = urlparse(s.path).path
        if path.startswith("/photos/"):
            fp = os.path.join(BASE, "photos", os.path.basename(path))
            if os.path.exists(fp): s.out(200, open(fp, "rb").read(), "image/jpeg")
            else: s.out(404, "")
        elif path.startswith("/logo/"):
            fp = os.path.join(BASE, os.path.basename(path))
            ext = fp.rsplit(".", 1)[-1]
            if os.path.basename(path).startswith("logo.") and os.path.exists(fp): s.out(200, open(fp, "rb").read(), {"png": "image/png", "jpg": "image/jpeg", "webp": "image/webp"}.get(ext, "application/octet-stream"))
            else: s.out(404, "")
        elif path == "/healthz": s.out(200, '{"ok":true}')
        elif path == "/api/public":
            c = company(); s.out(200, json.dumps({"name": c.get("name", ""), "logo": c.get("logo", "")}))
        elif path.startswith("/api/"):
            u = s.me()
            if path == "/api/ping": s.out(200, '{"ok":true}'); return
            if not u: s.out(401, '{"error":"login required"}'); return
            if path == "/api/me": s.out(200, json.dumps(pub(u)))
            elif path == "/api/projects": s.out(200, json.dumps(list_projects()))
            elif path == "/api/company": s.out(200, json.dumps(company()))
            elif path == "/api/status":
                s.out(200, json.dumps({"email": bool(os.environ.get("SMTP_HOST")), "whatsapp": wa_provider(), "ai": bool(os.environ.get("ANTHROPIC_API_KEY")), "chan": company().get("chan") or "email", "backups": len(glob.glob(os.path.join(BASE, "backups", "*.zip"))), "demo": os.environ.get("SEED_DEMO_USERS", "1") != "0", "persistent": is_persistent()}))
            elif path == "/api/backup":
                if u["role"] != "Management": s.out(403, '{"error":"management only"}'); return
                audit("backup download", u["u"], s.ip()); s.out(200, make_backup(s.q().get("photos") == ["1"]), "application/zip")
            elif path == "/api/users":
                if u["role"] != "Management": s.out(403, '{"error":"management only"}'); return
                s.out(200, json.dumps([pub(x) for x in users()]))
            elif path == "/api/state":
                with LOCK:
                    try:
                        p = s.proj()
                        if not os.path.exists(dbp(p)):
                            if p == "LR001" and os.path.exists(os.path.join(APP, "seed_state.json")): write_state(json.load(open(os.path.join(APP, "seed_state.json"))), p)
                            else: s.out(404, '{"error":"unknown project"}'); return
                        s.out(200, json.dumps(read_state(p)))
                    except PermissionError: s.out(423, '{"error":"close the Excel file"}')
            else: s.out(404, "{}")
        elif path in ASSETS: f, ct = ASSETS[path]; s.out(200, open(os.path.join(APP, f), "rb").read(), ct)
        else: s.out(200, open(os.path.join(APP, "index.html"), "rb").read(), "text/html; charset=utf-8")
    def do_POST(s):
        path = urlparse(s.path).path
        n = int(s.headers.get("Content-Length", 0) or 0)
        if n > 12_000_000: s.out(413, '{"error":"too large"}'); return
        B = json.loads(s.rfile.read(n) or b"{}")
        if path == "/api/signup":
            un = str(B.get("u", "")).strip(); pw = str(B.get("password", "")); role = B.get("role", "Site engineer"); em = str(B.get("email", "")).strip()
            if not re.match(r"^[A-Za-z0-9_.-]{3,30}$", un): s.out(400, '{"error":"User name: 3 to 30 letters, numbers, dot, dash or underscore"}'); return
            if len(pw) < 8: s.out(400, '{"error":"Password needs 8 or more characters"}'); return
            if role not in KNOWN_ROLES or role == "Management": s.out(400, '{"error":"Choose a role"}'); return
            if em and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", em): s.out(400, '{"error":"Email address looks wrong"}'); return
            now = time.time(); SIGNUPS[:] = [t for t in SIGNUPS if now - t < 600]
            if len(SIGNUPS) >= 10: s.out(429, '{"error":"Too many sign-ups, try again later"}'); return
            with LOCK:
                us = users()
                if any(x["u"].lower() == un.lower() for x in us): s.out(400, '{"error":"That user name is taken"}'); return
                if sum(1 for x in us if x.get("status") == "pending") >= 50: s.out(429, '{"error":"Too many requests waiting for approval"}'); return
                sa, h = hash_pw(pw); us.append({"u": un, "name": str(B.get("name", un))[:80] or un, "role": role, "email": em[:120], "phone": str(B.get("phone", ""))[:30], "salt": sa, "hash": h, "must": False, "status": "pending"}); save_json(USERS_FILE, us); SIGNUPS.append(now)
            s.out(200, '{"ok":true}'); return
        if path == "/api/login":
            ip = s.ip(); un = str(B.get("u", "")).strip().lower(); lk = locked("u:" + un) or locked("i:" + ip, 40)
            if lk: audit("login blocked", un, ip); s.out(429, json.dumps({"error": "Too many failed attempts. Try again in %d minute(s)." % (lk // 60 + 1)})); return
            for u in users():
                if u["u"].lower() == un:
                    if hash_pw(str(B.get("p", "")), u["salt"])[1] == u["hash"]:
                        if u.get("status") == "pending": s.out(403, '{"error":"Your account is waiting for approval by Management."}'); return
                        t = secrets.token_hex(24); TOKENS[t] = {"u": u["u"], "exp": time.time() + 12 * 3600}; FAILS.pop("u:" + un, None); audit("login", u["u"], ip)
                        s.out(200, json.dumps({"token": t, "user": pub(u)})); return
            FAILS.setdefault("u:" + un, []).append(time.time()); FAILS.setdefault("i:" + ip, []).append(time.time()); audit("login failed", un, ip)
            time.sleep(0.6); s.out(401, '{"error":"wrong user name or password"}'); return
        u = s.me()
        if not u: s.out(401, '{"error":"login required"}'); return
        if path == "/api/passwd":
            if hash_pw(str(B.get("old", "")), u["salt"])[1] != u["hash"]: s.out(400, '{"error":"current password is wrong"}'); return
            if len(str(B.get("new", ""))) < 8: s.out(400, '{"error":"use at least 8 characters"}'); return
            with LOCK:
                us = users()
                for x in us:
                    if x["u"] == u["u"]: x["salt"], x["hash"] = hash_pw(B["new"]); x["must"] = False
                save_json(USERS_FILE, us)
            s.out(200, "{}"); return
        if path == "/api/users":
            audit("users " + str(B.get("op", "list")), u["u"] + " -> " + str(B.get("u", "")), s.ip())
            if u["role"] != "Management": s.out(403, '{"error":"management only"}'); return
            with LOCK:
                us = users(); op = B.get("op"); un = str(B.get("u", "")).strip()
                if op == "add":
                    if not un or any(x["u"].lower() == un.lower() for x in us): s.out(400, '{"error":"user name missing or already used"}'); return
                    if len(str(B.get("password", ""))) < 8: s.out(400, '{"error":"password needs 8+ characters"}'); return
                    sa, h = hash_pw(B["password"]); us.append({"u": un, "name": B.get("name", un), "role": B.get("role", "Site engineer"), "email": B.get("email", ""), "phone": B.get("phone", ""), "salt": sa, "hash": h, "must": True})
                else:
                    x = next((y for y in us if y["u"] == un), None)
                    if not x: s.out(404, '{"error":"no such user"}'); return
                    mgrs = [y for y in us if y["role"] == "Management"]
                    if op == "del":
                        if x["role"] == "Management" and len(mgrs) < 2: s.out(400, '{"error":"keep at least one Management user"}'); return
                        us.remove(x)
                    elif op == "approve":
                        x["status"] = "active"
                        if B.get("role") in KNOWN_ROLES: x["role"] = B["role"]
                    elif op == "reject":
                        if x.get("status") != "pending": s.out(400, '{"error":"only pending requests can be rejected"}'); return
                        us.remove(x)
                    elif op == "reset":
                        if len(str(B.get("password", ""))) < 8: s.out(400, '{"error":"password needs 8+ characters"}'); return
                        x["salt"], x["hash"] = hash_pw(B["password"]); x["must"] = True
                    elif op == "set":
                        if x["role"] == "Management" and B.get("role", x["role"]) != "Management" and len(mgrs) < 2: s.out(400, '{"error":"keep at least one Management user"}'); return
                        for k in ("name", "role", "email", "phone"):
                            if k in B: x[k] = B[k]
                save_json(USERS_FILE, us)
            s.out(200, json.dumps([pub(x) for x in users()])); return
        if path == "/api/photo":
            d = B.get("data", ""); raw = base64.b64decode(d.split(",", 1)[1]) if "," in d else b""
            os.makedirs(os.path.join(BASE, "photos"), exist_ok=True); fn = uuid.uuid4().hex[:12] + ".jpg"
            open(os.path.join(BASE, "photos", fn), "wb").write(raw); s.out(200, json.dumps({"url": "/photos/" + fn})); return
        if path == "/api/company":
            if u["role"] != "Management": s.out(403, '{"error":"management only"}'); return
            with LOCK:
                c = company()
                for k in CO_FIELDS:
                    if k in B: c[k] = str(B[k])[:300]
                if c.get("chan") not in (None, "email", "whatsapp", "both"): c["chan"] = "email"
                if isinstance(B.get("perms"), dict):
                    c["perms"] = {r: [t for t in v if isinstance(t, str) and re.match(r"^[a-z0-9]{2,12}$", t)] for r, v in B["perms"].items() if r in KNOWN_ROLES and r != "Management" and isinstance(v, list)}
                elif B.get("perms") is None and "perms" in B: c.pop("perms", None)
                save_json(COMPANY_FILE, c)
            s.out(200, json.dumps(company())); return
        if path == "/api/logo":
            if u["role"] != "Management": s.out(403, '{"error":"management only"}'); return
            d = B.get("data", "")
            with LOCK:
                c = company()
                for f in glob.glob(os.path.join(BASE, "logo.*")): os.remove(f)
                if d:
                    m = re.match(r"^data:(image/(?:png|jpeg|webp));base64,", d)
                    if not m: s.out(400, '{"error":"use a PNG, JPG or WEBP image"}'); return
                    fn = "logo." + LOGO_EXT[m.group(1)]; open(os.path.join(BASE, fn), "wb").write(base64.b64decode(d.split(",", 1)[1])); c["logo"] = "/logo/%s?v=%d" % (fn, int(time.time()))
                else: c["logo"] = ""
                save_json(COMPANY_FILE, c)
            s.out(200, json.dumps({"logo": c["logo"]})); return
        if path == "/api/xer":
            try:
                import xer_detail
                if not isinstance(B.get("acts"), list) or not B["acts"] or len(B["acts"]) > 5000: s.out(400, '{"error":"No activities to export"}'); return
                data = xer_detail.build(B)
            except Exception as ex: s.out(400, json.dumps({"error": "Could not build the XER: %s" % ex})); return
            s.out(200, data, "text/plain; charset=windows-1252"); return
        if path == "/api/ask":
            key = os.environ.get("ANTHROPIC_API_KEY")
            if not key: s.out(501, '{"error":"AI guide is not configured on this server"}'); return
            now = time.time(); ASKS[u["u"]] = [t for t in ASKS.get(u["u"], []) if now - t < 60]
            if len(ASKS[u["u"]]) >= 12: s.out(429, '{"error":"Slow down: too many questions this minute"}'); return
            ASKS[u["u"]].append(now)
            q = str(B.get("q", ""))[:600]; ctx = str(B.get("ctx", ""))[:9000]
            if not q.strip(): s.out(400, '{"error":"empty question"}'); return
            import urllib.request as ur
            body = json.dumps({"model": os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5-5"), "max_tokens": 700, "system": "You are the in-app guide for Fenestra Site, a fenestration installation planning and monitoring app. Answer only from the guide text below. Be concise, use short numbered steps, name the tab to open, and say so if the guide does not cover the question. Never invent features.\n\nGUIDE:\n" + ctx, "messages": [{"role": "user", "content": q}]}).encode()
            try:
                rq = ur.Request("https://api.anthropic.com/v1/messages", body, {"content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01"})
                a = json.loads(ur.urlopen(rq, timeout=30).read()); txt = "".join(c.get("text", "") for c in a.get("content", []))
                s.out(200, json.dumps({"answer": txt}))
            except Exception as x: s.out(502, json.dumps({"error": "AI service unavailable"}))
            return
        if path == "/api/send":
            now = time.time(); SENDS[u["u"]] = [t for t in SENDS.get(u["u"], []) if now - t < 60]
            if len(SENDS[u["u"]]) >= 40: s.out(429, '{"error":"Too many messages this minute. Wait a moment."}'); return
            SENDS[u["u"]].append(now)
            ch = B.get("channel") if B.get("channel") in ("email", "whatsapp", "both") else None
            r = deliver(str(B.get("to", "")).strip(), str(B.get("phone", "")).strip(), str(B.get("subject", ""))[:200], str(B.get("body", ""))[:8000], ch)
            ok = any(v == "sent" for v in r.values()); audit("send " + json.dumps(r), u["u"], s.ip())
            if ok: s.out(200, json.dumps({"ok": True, "result": r}))
            else: s.out(501, json.dumps({"error": "; ".join("%s %s" % (k, v) for k, v in r.items()) or "Nothing was sent", "result": r}))
            return
        if path == "/api/test":
            if u["role"] != "Management": s.out(403, '{"error":"management only"}'); return
            r = deliver(str(B.get("to", "")).strip(), str(B.get("phone", "")).strip(), "Fenestra Site test message", "This is a test message from Fenestra Site. Email and WhatsApp are working.", B.get("channel") if B.get("channel") in ("email", "whatsapp", "both") else "both")
            s.out(200, json.dumps({"result": r})); return
        if path == "/api/project":
            if u["role"] not in ("Management", "Project manager", "Planning engineer"): s.out(403, '{"error":"not allowed"}'); return
            c = code_of(B.get("code", ""))
            with LOCK:
                if os.path.exists(dbp(c)): s.out(400, '{"error":"that project code exists"}'); return
                st = B.get("state") or {}; st.setdefault("proj", {"code": c, "name": B.get("name", c)}); write_state(st, c)
                par = code_of(B.get("parent", "")) if B.get("parent") else ""
                if par and os.path.exists(dbp(par)):
                    tr = load_json(TREE_FILE, {}); tr[c] = {"parent": par, "kind": B.get("kind") if B.get("kind") in KINDS else "Sub-project"}; save_json(TREE_FILE, tr)
            s.out(200, json.dumps(list_projects())); return
        if path == "/api/ptree":
            if u["role"] not in ("Management", "Project manager", "Planning engineer"): s.out(403, '{"error":"not allowed"}'); return
            c = code_of(B.get("code", "")); par = code_of(B.get("parent", "")) if B.get("parent") else ""
            with LOCK:
                if not os.path.exists(dbp(c)): s.out(404, '{"error":"unknown project"}'); return
                if par and not os.path.exists(dbp(par)): s.out(400, '{"error":"unknown parent"}'); return
                tr = load_json(TREE_FILE, {}); a = par
                while a:
                    if a == c: s.out(400, '{"error":"a project cannot sit under itself or its own sub-projects"}'); return
                    a = (tr.get(a) or {}).get("parent", "")
                tr[c] = {"parent": par, "kind": B.get("kind") if B.get("kind") in KINDS else (tr.get(c) or {}).get("kind", "Project")}; save_json(TREE_FILE, tr)
            s.out(200, json.dumps(list_projects())); return
        if u["role"] == "Main contractor": s.out(403, '{"error":"read only"}'); return
        p = s.proj()
        if path == "/api/chat":
            with LOCK:
                try:
                    cur = read_state(p); m = {k: B.get(k, "") for k in ("d", "tm", "proj", "by", "text")}
                    m["id"] = max([c.get("id", 0) for c in cur["chat"] if isinstance(c.get("id"), int)] + [0]) + 1
                    cur["chat"].append(m); write_state(cur, p); s.out(200, json.dumps(cur["chat"]))
                except PermissionError: s.out(423, '{"error":"close the Excel file"}')
            return
        if path == "/api/state":
            with LOCK:
                try:
                    cur = read_state(p) if os.path.exists(dbp(p)) else {"mail": [], "chat": []}
                    old = len(cur["mail"]); B["chat"] = cur["chat"]; write_state(B, p); notify(B.get("mail", [])[old:]); s.out(200, "{}")
                except PermissionError: s.out(423, '{"error":"close the Excel file"}')
            return
        s.out(404, "{}")
    def log_message(s, *a): pass

def is_persistent():
    """False when DATA_DIR is on the container's own disk (data is lost on every redeploy/restart)."""
    if not os.environ.get("DATA_DIR"): return True
    try: return os.stat(BASE).st_dev != os.stat("/").st_dev or os.environ.get("ASSUME_PERSISTENT") == "1"
    except OSError: return True
def make_backup(photos=False):
    import io, zipfile
    b = io.BytesIO()
    with zipfile.ZipFile(b, "w", zipfile.ZIP_DEFLATED) as z:
        for f in glob.glob(os.path.join(BASE, "*")):
            if os.path.isfile(f) and not f.endswith((".tmp", ".bak")): z.write(f, os.path.basename(f))
        if photos:
            for f in glob.glob(os.path.join(BASE, "photos", "*")): z.write(f, "photos/" + os.path.basename(f))
    return b.getvalue()
def daily_backup():
    d = os.path.join(BASE, "backups"); os.makedirs(d, exist_ok=True); fn = os.path.join(d, time.strftime("%Y-%m-%d") + ".zip")
    if os.path.exists(fn): return
    with LOCK: data = make_backup(False)
    open(fn, "wb").write(data)
    for old in sorted(glob.glob(os.path.join(d, "*.zip")))[:-14]: os.remove(old)

def saturday_loop():
    # every Saturday (server clock), email site engineers who have an address, if SMTP is configured
    while True:
        try:
            now = dt.datetime.now()
            if now.weekday() == 5 and now.hour >= 7 and (os.environ.get("SMTP_HOST") or wa_provider()):
                with LOCK:
                    c = company(); day = now.strftime("%Y-%m-%d")
                    if c.get("pph_last") != day:
                        c["pph_last"] = day; save_json(COMPANY_FILE, c); todo = [x for x in users() if x.get("role") == "Site engineer" and (x.get("email") or x.get("phone")) and x.get("status", "active") == "active"]
                    else: todo = []
                for x in todo: deliver(x.get("email"), x.get("phone"), "Weekly progress photos", "It is Saturday. Please open Fenestra Site > Progress photos and upload this week's photos, tagged by building and elevation.")
            if now.hour >= 2: daily_backup()
        except Exception: pass
        time.sleep(600)

if __name__ == "__main__":
    port = int(sys.argv[sys.argv.index("--port") + 1]) if "--port" in sys.argv else int(os.environ.get("PORT", 8000))
    users()
    if not os.path.exists(dbp("LR001")) and os.path.exists(os.path.join(APP, "seed_state.json")): write_state(json.load(open(os.path.join(APP, "seed_state.json"))), "LR001")
    print(f"Open http://localhost:{port}" + ("   LAN: http://<this-laptop-ip>:%d" % port if "--lan" in sys.argv else ""))
    if os.environ.get("SEED_DEMO_USERS", "1") != "0": print("First logins: user names management, pm, planner, siteeng, qe, hse, contractor, production. Password azal2026 (you must change it at first login).")
    print("Email:", "on" if os.environ.get("SMTP_HOST") else "off", "| WhatsApp:", wa_provider() or "off", "| AI guide:", "on" if os.environ.get("ANTHROPIC_API_KEY") else "off")
    if not is_persistent(): print("WARNING: %s is not a mounted volume. Users and project data will be LOST on every redeploy or restart. Attach a persistent volume at %s (set ASSUME_PERSISTENT=1 if it is persistent but not detected)." % (BASE, BASE))
    threading.Thread(target=saturday_loop, daemon=True).start()
    ThreadingHTTPServer.daemon_threads = True
    ThreadingHTTPServer(("0.0.0.0" if ("--lan" in sys.argv or os.environ.get("PORT")) else "127.0.0.1", port), H).serve_forever()
