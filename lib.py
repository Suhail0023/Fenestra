# Fenestra Site - Copyright (c) 2026 Charles Couteau. All rights reserved.
# Proprietary and confidential. Unauthorised copying, modification, distribution or reverse engineering is prohibited. See LICENSE.txt.
"""Project library: drawings, specifications, method statements and other files, stored in fenestra.db."""
import datetime as dt, sqlite3

DB_FILE = None
CATS = ["Drawings", "Specifications", "Method statements", "Templates", "Reports", "Contracts", "Other"]
MAX_BYTES = 8_500_000


def init(db_file):
    global DB_FILE; DB_FILE = db_file
    c = _c()
    c.execute("""CREATE TABLE IF NOT EXISTS library (id INTEGER PRIMARY KEY AUTOINCREMENT, project TEXT NOT NULL, category TEXT, title TEXT, filename TEXT, mime TEXT,
                 size INTEGER, rev TEXT, shared INTEGER DEFAULT 0, by TEXT, at TEXT, voided INTEGER DEFAULT 0, data BLOB)""")
    c.commit(); c.close()


def _c():
    c = sqlite3.connect(DB_FILE, timeout=30); c.row_factory = sqlite3.Row; return c


def listing(project, shared_only=False):
    c = _c()
    try:
        q = "SELECT id, category, title, filename, mime, size, rev, shared, by, at FROM library WHERE project=? AND voided=0" + (" AND shared=1" if shared_only else "") + " ORDER BY category, title, id DESC"
        return [dict(r) for r in c.execute(q, (project,))]
    finally: c.close()


def add(project, category, title, filename, mime, raw, rev, shared, by):
    if not raw: raise ValueError("empty file")
    if len(raw) > MAX_BYTES: raise ValueError("file too large (max 8 MB)")
    category = category if category in CATS else "Other"
    c = _c()
    try:
        cur = c.execute("INSERT INTO library (project, category, title, filename, mime, size, rev, shared, by, at, data) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                        (project, category, (title or filename or "File")[:200], (filename or "file")[:200], (mime or "application/octet-stream")[:100], len(raw), (rev or "")[:20], 1 if shared else 0, by, dt.datetime.now().strftime("%Y-%m-%d %H:%M"), raw))
        c.commit(); return cur.lastrowid
    finally: c.close()


def get(project, id_, shared_only=False):
    c = _c()
    try:
        r = c.execute("SELECT filename, mime, data, shared, by FROM library WHERE project=? AND id=? AND voided=0", (project, id_)).fetchone()
        if not r or (shared_only and not r["shared"]): return None
        return r["filename"], r["mime"], bytes(r["data"])
    finally: c.close()


def owner(project, id_):
    c = _c()
    try:
        r = c.execute("SELECT by FROM library WHERE project=? AND id=?", (project, id_)).fetchone(); return r["by"] if r else None
    finally: c.close()


def remove(project, id_):
    c = _c()
    try: c.execute("UPDATE library SET voided=1, data=NULL WHERE project=? AND id=?", (project, id_)); c.commit()
    finally: c.close()
