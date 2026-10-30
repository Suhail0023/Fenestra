# FenOps - Copyright (c) 2026 Charles Couteau. All rights reserved.
# Proprietary and confidential. Unauthorised copying, modification, distribution or reverse engineering is prohibited. See LICENSE.txt.
"""Server-side watcher: delegation deadline alarms, daily PM reminders and unassigned-task notices.

Runs on the server so the alarms go out even when nobody has the app open.
Settings live in the project state under "dlg" (editable in Setup):
  hrs   hours the project manager has to delegate a task once it is due for delegation (default 24)
  lead  a task is due for delegation this many days before its start (default 30, same as the Delegate resources tab)
  soon  a task starting within this many days (or already started) with nobody assigned is reported as unassigned (default 7)
  hour  local server hour after which daily reminders and digests are sent (default 8)
  on    switch for the whole watcher
Nothing here writes to the project state; sent notices are remembered in the notices table.
"""
import datetime as dt, json, sqlite3

DEFAULTS = {"on": True, "hrs": 24, "lead": 30, "soon": 7, "hour": 8}


def init(db_file):
    c = sqlite3.connect(db_file, timeout=30)
    c.execute("CREATE TABLE IF NOT EXISTS notices (project TEXT, key TEXT, at TEXT, PRIMARY KEY (project, key))")
    c.commit(); c.close()


def cfg(state):
    d = dict(DEFAULTS); x = (state or {}).get("dlg")
    if isinstance(x, dict):
        for k in DEFAULTS:
            if k in x and x[k] is not None:
                try: d[k] = bool(x[k]) if k == "on" else float(x[k]) if k == "hrs" else int(x[k])
                except (TypeError, ValueError): pass
    return d


def _d(s):
    try: return dt.date.fromisoformat(str(s)[:10])
    except ValueError: return None


def _leaves(state):
    out = []
    for i in (state or {}).get("items") or []:
        if not isinstance(i, dict) or not i.get("dur") or i.get("vg"): continue
        st = i.get("start"); s = _d(st) if st else None
        if not s: continue
        if i.get("st") == "comp" or (i.get("done") or 0) >= 100: continue
        out.append(dict(id=i.get("id"), name=i.get("name") or "", start=s, st=i.get("st") or "plan", eng=i.get("eng") or ""))
    return out


def _seen(c, project, key):
    r = c.execute("SELECT at FROM notices WHERE project=? AND key=?", (project, key)).fetchone()
    return r[0] if r else None


def _mark(c, project, key, at):
    c.execute("INSERT OR IGNORE INTO notices (project, key, at) VALUES (?,?,?)", (project, key, at))


def status(db_file, project, state, now=None, record=True):
    """Which tasks are overdue for delegation and which are unassigned right now.
    With record=True the first moment a task was seen as due for delegation is stored (that starts its clock)."""
    now = now or dt.datetime.now(); today = now.date(); g = cfg(state)
    c = sqlite3.connect(db_file, timeout=30)
    try:
        due, over, unas = [], [], []
        for l in _leaves(state):
            if l["st"] == "plan" and (l["start"] - today).days <= g["lead"]:
                key = "due|%s" % l["id"]; first = _seen(c, project, key)
                if not first:
                    first = now.isoformat(timespec="seconds")
                    if record: _mark(c, project, key, first)
                t0 = max(dt.datetime.fromisoformat(first), dt.datetime.combine(l["start"] - dt.timedelta(days=g["lead"]), dt.time(0, 0)))
                age = (now - t0).total_seconds() / 3600.0
                row = dict(id=l["id"], name=l["name"], start=l["start"].isoformat(), age_h=round(age, 1), due_since=t0.isoformat(timespec="minutes"))
                due.append(row)
                if age >= g["hrs"]: over.append(row)
            if l["st"] in ("plan", "res") and not l["eng"] and (l["start"] - today).days <= g["soon"]:
                unas.append(dict(id=l["id"], name=l["name"], start=l["start"].isoformat(), days_to_start=(l["start"] - today).days, st=l["st"]))
        if record: c.commit()
        return {"cfg": g, "due": due, "overdue": sorted(over, key=lambda x: -x["age_h"]), "unassigned": sorted(unas, key=lambda x: x["start"])}
    finally: c.close()


def _contact(state, users, key, role=None):
    """(email, phone, name) from the project contacts, else from the first user with that role."""
    x = ((state or {}).get("contacts") or {}).get(key) or {}
    if x.get("email") or x.get("phone"): return [(x.get("email") or "", x.get("phone") or "", x.get("name") or key)]
    out = []
    for u in users or []:
        if u.get("role") == (role or key) and (u.get("email") or u.get("phone")) and u.get("status", "active") == "active":
            out.append((u.get("email") or "", u.get("phone") or "", u.get("name") or key))
    return out


def _fmt(rows, extra):
    return "\n".join("  - %s (starts %s%s)" % (r["name"], r["start"], extra(r)) for r in rows[:40]) + ("\n  ... and %d more" % (len(rows) - 40) if len(rows) > 40 else "")


def run_once(db_file, projects, read_state, deliver, users, now=None, project_name=lambda p: p):
    """One pass over all projects. deliver(email, phone, subject, body). Returns a list of what was sent."""
    now = now or dt.datetime.now(); sent = []; init(db_file)
    for p in projects:
        try: st = read_state(p)
        except Exception: continue
        if not st: continue
        g = cfg(st)
        if not g["on"]: continue
        S = status(db_file, p, st, now); day = now.date().isoformat(); late_hour = now.hour >= g["hour"]
        c = sqlite3.connect(db_file, timeout=30)
        try:
            def once(key):
                if _seen(c, p, key): return False
                _mark(c, p, key, now.isoformat(timespec="seconds")); c.commit(); return True
            def send(to, subject, body, kind):
                for em, ph, nm in to:
                    try: deliver(em, ph, subject, body)
                    except Exception: pass
                    sent.append({"project": p, "kind": kind, "to": em or ph, "subject": subject})
            pn = project_name(p); mgmt = _contact(st, users, "Management"); plan = _contact(st, users, "Planning engineer"); pm = _contact(st, users, "Project manager")
            # 1) 24 h alarm: tasks the project manager has not delegated in time; tell Management and the planner once per task
            new = [r for r in S["overdue"] if once("esc|%s" % r["id"])]
            if new:
                send(mgmt + plan, "ALARM: %d task(s) not delegated within %g hours - %s" % (len(new), g["hrs"], pn),
                     "The project manager has not delegated the following task(s) within %g hours of them becoming due for delegation (%d days before start):\n\n%s\n\nThe project manager will be reminded every day until they are delegated.\nOpen FenOps > Delegate resources."
                     % (g["hrs"], g["lead"], _fmt(new, lambda r: ", waiting %d h" % round(r["age_h"]))), "escalation")
            # 2) daily reminder to the project manager while any overdue task remains
            if S["overdue"] and late_hour and once("rem|%s" % day):
                send(pm, "Reminder: %d task(s) still not delegated - %s" % (len(S["overdue"]), pn),
                     "These tasks are still waiting for delegation:\n\n%s\n\nYou will get this reminder every day until they are all delegated (Delegate resources, then Task delegation)." % _fmt(S["overdue"], lambda r: ", waiting %d h" % round(r["age_h"])), "pm-reminder")
            # 3) daily digest of unassigned tasks to Management and the planner
            if S["unassigned"] and late_hour and once("dig|%s" % day):
                send(mgmt + plan, "Unassigned tasks: %d - %s" % (len(S["unassigned"]), pn),
                     "These tasks start within %d days (or have started) and still have nobody assigned:\n\n%s\n\nThis notice repeats daily until every task has a site engineer assigned."
                     % (g["soon"], _fmt(S["unassigned"], lambda r: ", %s" % ("starts in %d day(s)" % r["days_to_start"] if r["days_to_start"] >= 0 else "started %d day(s) ago" % -r["days_to_start"]))), "unassigned-digest")
        finally: c.close()
    return sent
